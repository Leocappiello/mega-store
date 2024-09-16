import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      /* forbidUnknownValues: true, */
    }),
  );
  const configService = app.get(ConfigService);
  console.log(configService.get('DATABASE_URL'));
  await app.listen(3000);
}
bootstrap();
