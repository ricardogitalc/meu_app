import { cookies } from "next/headers";
import { getSession, verifyRefreshToken } from "@/auth/lib";

export default async function TestAuthPage() {
  const session = await getSession();
  const refreshToken = (await cookies()).get("refreshToken")?.value;
  const refreshTokenData = refreshToken
    ? await verifyRefreshToken(refreshToken)
    : null;

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Dados do Access Token:</h2>
          <pre className="mt-2">{JSON.stringify(session, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Status da Autenticação:</h2>
          {session && (
            <p>
              Access Token Expira em:{" "}
              {new Date(session.expires).toLocaleString()}
            </p>
          )}
          {refreshTokenData && (
            <>
              <p>
                Refresh Token Expira em:{" "}
                {new Date(refreshTokenData.expires).toLocaleString()}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
