import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { ServerType } from '@prisma/client';
import { SERVER_EXECUTABLES } from './constants';
import { OsType, SystemUtils } from '../utils/system.utils';

@Injectable()
export class PathsFactory {
  private readonly serversBasePath: string;
  private readonly logsBasePath: string;

  constructor(configService: ConfigService) {
    this.serversBasePath = configService.get<string>('directory.servers');
    this.logsBasePath = configService.get<string>('directory.logs');
  }

  getServersBasePath(): string {
    return this.serversBasePath;
  }

  getServerPath(type: ServerType): string {
    return path.join(this.getServersBasePath(), type);
  }

  getServerExecutableWithFallback(type: ServerType): string {
    let executablePath = this.getServerExecutable(type);
    if (SystemUtils.getOsType() === OsType.WINDOWS) {
      executablePath += '.exe';
    }

    if (fs.existsSync(executablePath)) {
      return executablePath;
    }

    // No x64 executable found, try fallback
    if (executablePath.includes('_x64')) {
      const fallbackPath = executablePath.replace('_x64', '');
      if (fs.existsSync(fallbackPath)) {
        return fallbackPath;
      }
    }

    throw new Error(`Couldn't find any server executable for ${type} server`);
  }

  private getServerExecutable(type: ServerType): string {
    return path.join(this.getServerPath(type), SERVER_EXECUTABLES[type]);
  }

  getServerLogFile(type: ServerType, id: number): string {
    return path.join(this.logsBasePath, `${type}_${id}.log`);
  }

  getConfigFilePath(type: ServerType, fileName: string): string {
    return path.join(this.getServerPath(type), fileName);
  }
}
