import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ServerController } from './controllers/server.controller';
import { ServerInstanceService } from './services/server-instance.service';
import { ServerProcessService } from './services/server-process.service';
import { ServerLogsService } from './services/server-logs.service';
import { ConfigFileService } from './services/config-file.service';

@Module({
  imports: [ServerController],
  controllers: [],
  providers: [
    PrismaService,
    ConfigService,
    ServerInstanceService,
    ServerProcessService,
    ServerLogsService,
    ConfigFileService,
  ],
})
export class ServersModule {}
