import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { User } from "./interfaces/interfaces";
import { RefreshToken200 } from "./api/api.schemas";

const secretKey =
  "986c0859540006e4aa01aea281858ec3a8e673aa311b112bc87f5d6de0e2389b";
const key = new TextEncoder().encode(secretKey);

export async function verifyJWT(
  token: string,
  secretKey: Uint8Array
): Promise<any> {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS512"],
  });
  return payload;
}

interface BaseAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

export async function login(response: BaseAuthResponse) {
  if (!response.accessToken || !response.refreshToken || !response.user) {
    throw new Error("Dados de login inválidos");
  }

  await verifyJWT(response.accessToken, key);
  const cookieStore = await cookies();

  await cookieStore.set("accessToken", response.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  await cookieStore.set("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response.user;
}

export async function logout() {
  const cookieStore = await cookies();
  await cookieStore.set("accessToken", "", { expires: new Date(0), path: "/" });
  await cookieStore.set("refreshToken", "", {
    expires: new Date(0),
    path: "/",
  });
  redirect("/login");
}

// Função auxiliar para pegar tokens
async function getTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value,
    refreshToken: cookieStore.get("refreshToken")?.value,
  };
}

export async function getSession(): Promise<User | null> {
  const { accessToken, refreshToken } = await getTokens();

  if (!accessToken && !refreshToken) return null;

  if (accessToken) {
    try {
      const payload = await verifyJWT(accessToken, key);
      return {
        id: Number(payload.sub), // Converter para número
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        whatsappNumber: payload.whatsappNumber,
        imageUrl: payload.imageUrl,
        verified: payload.verified,
      };
    } catch (error) {
      // Silenciosamente falha e tenta refresh token
    }
  }

  if (refreshToken) {
    try {
      const refreshResponse = await refreshTokenRequest(refreshToken);
      if (refreshResponse.accessToken && refreshResponse.user) {
        const cookieStore = await cookies();
        await cookieStore.set("accessToken", refreshResponse.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return refreshResponse.user;
      }
    } catch (error) {
      console.error("Erro ao atualizar token:", error);
    }
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  const { accessToken, refreshToken } = await getTokens();

  if (!accessToken && !refreshToken) {
    return { session: null, response: NextResponse.next() };
  }

  if (accessToken) {
    try {
      const payload = await verifyJWT(accessToken, key);
      return {
        session: {
          user: {
            id: payload.sub,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            whatsappNumber: payload.whatsappNumber,
            imageUrl: payload.imageUrl,
            verified: payload.verified,
          },
        },
        response: NextResponse.next(),
      };
    } catch {
      // Token expirado, continua para refresh
    }
  }

  if (refreshToken) {
    try {
      const refreshResponse = await refreshTokenRequest(refreshToken);
      if (refreshResponse.accessToken && refreshResponse.user) {
        const response = NextResponse.next();
        response.cookies.set({
          name: "accessToken",
          value: refreshResponse.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return {
          session: { user: refreshResponse.user },
          response,
        };
      }
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error);
    }
  }

  return await handleAuthFailure(request);
}

async function handleAuthFailure(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("accessToken", "", { expires: new Date(0) });
  response.cookies.set("refreshToken", "", { expires: new Date(0) });
  return { session: null, response };
}

export async function handleGoogleLogin(code: string) {
  const response = await handleGoogleCallback(code);
  if (!response.accessToken || !response.refreshToken || !response.user) {
    throw new Error("Resposta inválida do Google OAuth");
  }
  return await login(response);
}

export async function updateUserSession(accessToken: string, user: User) {
  const cookieStore = await cookies();
  await cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return user;
}

async function refreshTokenRequest(
  token: string
): Promise<{ accessToken: string; user: User }> {
  const response = await fetch("http://localhost:3003/auth/refresh-token", {
    method: "GET",
    headers: {
      Cookie: `refreshToken=${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao atualizar token");
  }

  const data = (await response.json()) as RefreshToken200;

  if (!data.accessToken) {
    throw new Error("Token de acesso não recebido");
  }

  // Extrair dados do usuário do token
  const payload = await verifyJWT(data.accessToken, key);

  return {
    accessToken: data.accessToken,
    user: {
      id: Number(payload.sub),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      whatsappNumber: payload.whatsappNumber,
      imageUrl: payload.imageUrl,
      verified: payload.verified,
    },
  };
}

export async function handleGoogleCallback(code: string) {
  const response = await fetch(
    `http://localhost:3003/auth/google/callback?code=${code}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Falha na autenticação Google");
  }

  return await response.json();
}