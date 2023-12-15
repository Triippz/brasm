import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Min,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ServerInstanceInfoDto } from './server-instance-info.dto'; // Adjust import path as necessary
import { ReforgerModDto } from './reforger-mod.dto';
import { Type } from 'class-transformer';
import { ServerType } from '@prisma/client';

export class ReforgerServerDto {
  @ApiProperty({ example: 123 })
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'Server Name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Server Description', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 12345 })
  @Min(1)
  port: number;

  @ApiProperty({ example: 12346 })
  @Min(1)
  queryPort: number;

  @ApiProperty({ example: 100 })
  @Min(1)
  maxPlayers: number;

  @ApiProperty({ enum: ServerType, example: ServerType.ARMA_REFORGER })
  @IsEnum(ServerType, {
    message: 'must be filled in. Available types: [ARMA_REFORGER]',
  })
  type: ServerType;

  @ApiProperty({ example: 'password', required: false })
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'adminPassword', required: false })
  @IsOptional()
  adminPassword?: string;

  @ApiProperty({ example: 'dedicatedServerId', required: false })
  @IsOptional()
  dedicatedServerId?: string;

  @ApiProperty({ example: 'scenarioId' })
  @IsNotEmpty()
  scenarioId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  battlEye: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  thirdPersonViewEnabled: boolean;

  @ApiProperty({ type: () => ServerInstanceInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServerInstanceInfoDto)
  instanceInfo?: ServerInstanceInfoDto;

  @ApiProperty({ type: () => [ReforgerModDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReforgerModDto)
  activeMods?: ReforgerModDto[];
}
