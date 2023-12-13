import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { LoginInput } from '../dtos/login-input';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'User login API',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() credential: LoginInput): Promise<AuthTokenOutput> {
    return await this.authService.login(credential);
  }
}
