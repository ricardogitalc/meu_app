import { console } from "inspector";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Define uma chave secreta para criptografia JWT
const secretKey =
  "986c0859540006e4aa01aea281858ec3a8e673aa311b112bc87f5d6de0e2389b";

// Codifica a chave secreta em bytes
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Define o algoritmo para assinatura JWT
    .setIssuedAt() // Define o horário de emissão do JWT
    .setExpirationTime("10 sec from now") // Define o tempo de expiração do JWT
    .sign(key); // Assina o JWT usando a chave secreta
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"], // Especifica os algoritmos permitidos para verificação JWT
  });
  return payload; // Retorna o payload descriptografado
}

export async function login(formData: FormData) {
  // Verifica credenciais && obtém o usuário

  // Dados mockados do usuário
  const user = { email: formData.get("email"), name: "John" };

  // Cria a sessão
  const expires = new Date(Date.now() + 10 * 1000); // Define o tempo de expiração da sessão (10 segundos a partir de agora)
  const session = await encrypt({ user, expires }); // Criptografa os dados do usuário e define o tempo de expiração

  // Salva a sessão em um cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true }); // Define o cookie de sessão com tempo de expiração e flag HTTP only
}

export async function logout() {
  // Destrói a sessão limpando o cookie de sessão
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return; // Se a sessão não for encontrada, retorna

  // Atualiza o tempo de expiração da sessão
  const parsed = await decrypt(session); // Descriptografa os dados da sessão
  parsed.expires = new Date(Date.now() + 10 * 1000); // Define um novo tempo de expiração (10 segundos a partir de agora)
  const res = NextResponse.next(); // Cria uma nova resposta
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed), // Criptografa e define os dados atualizados da sessão
    httpOnly: true,
    expires: parsed.expires, // Define o tempo de expiração
  });
  return res; // Retorna a resposta
}
