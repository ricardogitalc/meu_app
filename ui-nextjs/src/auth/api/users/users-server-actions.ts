import { UpdateUserDto } from "../orval-api.schemas";

async function getBaseUrl() {
  return "http://localhost:3003";
}

export async function getUserDetailsAction() {
  const res = await fetch(`${await getBaseUrl()}/user/me/details`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function updateUserAction(data: UpdateUserDto) {
  const res = await fetch(`${await getBaseUrl()}/user/me/update`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function deleteUserAction() {
  const res = await fetch(`${await getBaseUrl()}/user/me/delete`, {
    method: "DELETE",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function getUsersAction() {
  const res = await fetch(`${await getBaseUrl()}/user/users`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function findUserByIdAction(id: string) {
  const res = await fetch(`${await getBaseUrl()}/user/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function updateUserByIdAction(id: string, data: UpdateUserDto) {
  const res = await fetch(`${await getBaseUrl()}/user/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function deleteUserByIdAction(id: string) {
  const res = await fetch(`${await getBaseUrl()}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}
