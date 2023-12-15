import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PathsFactory } from '../../common/paths-factory';
import { Server, ServerType } from '@prisma/client';
import { ArmaReforgerServerConfig } from '../server-configs/arma-reforger.config';

@Injectable()
export class ConfigFileService {
  private readonly logger = new Logger(ConfigFileService.name);

  constructor(private readonly pathsFactory: PathsFactory) {}

  async getConfigFileForServer(server: Server): Promise<string> {
    const extension =
      server.type === ServerType.ARMA_REFORGER ? '.json' : '.cfg';
    const fileName = `${server.type}_${server.id}${extension}`;
    return path.join(
      this.pathsFactory.getConfigFilePath(server.type, fileName),
    );
  }

  async writeConfig(server: Server): Promise<void> {
    const configFile = await this.getConfigFileForServer(server);
    await this.deleteOldConfigFile(configFile);
    await this.writeNewConfig(server, configFile);
  }

  async readOptionFromConfig(
    key: string,
    server: Server,
  ): Promise<string | null> {
    if (server.type !== ServerType.ARMA_REFORGER) {
      throw new Error(
        'Reading properties is only implemented for Reforger servers',
      );
    }

    const configFile = await this.getConfigFileForServer(server);
    try {
      const fileContent = await fs.readFile(configFile, 'utf8');
      const values = JSON.parse(fileContent) as ArmaReforgerServerConfig;
      return values[key] || null;
    } catch (error) {
      this.logger.error(
        `Couldn't load property from config file ${configFile}`,
        error,
      );
      return null;
    }
  }

  private async deleteOldConfigFile(configFile: string): Promise<void> {
    try {
      await fs.unlink(configFile);
      this.logger.log(`Deleted old configuration '${configFile}'`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(
          `Could not delete old server config '${configFile}'`,
          error,
        );
      }
    }
  }

  private async writeNewConfig(
    server: Server,
    configFilePath: string,
  ): Promise<void> {
    this.logger.log(`Writing new server config '${configFilePath}'`);

    let serverConfig: Record<string, any>;
    switch (server.type) {
      case ServerType.ARMA_REFORGER:
        serverConfig = ArmaReforgerServerConfig.defaultReforgerServerConfig;
        break;
    }

    try {
      const configJson = JSON.stringify(serverConfig, null, 2);
      await fs.writeFile(configFilePath, configJson);
    } catch (error) {
      this.logger.error('Could not write config file', error);
    }
  }
}
