import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'generated/prisma';
import type { CreateUserInput } from './users.type';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request as ExpressRequest } from 'express';

interface JwtPayload {
  id: string;
  email: string;
}

interface AuthenticatedRequest extends ExpressRequest {
  user?: JwtPayload;
}

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCurrentUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<User | null> {
    const userId = req.user?.id;
    if (!userId) {
      return null;
    }
    return this.usersService.findById(parseInt(userId, 10));
  }

  @Post()
  create(
    @Body()
    userData: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(userData);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body()
    userData: Partial<CreateUserInput>,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<User> {
    return this.usersService.delete(id);
  }
}
