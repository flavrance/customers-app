import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './common/logger/my-logger.service';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeOrmExceptionFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Clients API')
    .setDescription('API for managing clients')
    .setVersion('1.0')
    .addTag('clients')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
