import { User } from 'generated/prisma';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};
