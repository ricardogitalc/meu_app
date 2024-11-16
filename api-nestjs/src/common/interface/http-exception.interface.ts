export interface HttpExceptionResponse {
  path: string;
  statusCode: number;
  error: string;
  message: string | string[];
  details?: Record<string, any>;
}
