import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SteamAuthDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  steamGuardToken: string;
}
