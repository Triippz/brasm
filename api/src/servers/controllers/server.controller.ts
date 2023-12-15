import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ServerDto } from '../dtos/server.dto';
import { plainToInstance } from 'class-transformer';
import { ServerInstanceService } from '../services/server-instance.service';
import { ServerProcessService } from '../services/server-process.service';
import { ServerLogsService } from '../services/server-logs.service';

@Controller('/api/server')
export class ServerController {
  private static readonly DEFAULT_LOG_LINES_COUNT = 100;

  constructor(
    private readonly serverInstanceService: ServerInstanceService,
    private readonly serverProcessService: ServerProcessService,
    private readonly logsService: ServerLogsService,
  ) {}

  @Get()
  async getAllServers(): Promise<ServerDto[]> {
    const servers = await this.serverInstanceService.getAllServers();
    return servers.map((server) => {
      // Assuming serverMapper transforms your entity to DTO
      // return this.serverMapper.mapServerToDto(server);
    });
  }

  @Get('/:id')
  async getServer(@Param('id') id: number): Promise<ServerDto> {
    const server = await this.serverInstanceService.getServer(id);
    if (!server) {
      throw new NotFoundException(`Server with ID ${id} not found`);
    }

    return plainToInstance(ServerDto, server);
  }

  @Post()
  async createServer(@Body() serverDto: ServerDto): Promise<ServerDto> {
    // Logic to create a server
    // const server = this.serverMapper.mapServerDtoToEntity(serverDto);
    const createdServer = await this.serverInstanceService.createServer(server);
    return plainToInstance(ServerDto, createdServer);
  }

  @Put('/:id')
  async updateServer(
    @Param('id') id: number,
    @Body() serverDto: ServerDto,
  ): Promise<ServerDto> {
    // Logic to update a server
    // const server = await this.getServerEntity(id);
    // this.serverMapper.updateServerFromDto(serverDto, server);
    const updatedServer = await this.serverInstanceService.updateServer(server);
    // return this.serverMapper.mapServerToDto(updatedServer);
  }

  @Delete('/:id')
  async deleteServer(@Param('id') id: number): Promise<void> {
    const server = await this.serverInstanceService.getServer(id);
    if (!server) {
      throw new NotFoundException(`Server with ID ${id} not found`);
    }
    await this.serverInstanceService.deleteServer(server);
  }

  @Post('/:id/start')
  async startServer(@Param('id') id: number): Promise<HttpStatus> {
    const server = await this.getServerEntity(id);
    await this.serverProcessService.startServer(server);
    return HttpStatus.OK;
  }

  @Post('/:id/stop')
  async stopServer(@Param('id') id: number): Promise<HttpStatus> {
    const server = await this.getServerEntity(id);
    await this.serverProcessService.shutDownServer(server);
    return HttpStatus.OK;
  }

  @Post('/:id/restart')
  async restartServer(@Param('id') id: number): Promise<HttpStatus> {
    const server = await this.getServerEntity(id);
    await this.serverProcessService.restartServer(server);
    return HttpStatus.OK;
  }

  @Get('/:id/log/download')
  async downloadLogFile(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<any> {
    const server = await this.getServerEntity(id);
    const logFile = await this.logsService.getLogFileAsResource(server);
    if (!logFile) {
      throw new NotFoundException(
        `Log file for server '${server.name}' doesn't exist`,
      );
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${logFile.filename}`,
    );
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', logFile.contentLength);
    res.sendFile(logFile.path);
  }

  @Get('/:id/log')
  async getLastFilesFromLog(
    @Param('id') id: number,
    @Query('count') count: number = ServerController.DEFAULT_LOG_LINES_COUNT,
  ): Promise<string> {
    const server = await this.getServerEntity(id);
    return await this.logsService.getLastLinesFromServerLog(server, count);
  }

  private async getServerEntity(id: number): Promise<any> {
    // Adjust the return type as per your entity
    const server = await this.serverInstanceService.getServer(id);
    if (!server) {
      throw new NotFoundException(`Server with ID ${id} doesn't exist`);
    }
    return server;
  }
}
