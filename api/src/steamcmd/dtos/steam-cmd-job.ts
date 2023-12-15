import { SteamCmdParameters } from './steam-cmd-parameters';
import { ErrorStatus, ServerType } from '@prisma/client';

export class SteamCmdJob {
  relatedServer?: ServerType;
  errorStatus?: ErrorStatus;
  steamCmdParameters: SteamCmdParameters;

  constructor(
    relatedServer: ServerType,
    steamCmdParameters: SteamCmdParameters,
  ) {
    this.relatedServer = relatedServer;
    this.steamCmdParameters = steamCmdParameters;
  }

  setErrorStatus(status: ErrorStatus): void {
    this.errorStatus = status;
  }

  // Add any additional methods you might need
}
