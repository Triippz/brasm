import {IsNotEmpty, IsString, MinLength} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class LoginRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(8)
    password: string;
}
