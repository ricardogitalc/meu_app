interface LoginRequest {
  destination: string;
}

interface LoginResponse {
  login_token: string;
  verify_url: string;
  message: string;
}

interface VerifyLoginResponse {
  jwt_token: string;
}

interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
}

interface RegisterResponse {
  message: string;
  register_token: string;
  verify_url: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
  imageUrl?: string;
  verified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type {
  LoginRequest,
  LoginResponse,
  VerifyLoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
};
