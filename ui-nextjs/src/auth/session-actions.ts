"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Interfaces para melhor tipagem
interface UserData {
  email: string;
  usuario: string;
}

interface SessionData {
  user: UserData;
  expires: Date;
}

// Recomendado usar variável de ambiente
const secretKey = process.env.JWT_SECRET_KEY || "seu_secret_key_seguro";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Set the algorithm for JWT signing
    .setIssuedAt() // Set the issuance time of the JWT
    .setExpirationTime("10s") // 10 segundos
    .sign(key); // Sign the JWT using the secret key
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"], // Specify the allowed algorithms for JWT verification
  });
  return payload; // Return the decrypted payload
}

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;

    // Validação básica do email
    if (!email) {
      throw new Error("Email é obrigatório");
    }

    // Validação simplificada apenas com email
    const isValidCredential = await validateCredentials(email);
    if (!isValidCredential) {
      throw new Error("Email inválido");
    }

    const user: UserData = { email, usuario: "admin" };

    // Tempo de expiração: 10 segundos
    const expires = new Date(Date.now() + 10 * 1000);
    const session = await encrypt({ user, expires });

    const cookieStore = await cookies();
    cookieStore.set("authToken", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Opcional: Criar refresh token
    const refreshToken = await generateRefreshToken(user);
    cookieStore.set("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 60 * 1000), // 60 segundos
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

async function validateCredentials(email: string): Promise<boolean> {
  // Implementar validação real com seu backend/banco de dados
  // Por enquanto apenas verifica se o email existe
  return email.length > 0;
}

async function generateRefreshToken(user: UserData): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("authToken", "", { expires: new Date(0) });
  cookieStore.set("refreshToken", "", { expires: new Date(0) });
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("authToken")?.value;

    if (!session) return null;

    const decoded = await decrypt(session);

    // Verificar se a sessão expirou
    if (new Date(decoded.expires) < new Date()) {
      // Tentar usar refresh token
      const refreshToken = cookieStore.get("refreshToken")?.value;
      if (refreshToken) {
        return await refreshSession(refreshToken);
      }
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    return null;
  }
}

async function refreshSession(
  refreshToken: string
): Promise<SessionData | null> {
  // Implementar lógica de refresh token
  // ...
  return null;
}

export async function updateSession(request: NextRequest) {
  try {
    const session = request.cookies.get("authToken")?.value; // Retrieve the session cookie value from the request
    if (!session) return; // If session is not found, return

    // Refresh the session expiration time
    const parsed = await decrypt(session); // Decrypt the session data
    parsed.expires = new Date(Date.now() + 10 * 1000); // 10 segundos
    const res = NextResponse.next(); // Create a new response
    res.cookies.set({
      name: "authToken",
      value: await encrypt(parsed), // Encrypt and set the updated session data
      httpOnly: true,
      expires: parsed.expires, // Set the expiration time
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res; // Return the response
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error);
    return NextResponse.next();
  }
}
