import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ServerInstanceInfoDto } from '../dtos/server-instance-info.dto';

@Injectable()
export class ServerInstanceInfoCache {
  private readonly KEY_PREFIX = 'server-instance-info';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAll(): Promise<Record<string, ServerInstanceInfoDto>> {
    const keys = await this.cacheManager.store.keys();

    const allInstances: Record<string, ServerInstanceInfoDto> = {};
    for (const key of keys) {
      allInstances[key] = await this.cacheManager.get(key);
    }

    return allInstances;
  }

  async getOrPut(id: number): ServerInstanceInfoDto {
    const maybeServerInstance = await this.cacheManager.get(
      `${this.KEY_PREFIX}-${id}`,
    );

    if (maybeServerInstance) {
      return maybeServerInstance as ServerInstanceInfoDto;
    }

    S;
  }
}
