import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { LoginInput, RegisterInput } from './auth.type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput) {
    const { email, password } = loginInput;

    const user = await this.usersService.findOne({
      email,
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async register(registerInput: RegisterInput) {
    const { username, email, password, confirmPassword } = registerInput;
    const existingUser = await this.usersService.findOne({
      email,
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
}
