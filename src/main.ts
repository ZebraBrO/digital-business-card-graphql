import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Apollo GraphQL Sandbox:    http://localhost:${port}/graphql`);
}

bootstrap();
