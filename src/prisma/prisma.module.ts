import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Глобальный модуль Prisma (@Global).
 * Экспортирует PrismaService один раз на всё приложение (Singleton),
 * чтобы не дублировать пул соединений к PostgreSQL в разных модулях.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
