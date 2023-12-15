import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import { ProcessFactory } from '../../common/process-factory';
import { PathsFactory } from '../../common/paths-factory';
import { ServerType } from '@prisma/client';

@Injectable()
export class TestRunService {
  private readonly logger = new Logger(TestRunService.name);

  constructor(
    private processFactory: ProcessFactory,
    private pathsFactory: PathsFactory,
  ) {}

  public async performServerDryRun(
    serverInstallation: any /* ServerInstallation type */,
  ) {
    const port = await this.findAvailablePort();
    const queryPort = port + 1;

    const type = serverInstallation.type; // ServerType

    let configFile: string;
    try {
      configFile = this.createTestConfigFile(type, port, queryPort);
      await this.startServerForDryRun(type, port, configFile);
      // Implement the logic to query the server info here...
    } catch (error) {
      this.logger.error('Error when launching server executable', error);
      throw error;
    } finally {
      if (configFile && fs.existsSync(configFile)) {
        fs.unlinkSync(configFile);
      }
    }
  }

  private async startServerForDryRun(
    type: ServerType,
    port: number,
    configFile: string,
  ): Promise<void> {
    const parameters = this.getLaunchParameters(type, port, configFile);
    const executablePath =
      this.pathsFactory.getServerExecutableWithFallback(type);
    this.logger.log(
      `Starting server '${type}' for dry run with parameters: ${parameters}`,
    );
    await this.processFactory.startProcessWithDiscardedOutput(
      executablePath,
      parameters,
    );
  }

  private createTestConfigFile(
    type: ServerType,
    port: number,
    queryPort: number,
  ): string {
    const testCfgFilePath = path.join(
      this.pathsFactory.getServerPath(type),
      'TEST_CONFIG.cfg',
    );
    let config = '';
    switch (type) {
      case ServerType.ARMA_REFORGER:
        config = this.getReforgerTestConfig(port, queryPort);
        break;
      // Add cases for other server types...
    }
    fs.writeFileSync(testCfgFilePath, config);
    return testCfgFilePath;
  }

  // ... Implement other helper methods like getLaunchParameters, getArma3TestConfig, etc.

  private async findAvailablePort(): Promise<number> {
    let port = 3000;
    while (
      !(await this.isPortAvailable(port)) ||
      !(await this.isPortAvailable(port + 1))
    ) {
      port += 2;
    }
    return port;
  }

  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  }

  private getReforgerTestConfig(port: number, queryPort: number): string {
    return `{
            // Reforger configuration content
            "gameHostBindPort": ${port},
            "steamQueryPort": ${queryPort}
            // other configuration details
        }`;
  }

  private addReforgerLaunchParameters(
    parameters: string[],
    configFilePath: string,
  ) {
    parameters.push(
      '-config',
      configFilePath,
      '-backendlog',
      '-nothrow',
      '-maxFPS=30',
    );
  }

  private getLaunchParameters(
    type: ServerType,
    port: number,
    configFilePath: string,
  ): string[] {
    const parameters = [];
    switch (type) {
      case ServerType.ARMA_REFORGER:
        this.addReforgerLaunchParameters(parameters, configFilePath);
        break;
    }
    return parameters;
  }
}
