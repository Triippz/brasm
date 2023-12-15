import { ErrorStatus, InstallationStatus, ServerType } from '@prisma/client';

export class ServerInstallationResponse {
  id: bigint;
  type: ServerType;
  version: string;
  lastUpdatedAt: Date;
  installationStatus: InstallationStatus;
  errorStatus: ErrorStatus;
  createdAt: Date;
}
