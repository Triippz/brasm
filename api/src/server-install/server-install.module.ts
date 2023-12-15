import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServerInstallationController } from './controllers/server-installation.controller';
import { ServerInstallationService } from './services/server-installation.service';
import { InstallerService } from './services/installer.service';
import { TestRunService } from './services/test-run.service';
import { SteamCmdService } from '../steamcmd/services/steam-cmd.service';
import { PathsFactory } from '../common/paths-factory';
import { SteamCmdExecutor } from '../steamcmd/services/steam-cmd-executor';
import { ConfigService } from '@nestjs/config';
import { SteamAuthService } from '../steam-auth/steam-auth.service';
import { ProcessFactory } from '../common/process-factory';

@Module({
  imports: [],
  controllers: [ServerInstallationController],
  providers: [
    PrismaService,
    ServerInstallationService,
    InstallerService,
    TestRunService,
    SteamCmdService,
    PathsFactory,
    SteamCmdExecutor,
    ConfigService,
    SteamAuthService,
    ProcessFactory,
  ],
})
export class ServerInstallModule {}
