import { ServerType } from '@prisma/client';
import { ServerInstanceInfoDto } from './server-instance-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ServerDto {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty()
  type: ServerType;

  @ApiProperty()
  instanceInfo: ServerInstanceInfoDto;
}
