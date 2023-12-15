import { ApiProperty } from '@nestjs/swagger';
import { ServerType } from '@prisma/client';

export class InstallServerRequest {
  @ApiProperty()
  serverType: ServerType;
}
