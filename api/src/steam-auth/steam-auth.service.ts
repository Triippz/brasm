import { Injectable, Logger } from '@nestjs/common';
import { SteamAuthDto } from './dtos/steam-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SteamAuthResponseDto } from './dtos/steam-auth-response.dto';
import { plainToInstance } from 'class-transformer';
import { SteamAuth } from '@prisma/client';

@Injectable()
export class SteamAuthService {
  private logger = new Logger(SteamAuthService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getAuthAccount(): Promise<SteamAuth> {
    return this.prismaService.steamAuth.findFirst();
  }

  async setAuthAccount(steamAuthDto: SteamAuthDto) {
    this.logger.log(
      `Setting Steam Auth Account: ${JSON.stringify(steamAuthDto.username)}`,
    );

    const maybeSteamAuth = await this.prismaService.steamAuth.findFirst();

    if (maybeSteamAuth) {
      await this.prismaService.steamAuth.update({
        where: { id: maybeSteamAuth.id },
        data: {
          username: steamAuthDto.username,
          steamGuardToken: steamAuthDto.steamGuardToken,
          password: steamAuthDto.password,
        },
      });
    } else {
      await this.prismaService.steamAuth.create({
        data: {
          username: steamAuthDto.username,
          steamGuardToken: steamAuthDto.steamGuardToken,
          password: steamAuthDto.password,
        },
      });
    }
  }
}
