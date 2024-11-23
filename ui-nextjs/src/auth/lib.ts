import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const refreshKey = "refresh-secret";
const key = new TextEncoder().encode(secretKey);
const refreshTokenKey = new TextEncoder().encode(refreshKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Define o algoritmo para assinatura JWT
    .setIssuedAt() // Define o horário de emissão do JWT
    .setExpirationTime("30 sec from now") // Define o tempo de expiração do JWT
    .sign(key); // Assina o JWT usando a chave secreta
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"], // Especifica os algoritmos permitidos para verificação JWT
  });
  return payload; // Retorna o payload descriptografado
}

async function generateRefreshToken(payload: any) {
  const refreshTokenExpires = new Date(Date.now() + 60 * 1000); // 1 minuto
  return await new SignJWT({ ...payload, expires: refreshTokenExpires })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1m")
    .sign(refreshTokenKey);
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, refreshTokenKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function login(formData: FormData) {
  const user = { email: formData.get("email"), name: "John" };

  const accessTokenExpires = new Date(Date.now() + 10 * 1000);
  const accessToken = await encrypt({ user, expires: accessTokenExpires });

  const refreshToken = await generateRefreshToken({ user });
  const refreshTokenExpires = new Date(Date.now() + 60 * 1000); // 1 minuto

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    expires: accessTokenExpires,
    httpOnly: true,
  });
  cookieStore.set("refreshToken", refreshToken, {
    expires: refreshTokenExpires, // Novo tempo de expiração
    httpOnly: true,
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", "", { expires: new Date(0) });
  cookieStore.set("refreshToken", "", { expires: new Date(0) });
}

export async function getSession() {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) return null;
  return await decrypt(accessToken);
}

export async function updateSession(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) return;

  try {
    if (accessToken) {
      const parsed = await decrypt(accessToken);
      if (new Date(parsed.expires) > new Date()) {
        return NextResponse.next();
      }
    }

    if (refreshToken) {
      const refreshData = await verifyRefreshToken(refreshToken);
      if (refreshData) {
        const newExpires = new Date(Date.now() + 10 * 1000);
        const newAccessToken = await encrypt({
          user: refreshData.user,
          expires: newExpires,
        });

        const res = NextResponse.next();
        res.cookies.set({
          name: "accessToken",
          value: newAccessToken,
          httpOnly: true,
          expires: newExpires,
        });
        return res;
      }
    }
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.set("accessToken", "", { expires: new Date(0) });
    res.cookies.set("refreshToken", "", { expires: new Date(0) });
    return res;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
