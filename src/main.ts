import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific configurations
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL(s)
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies and authorization headers
  });

  // Enable validation globally with additional options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip unwanted properties from DTOs
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to their corresponding DTO types
    }),
  );

  // Set a global prefix for versioning
  app.setGlobalPrefix('api/v1');

  // Start the application
  const port = process.env.PORT ?? 8000;
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  await app.listen(port);
}
bootstrap();
