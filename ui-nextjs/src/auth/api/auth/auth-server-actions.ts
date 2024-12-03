"use client";

import { CreateUserDto, LoginDto } from "../orval-api.schemas";

async function getBaseUrl() {
  return "http://localhost:3003";
}

export async function loginAction(data: LoginDto) {
  const res = await fetch(`${await getBaseUrl()}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function registerAction(data: CreateUserDto) {
  const res = await fetch(`${await getBaseUrl()}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function verifyLoginAction(loginToken?: string) {
  const res = await fetch(`${await getBaseUrl()}/auth/verify-login`, {
    method: "GET",
    credentials: "include",
    headers: {
      loginToken: loginToken || "",
      "Content-Type": "application/json",
    },
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function verifyRegisterAction(registerToken?: string) {
  const res = await fetch(`${await getBaseUrl()}/auth/verify-register`, {
    method: "GET",
    credentials: "include",
    headers: {
      registerToken: registerToken || "",
    },
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function googleLoginAction() {
  const res = await fetch(`${await getBaseUrl()}/auth/google`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function googleCallbackAction() {
  const res = await fetch(`${await getBaseUrl()}/auth/google/callback`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function refreshTokenAction() {
  const res = await fetch(`${await getBaseUrl()}/auth/refresh-token`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}

export async function logoutAction() {
  const res = await fetch(`${await getBaseUrl()}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });
  return {
    data: await res.json(),
    status: res.status,
  };
}
