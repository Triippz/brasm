import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [SystemController],
  providers: [SystemService, PrismaService],
})
export class SystemModule {}
