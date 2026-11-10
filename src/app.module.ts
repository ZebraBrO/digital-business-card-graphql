import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

/**
 * Корневой модуль приложения (AppModule).
 *
 * Аналогия с PHP (Symfony / Laminas):
 * Это центральный конфигурационный класс DI-контейнера (Service Container),
 * где мы регистрируем все подмодули нашего приложения:
 * - ConfigModule (чтение и валидация .env)
 * - PrismaModule (работа с БД PostgreSQL)
 * - GraphQLModule (движок Apollo Server и автогенерация схемы)
 * - ProfileModule (наш доменный модуль с бизнес-логикой резюме)
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным во всех модулях без повторного импорта
      envFilePath: '.env',
    }),
    PrismaModule,
  ],
})
export class AppModule {}
