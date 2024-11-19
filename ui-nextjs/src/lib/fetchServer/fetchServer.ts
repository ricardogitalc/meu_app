import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchServer = async (): Promise<Response> => {
  const jwt_token = (await cookies()).get("jwt_token");

  const response = await fetch("YOUR_API_URL_HERE", {
    headers: new Headers({
      Authorization: `Bearer ${jwt_token?.value}`,
    }),
  });

  if (response.status === 401) {
    redirect("/");
  }

  return response;
};
