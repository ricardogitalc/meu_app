import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { refreshToken as refreshTokenRequest } from "./api/api";

const secretKey =
  "986c0859540006e4aa01aea281858ec3a8e673aa311b112bc87f5d6de0e2389b";
const key = new TextEncoder().encode(secretKey);

export async function verifyJWT(
  token: string,
  secretKey: Uint8Array
): Promise<any> {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

interface LoginResponse {
  jwt_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    whatsappNumber?: string;
    imageUrl?: string;
  };
  message: string;
}

export async function login(response: LoginResponse) {
  if (!response.jwt_token || !response.refresh_token || !response.user) {
    throw new Error("Dados de login inválidos");
  }

  const cookieStore = await cookies();

  try {
    await verifyJWT(response.jwt_token, key);

    cookieStore.set("accessToken", response.jwt_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    cookieStore.set("refreshToken", response.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response.user;
  } catch (error) {
    throw new Error("Falha ao processar login");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", "", { expires: new Date(0) });
  cookieStore.set("refreshToken", "", { expires: new Date(0) });
}

// Função auxiliar para pegar tokens
async function getTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value,
    refreshToken: cookieStore.get("refreshToken")?.value,
  };
}

export async function getSession() {
  const { accessToken, refreshToken } = await getTokens();

  if (!accessToken && !refreshToken) return null;

  try {
    if (accessToken) {
      try {
        const payload = await verifyJWT(accessToken, key);
        return {
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          whatsappNumber: payload.whatsappNumber,
          imageUrl: payload.imageUrl,
          verified: payload.verified,
        };
      } catch {
        // Token expirado, continua para refresh
      }
    }

    if (refreshToken) {
      const refreshResponse = await refreshTokenRequest(refreshToken);
      if (refreshResponse.jwt_token && refreshResponse.user) {
        const cookieStore = await cookies();
        cookieStore.set("accessToken", refreshResponse.jwt_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return refreshResponse.user;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const { accessToken, refreshToken } = await getTokens();

  if (!accessToken && !refreshToken) {
    return { session: null, response: NextResponse.next() };
  }

  try {
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
      const refreshResponse = await refreshTokenRequest(refreshToken);
      if (refreshResponse.jwt_token && refreshResponse.user) {
        const response = NextResponse.next();
        response.cookies.set({
          name: "accessToken",
          value: refreshResponse.jwt_token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return {
          session: { user: refreshResponse.user },
          response,
        };
      }
    }

    return await handleAuthFailure(request);
  } catch {
    return await handleAuthFailure(request);
  }
}

async function handleAuthFailure(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("accessToken", "", { expires: new Date(0) });
  response.cookies.set("refreshToken", "", { expires: new Date(0) });
  return { session: null, response };
}
