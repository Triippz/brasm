import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReforgerModDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly id: string;
}
