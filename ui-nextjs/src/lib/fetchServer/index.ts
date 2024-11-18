import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchServer = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const jwt_token = (await cookies()).get("jwt_token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${jwt_token?.value}`,
    },
  });

  if (response.status === 401) {
    redirect("/");
  }

  return response;
};
