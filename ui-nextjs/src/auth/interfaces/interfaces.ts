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
}

export interface LoginResponse extends BaseAuthResponse {}

export interface RegisterResponse {
  message: string;
  register_token: string;
  verify_url: string;
}

// Removemos a exportação duplicada e usamos BaseAuthResponse como base
export type AuthResponse = BaseAuthResponse;
