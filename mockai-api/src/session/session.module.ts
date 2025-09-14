import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SessionService, PrismaService],
  controllers: [SessionController],
})
export class SessionModule {}
