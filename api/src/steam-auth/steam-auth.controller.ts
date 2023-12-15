import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SteamAuthService } from './steam-auth.service';
import { SteamAuthDto } from './dtos/steam-auth.dto';
import { SteamAuthResponseDto } from './dtos/steam-auth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppRoles } from '../auth/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@ApiTags('Steam Auth')
@Controller('/steam-auth')
export class SteamAuthController {
  constructor(private readonly steamAuthService: SteamAuthService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.ADMIN)
  async setAuthAccount(@Body() steamAuthDto: SteamAuthDto) {
    await this.steamAuthService.setAuthAccount(steamAuthDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.ADMIN, UserRole.USER)
  async getAuthAccount(): Promise<SteamAuthResponseDto> {
    const auth = await this.steamAuthService.getAuthAccount();
    return plainToInstance(SteamAuthResponseDto, auth);
  }
}
