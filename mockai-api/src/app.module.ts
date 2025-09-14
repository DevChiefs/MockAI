import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => SessionModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
