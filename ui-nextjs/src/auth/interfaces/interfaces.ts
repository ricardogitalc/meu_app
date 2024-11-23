// Interfaces
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
  imageUrl?: string;
  verified: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  message: string;
  login_token: string;
  verify_url: string;
}

interface AuthResponse {
  message: string;
  status: number;
  user: User;
  jwt_token: string;
  refresh_token?: string;
}

interface RegisterResponse {
  message: string;
  register_token: string;
  verify_url: string;
}

export type { User, LoginResponse, AuthResponse, RegisterResponse };
