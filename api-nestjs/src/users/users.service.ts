import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { CONFIG_MESSAGES } from 'src/config/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async UserFindUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    return user;
  }

  async UserFindById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.verified) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserAlReady);
    }

    if (existingUser && !existingUser.verified) {
      return this.prisma.user.update({
        where: { email: data.email },
        data,
      });
    }

    return this.prisma.user.create({
      data,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    if (!users.length) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    return users;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    const existingUser = await this.prisma.user.findUnique({
      where,
    });

    if (!existingUser) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where,
    });

    if (!existingUser) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    return this.prisma.user.delete({
      where,
    });
  }

  async updateUserById(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const existingUser = await this.UserFindById(id);

    if (!existingUser) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUserById(id: number): Promise<User> {
    const existingUser = await this.UserFindById(id);

    if (!existingUser) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
