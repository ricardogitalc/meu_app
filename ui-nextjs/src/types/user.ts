export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
  imageUrl?: string;
  verified?: boolean;
}
