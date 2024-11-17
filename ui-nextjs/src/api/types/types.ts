export interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  jwt_token?: string;
}
