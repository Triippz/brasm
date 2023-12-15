import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServerInstallationService } from '../services/server-installation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AppRoles } from '../../auth/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { ServerInstallationListResponse } from '../dtos/server-installation-list-response';
import { ServerInstallationResponse } from '../dtos/server-installation-response';
import { InstallServerRequest } from '../dtos/install-server-request';
import { InstallerService } from '../services/installer.service';

@Controller('server-install')
@ApiTags('Server Installations')
export class ServerInstallationController {
  constructor(
    private readonly serverInstallService: ServerInstallationService,
    private readonly installerService: InstallerService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.USER, UserRole.ADMIN)
  async findAll(): Promise<ServerInstallationListResponse> {
    return {
      installations:
        await this.serverInstallService.findAllAvailableServerInstallations(),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.USER, UserRole.ADMIN)
  async getInstallation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServerInstallationResponse> {
    return this.serverInstallService.findOne(id);
  }

  @Post(':')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.USER, UserRole.ADMIN)
  async installServer(
    @Body() installServerRequest: InstallServerRequest,
  ): Promise<void> {
    return this.installerService.installServer(installServerRequest);
  }
}
