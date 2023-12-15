import { Module } from '@nestjs/common';
import { SteamAuthController } from './steam-auth.controller';
import { SteamAuthService } from './steam-auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SteamAuthController],
  providers: [SteamAuthService, PrismaService],
})
export class SteamAuthModule {}
