import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Точка входа в приложение (аналог public/index.php в MVC-фреймворках).
 *
 * Ключевое отличие от PHP-FPM:
 * Функция bootstrap() вызывается ОДИН РАЗ при старте сервера.
 * NestFactory создает DI-контейнер, инициализирует все модули,
 * подключается к PostgreSQL и начинает слушать TCP-порт в бесконечном Event Loop.
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Включаем корректное завершение процесса по сигналам ОС (SIGINT / SIGTERM от Docker),
  // чтобы Prisma успевала закрыть пул соединений с PostgreSQL.
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Apollo GraphQL Sandbox:    http://localhost:${port}/graphql`);
}

bootstrap();
