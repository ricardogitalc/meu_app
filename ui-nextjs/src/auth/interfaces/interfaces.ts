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
  jwt_token: string;
  refresh_token: string;
  status: number;
}

export interface RegisterResponse {
  message: string;
  register_token: string;
  verify_url: string;
}

export interface LoginResponse extends BaseAuthResponse {}
export type AuthResponse = BaseAuthResponse;
export * from "./interfaces";
