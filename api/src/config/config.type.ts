export type AppConfig = {
  port: number;
};

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
};

export type JWTConfig = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresInSec: number;
  refreshTokenExpiresInSec: number;
  unusedRefreshTokenExpiryDays: number;
};

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
};
