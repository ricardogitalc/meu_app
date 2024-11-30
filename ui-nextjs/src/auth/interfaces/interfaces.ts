export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
  imageUrl?: string;
  verified?: boolean;
}

export interface BaseAuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  status: number;
}

export interface RegisterResponse {
  message: string;
  registerToken: string;
  verifyUrl: string;
}

export interface LoginResponse extends BaseAuthResponse {}
export type AuthResponse = BaseAuthResponse;
export * from "./interfaces";
