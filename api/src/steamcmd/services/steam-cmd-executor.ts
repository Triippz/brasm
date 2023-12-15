import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import { SteamCmdJob } from '../dtos/steam-cmd-job';
import { SteamCmdParameters } from '../dtos/steam-cmd-parameters';
import { ErrorStatus } from '@prisma/client';
import { SteamAuthService } from '../../steam-auth/steam-auth.service'; // Enum for error statuses

const execAsync = promisify(exec);

@Injectable()
export class SteamCmdExecutor {
  private readonly logger = new Logger(SteamCmdExecutor.name);
  private readonly steamCmdFile: string;

  constructor(
    private configService: ConfigService,
    private steamAuthService: SteamAuthService,
  ) {
    this.steamCmdFile = this.configService.get<string>('server.steamcmd.path');
    if (!fs.existsSync(this.steamCmdFile)) {
      throw new Error('Invalid path to SteamCMD executable given');
    }
  }

  async processJob(job: SteamCmdJob): Promise<SteamCmdJob> {
    try {
      await this.execute(job);
      return job;
    } catch (error) {
      this.logger.error(`SteamCMD job failed: ${error.message}`);
      job.setErrorStatus(ErrorStatus.GENERIC);
      throw error;
    }
  }

  private async execute(job: SteamCmdJob): Promise<void> {
    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    const exitCode: number | null = null;
    let output: string = '';

    do {
      attempts++;
      const { command, args } = await this.buildCommand(job.steamCmdParameters);
      const { stdout } = await execAsync(`${command} ${args.join(' ')}`);
      output = stdout;
      // Handle exit code and stderr as needed
    } while (attempts < MAX_ATTEMPTS && this.exitedDueToTimeout(exitCode));

    this.handleProcessResult(output, job);
  }

  private async buildCommand(
    parameters: SteamCmdParameters,
  ): Promise<{ command: string; args: string[] }> {
    // Asynchronously get the authentication string
    const authString = await this.getAuthString();

    // Construct the command and arguments based on SteamCmdParameters
    // Replace placeholders with actual credentials
    const args = parameters.parameters.map((param) => {
      if (param.includes('<{STEAM_CREDENTIALS_PLACEHOLDER}>')) {
        return param.replace('<{STEAM_CREDENTIALS_PLACEHOLDER}>', authString);
      } else {
        return param;
      }
    });

    return { command: this.steamCmdFile, args };
  }

  private exitedDueToTimeout(exitCode: number | null): boolean {
    const EXIT_CODE_TIMEOUT_LINUX = 134;
    const EXIT_CODE_TIMEOUT_WINDOWS = 10;
    return (
      exitCode === EXIT_CODE_TIMEOUT_LINUX ||
      exitCode === EXIT_CODE_TIMEOUT_WINDOWS
    );
  }

  private handleProcessResult(output: string, job: SteamCmdJob): void {
    const ERROR_KEYWORDS = ['error', 'failure', 'failed'];
    const errorLine = output
      .split('\n')
      .map((line) => line.toLowerCase())
      // .map(line => this.removeParametersFromOutputLine(line)) // Implement if needed
      .find((line) =>
        ERROR_KEYWORDS.some(
          (keyword) => line.includes(keyword) && !line.includes('warning'),
        ),
      );

    if (!errorLine) {
      return;
    }

    this.logger.error(`SteamCmd failed due to: '${errorLine}'`);
    job.setErrorStatus(ErrorStatus.GENERIC);
    this.dumpErrorOutputToLog(output);

    // Additional error handling based on the specifics of your job and errors
  }

  private dumpErrorOutputToLog(output: string): void {
    this.logger.error('======== SteamCMD ERROR OUTPUT START ========');
    this.logger.error(output);
    this.logger.error('======== SteamCMD ERROR OUTPUT END ========');
  }

  private async getAuthString(): Promise<string> {
    const steamAuth = await this.steamAuthService.getAuthAccount();
    if (!steamAuth.username || !steamAuth.password) {
      throw new Error('SteamAuth is not set up');
    }

    let authString = `${steamAuth.username} ${steamAuth.password}`;
    if (steamAuth.steamGuardToken) {
      authString += ` ${steamAuth.steamGuardToken}`;
    }
    return authString;
  }
}
