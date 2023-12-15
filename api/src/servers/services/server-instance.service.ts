import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigFileService } from './config-file.service';
import { ServerProcessService } from './server-process.service';

@Injectable()
export class ServerInstanceService {
  logger = new Logger(ServerInstanceService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configFilesService: ConfigFileService,
    private readonly processService: ServerProcessService,
  ) {}
}
