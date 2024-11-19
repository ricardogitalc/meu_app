export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string; // Alterado de number para string e adicionado ? para opcional
  createdAt?: Date;
  updatedAt?: Date;
}
