import { NestFactory } from '@nestjs/core';
import './prototypes';
import * as ip from 'ip';

import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VALIDATION_PIPE_OPTIONS } from './auth/constants/header.constants';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Badland Raiders Server Manager')
    .setDescription('The BRASM API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://${ip.address()}:${port}`);
}

bootstrap();
