import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InstallServerRequest } from '../dtos/install-server-request';
import { SteamCmdService } from '../../steamcmd/services/steam-cmd.service';
import { SteamCmdJob } from '../../steamcmd/dtos/steam-cmd-job';
import {
  ErrorStatus,
  InstallationStatus,
  ServerInstallation,
} from '@prisma/client';
import { TestRunService } from './test-run.service';

@Injectable()
export class InstallerService {
  logger = new Logger(InstallerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly steamCmdService: SteamCmdService,
    private readonly testRunService: TestRunService,
  ) {}

  async installServer(
    installServerRequest: InstallServerRequest,
  ): Promise<void> {
    const serverInstall = await this.prismaService.serverInstallation.create({
      data: {
        type: installServerRequest.serverType,
      },
    });

    const steamCmdJob = await this.steamCmdService.installOrUpdateServer(
      installServerRequest.serverType,
    );
    await this.handleInstallation(steamCmdJob, serverInstall);
  }

  private async handleInstallation(
    steamCmdJob: SteamCmdJob,
    server: ServerInstallation,
  ) {
    if (steamCmdJob.errorStatus) {
      this.logger.error(
        `SteamCmdJob failed with status: ${steamCmdJob.errorStatus}`,
      );
      this.prismaService.serverInstallation.update({
        where: { id: server.id },
        data: {
          errorStatus: steamCmdJob.errorStatus,
        },
      });
      return;
    }

    try {
      this.logger.log(
        "Server '{}' successfully downloaded, verifying...",
        server.type,
      );
      await this.testRunService.performServerDryRun(server);
      this.logger.log("Server '{}' successfully installed", server.type);
      server.lastUpdatedAt = new Date();
      server.installationStatus = InstallationStatus.FINISHED;
    } catch (error) {
      this.logger.error(
        "Server '{}' failed to start after installation",
        server.type,
        error,
      );
      server.installationStatus = InstallationStatus.ERROR;
      server.errorStatus = ErrorStatus.GENERIC;
    }
  }
}
