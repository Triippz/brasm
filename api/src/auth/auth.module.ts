import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    JwtService,
  ],
})
export class AuthModule {}
