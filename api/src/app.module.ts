import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SystemModule } from './system/system.module';
import { HttpModule } from '@nestjs/axios';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import { TokensModule } from './tokens/tokens.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { UserModule } from './users/user.module';
import { SteamAuthModule } from './steam-auth/steam-auth.module';
import { ServerManagementModule } from './server-management/server-management.module';
import { ServerInstallModule } from './server-install/server-install.module';
import { SteamCmdModule } from './steamcmd/steamcmd.module';
import serverConfig from './config/server.config';
import { ServersModule } from './servers/servers.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig, serverConfig],
      envFilePath: ['.env'],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    HttpModule,
    AuthModule,
    SystemModule,
    TokensModule,
    UserModule,
    SteamAuthModule,
    ServerManagementModule,
    ServerInstallModule,
    SteamCmdModule,
    ServersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
