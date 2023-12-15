import { Injectable } from '@nestjs/common';
import { SteamCmdExecutor } from './steam-cmd-executor';
import { ServerType } from '@prisma/client';
import { SteamCmdJob } from '../dtos/steam-cmd-job';
import { SteamCmdParameters } from '../dtos/steam-cmd-parameters';
import { SERVER_IDS } from '../../common/constants';
import { PathsFactory } from '../../common/paths-factory';

@Injectable()
export class SteamCmdService {
  constructor(
    private steamCmdExecutor: SteamCmdExecutor,
    private pathsFactory: PathsFactory,
  ) {}

  async installOrUpdateServer(serverType: ServerType): Promise<SteamCmdJob> {
    const builder = new SteamCmdParameters.Builder();
    // Setting the install directory
    builder.withInstallDir(this.pathsFactory.getServerPath(serverType));
    // Adding login parameters
    builder.withLogin(); // Assuming this adds the necessary login details
    // Adding app install parameters
    const appId = SERVER_IDS[serverType];
    builder.withAppInstall(appId, true); // Assuming 'true' is for the 'validate' parameter
    const parameters = builder.build();

    return this.enqueueJob(new SteamCmdJob(serverType, parameters));
  }

  private async enqueueJob(job: SteamCmdJob): Promise<SteamCmdJob> {
    return this.steamCmdExecutor.processJob(job);
  }
}
