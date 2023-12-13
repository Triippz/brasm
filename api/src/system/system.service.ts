import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import * as os from 'os';
import { promises as fsPromises } from 'fs';
import { memoize } from 'lodash';
import { ServerDetailsDto } from './dtos/server-details.dto';

@Injectable()
export class SystemService {
  private diskSpaceLeft = memoize(this.getDiskSpaceLeft, () => 'diskSpaceLeft');
  private diskSpaceTotal = memoize(
    this.getDiskSpaceTotal,
    () => 'diskSpaceTotal',
  );
  private memoryLeft = memoize(this.getMemoryLeft, () => 'memoryLeft');
  private memoryTotal = memoize(this.getMemoryTotal, () => 'memoryTotal');
  private cpuUsage = memoize(this.getCpuUsage, () => 'cpuUsage');
  private processorCount = memoize(
    this.getProcessorCount,
    () => 'processorCount',
  );
  private osName = memoize(this.getOsName, () => 'osName');
  private osVersion = memoize(this.getOsVersion, () => 'osVersion');
  private osArchitecture = memoize(
    this.getOsArchitecture,
    () => 'osArchitecture',
  );

  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  public async getSystemHealth(): Promise<any> {
    return await this.health.check([
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
      () =>
        this.http.pingCheck(
          'reforger-workshop',
          'https://reforger.armaplatform.com/workshop',
        ),
      () =>
        this.disk.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
      () =>
        this.disk.checkStorage('disk health', {
          threshold: 250 * 1024 * 1024 * 1024,
          path: '/',
        }),
    ]);
  }

  async getServerDetails(): Promise<ServerDetailsDto> {
    const serverDetails = new ServerDetailsDto();

    serverDetails.spaceLeft = await this.getDiskSpaceLeft();
    serverDetails.spaceTotal = await this.getDiskSpaceTotal();
    serverDetails.memoryLeft = await this.getMemoryLeft();
    serverDetails.memoryTotal = await this.getMemoryTotal();
    serverDetails.cpuUsage = await this.getCpuUsage();
    serverDetails.cpuCount = await this.getProcessorCount();
    serverDetails.osName = await this.getOsName();
    serverDetails.osVersion = await this.getOsVersion();
    serverDetails.osArchitecture = await this.getOsArchitecture();

    // Extracting CPU model and speed
    const cpus = os.cpus();
    if (cpus.length > 0) {
      serverDetails.cpuModel = cpus[0].model;
      serverDetails.cpuSpeed = cpus[0].speed;
    }

    return serverDetails;
  }

  async getDiskSpaceLeft(): Promise<number> {
    // Replace with actual logic to get disk space left
    const stats = await fsPromises.stat('/');
    return stats.size;
  }

  async getDiskSpaceTotal(): Promise<number> {
    // Replace with actual logic to get total disk space
    const stats = await fsPromises.stat('/');
    return stats.size;
  }

  async getMemoryLeft(): Promise<number> {
    // Logic for memory left
    return os.freemem();
  }

  async getMemoryTotal(): Promise<number> {
    // Logic for total memory
    return os.totalmem();
  }

  async getCpuUsage(): Promise<number> {
    // Logic to calculate CPU usage
    // This might be more complex in Node.js
    // and could involve calculating the delta of CPU times
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      setImmediate(() => {
        const endUsage = process.cpuUsage(startUsage);
        resolve((endUsage.user + endUsage.system) / 1000);
      });
    });
  }

  async getProcessorCount(): Promise<number> {
    return os.cpus().length;
  }

  async getOsName(): Promise<string> {
    return os.type();
  }

  async getOsVersion(): Promise<string> {
    return os.release();
  }

  async getOsArchitecture(): Promise<string> {
    return os.arch();
  }
}
