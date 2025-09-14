import { Injectable } from '@nestjs/common';
import { Prisma, Session } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: Prisma.SessionWhereInput): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        ...query,
      },
    });
  }

  async findOne(query: Prisma.SessionWhereInput): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: {
        ...query,
      },
    });
  }

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({
      data,
    });
  }

  async update(id: number, data: Prisma.SessionUpdateInput): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Session> {
    return this.prisma.session.delete({
      where: { id },
    });
  }
}
