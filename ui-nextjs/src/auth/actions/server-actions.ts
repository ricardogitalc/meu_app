"use server";

import {
  login,
  registerUser,
  verifyLogin,
  verifyRegister,
  googleLogin,
  googleCallback,
  refreshToken,
  logout,
} from "../api/auth/auth";
import type { CreateUserDto, LoginDto } from "../api/orval-api.schemas";

export async function loginAction(data: LoginDto) {
  return login(data, {
    cache: "no-store",
    credentials: "include",
  });
}

export async function registerAction(data: CreateUserDto) {
  return registerUser(data, {
    cache: "no-store",
    credentials: "include",
  });
}

export async function verifyLoginAction() {
  return verifyLogin({
    cache: "no-store",
    credentials: "include",
  });
}

export async function verifyRegisterAction() {
  return verifyRegister({
    cache: "no-store",
    credentials: "include",
  });
}

export async function googleLoginAction() {
  return googleLogin({
    cache: "no-store",
    credentials: "include",
  });
}

export async function googleCallbackAction() {
  return googleCallback({
    cache: "no-store",
    credentials: "include",
  });
}

export async function refreshTokenAction() {
  return refreshToken({
    cache: "no-store",
    credentials: "include",
  });
}

export async function logoutAction() {
  return logout({
    cache: "no-store",
    credentials: "include",
  });
}
