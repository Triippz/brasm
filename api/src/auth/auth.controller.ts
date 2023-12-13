import {
  Controller,
  Get,
  Render,
  Post,
  Redirect,
  Body,
  Req,
  Res,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ApiOkResponse} from "@nestjs/swagger";
import {AccessTokenDto} from "./dtos/access-token.dto";
import {LoginRequestDto} from "./dtos/login-request.dto";

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AccessTokenDto })
  login(@Body() { username, password }: LoginRequestDto) {
    return this.authService.login(username, password);
  }
}
