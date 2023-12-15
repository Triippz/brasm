import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SteamAuthResponseDto {
  @ApiProperty()
  @IsNumber()
  id: bigint;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  steamGuardToken: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
