import { registerAs } from '@nestjs/config';
import { ServerConfig } from './config.type';

export default registerAs<ServerConfig>('server', () => ({
  steamcmd: {
    path: process.env.STEAMCMD_PATH || 'C:\\steamcmd',
  },
  directory: {
    servers: process.env.SERVERS_DIRECTORY || 'C:\\steamcmd\\servers',
    logs: process.env.LOGS_DIRECTORY || 'C:\\steamcmd\\logs',
  },
}));
