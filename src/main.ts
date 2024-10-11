import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/exception/exception.filter';
import { Logger } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app: any = await NestFactory.create(AppModule, { cors: true });
  const port = 4000;
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  const config = new DocumentBuilder()
    .setTitle('Oauth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
  app.enableCors();
  await app.listen(port);
  Logger.verbose(`Server is Listening At http://localhost:${port}/api-docs`)
}
bootstrap();
