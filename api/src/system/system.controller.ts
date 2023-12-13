import { Controller, Get, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { OsType, SystemUtils } from '../utils/system.utils';
import { ServerOsDto } from './dtos/server-os.dto';
import { HealthCheck } from '@nestjs/terminus';
import { ServerDetailsDto } from './dtos/server-details.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public getServerDetails(): Promise<ServerDetailsDto> {
    return this.systemService.getServerDetails();
  }

  @Get('health')
  @HealthCheck()
  public getServerHealth(): Promise<ServerDetailsDto> {
    return this.systemService.getSystemHealth();
  }

  @Get('/os')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public getOSType(): ServerOsDto {
    return {
      osType: SystemUtils.getOsType(),
    };
  }
}
