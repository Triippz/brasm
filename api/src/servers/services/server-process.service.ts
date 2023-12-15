import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigFileService } from './config-file.service';
import { ProcessFactory } from '../../common/process-factory';
import { PathsFactory } from '../../common/paths-factory';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerProcessService {
  logger = new Logger(ServerProcessService.name);
  private readonly logDir: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configFilesService: ConfigFileService,
    private readonly processFactory: ProcessFactory,
    private readonly pathsFactory: PathsFactory,
    private readonly configService: ConfigService,
  ) {
    this.logDir = this.configService.get<string>('server.directory.logs');
  }
}
