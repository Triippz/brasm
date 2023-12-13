export class ServerDetailsDto {
  spaceLeft: number;
  spaceTotal: number;

  memoryLeft: number;
  memoryTotal: number;

  cpuUsage: number;
  cpuModel: string;
  cpuCount: number;
  cpuSpeed: number;

  osName: string;
  osVersion: string;
  osArchitecture: string;
}
