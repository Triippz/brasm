import { Module } from '@nestjs/common';
import { SteamCmdService } from './services/steam-cmd.service';
import { PathsFactory } from '../common/paths-factory';
import { SteamCmdExecutor } from './services/steam-cmd-executor';
import { ConfigService } from '@nestjs/config';
import { SteamAuthService } from '../steam-auth/steam-auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    SteamCmdService,
    PathsFactory,
    SteamCmdExecutor,
    ConfigService,
    SteamAuthService,
  ],
})
export class SteamCmdModule {}
