import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServerInstallationListResponse } from '../dtos/server-installation-list-response';
import { plainToInstance } from 'class-transformer';
import { ServerInstallationResponse } from '../dtos/server-installation-response';
import { InstallationStatus } from '@prisma/client';

@Injectable()
export class ServerInstallationService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllAvailableServerInstallations(): Promise<
    ServerInstallationResponse[]
  > {
    const installs = await this.prismaService.serverInstallation.findMany({
      where: {
        installationStatus: InstallationStatus.FINISHED,
      },
    });

    return installs.map((install) =>
      plainToInstance(ServerInstallationResponse, install),
    );
  }

  async findOne(id: number): Promise<ServerInstallationResponse> {
    const install = await this.prismaService.serverInstallation.findUnique({
      where: {
        id,
      },
    });

    return plainToInstance(ServerInstallationResponse, install);
  }
}
