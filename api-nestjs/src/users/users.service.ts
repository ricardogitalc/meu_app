import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      firstName: 'Ricardo',
      lastName: 'Alcantara',
      email: 'ricardo@gmail.com',
      role: 'admin',
    },
    {
      id: 2,
      firstName: 'Samira',
      lastName: 'Souza',
      email: 'samira@gmail.com',
      role: 'user',
    },
  ];

  findOneByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email == email);
  }
}
