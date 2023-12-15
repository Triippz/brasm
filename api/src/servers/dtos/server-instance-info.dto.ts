import { ApiProperty } from '@nestjs/swagger';

interface ServerInstanceInfoDtoProps {
  alive: boolean;
  id: number;
  startedAt: Date | null;
  playersOnline: number;
  process: string | null;
  version: string;
}

export class ServerInstanceInfoDto {
  @ApiProperty({ example: true })
  readonly alive: boolean;

  @ApiProperty({ example: '2021-01-01T00:00:00Z' })
  readonly startedAt: string;

  @ApiProperty({ example: 10 })
  readonly playersOnline: number;

  @ApiProperty({ example: 100 })
  readonly maxPlayers: number;

  @ApiProperty({ example: '1.0.0' })
  readonly version: string;

  @ApiProperty({ example: 'Test Map' })
  readonly map: string;

  @ApiProperty({ example: 'A server description' })
  readonly description: string;

  constructor(props?: ServerInstanceInfoDtoProps) {
    this.alive;
  }
}
