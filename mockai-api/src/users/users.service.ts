import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma';
import type { CreateUserInput } from './users.type';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(query: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...query,
      },
    });
  }

  async create(userData: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async update(id: number, userData: Partial<CreateUserInput>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
