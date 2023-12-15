import { Injectable } from '@nestjs/common';
import {
  spawn,
  SpawnOptionsWithoutStdio,
  execFile,
  ExecFileOptions,
} from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execFilePromise = promisify(execFile);

@Injectable()
export class ProcessFactory {
  async startProcess(executable: string, parameters: string[]): Promise<any> {
    const directory = path.dirname(executable);
    return this.execFileInternal(executable, parameters, { cwd: directory });
  }

  startProcessWithDiscardedOutput(
    executable: string,
    parameters: string[],
  ): Promise<any> {
    const directory = path.dirname(executable);
    return this.spawnInternal(executable, parameters, {
      cwd: directory,
      stdio: 'ignore' as any,
    });
  }

  startProcessWithRedirectedOutput(
    executable: string,
    parameters: string[],
    outputFile: string,
  ): Promise<any> {
    const directory = path.dirname(executable);
    const outStream = fs.createWriteStream(outputFile, { flags: 'a' });
    return this.spawnInternal(executable, parameters, {
      cwd: directory,
      stdio: ['ignore', outStream, outStream] as any,
    });
  }

  private async execFileInternal(
    executable: string,
    parameters: string[],
    options: ExecFileOptions,
  ): Promise<any> {
    return execFilePromise(executable, parameters, options);
  }

  private spawnInternal(
    executable: string,
    parameters: string[],
    options: SpawnOptionsWithoutStdio,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const process = spawn(executable, parameters, options);
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ code });
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }
}
