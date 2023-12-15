import { ApiProperty } from '@nestjs/swagger';
import { ServerDto } from './server.dto';

export class ServerListDto {
  @ApiProperty()
  servers: ServerDto[];
}
