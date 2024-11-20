export class UserEntity {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
  imageUrl?: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
