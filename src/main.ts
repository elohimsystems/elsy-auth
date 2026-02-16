import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('elsy-auth');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        validateCustomDecorators: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('Documentación generada automáticamente con Swagger 7')
      .setVersion('1.0')
      .addBearerAuth() // si usas JWT
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error(
      `✗ Application startup failed: ${(error as any)?.message || error}`,
    );
    process.exit(1);
  }
}
bootstrap();
