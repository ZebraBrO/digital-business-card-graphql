import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Сервис доступа к базе данных (Data Access Layer).
 *
 * Наследуется от сгенерированного PrismaClient и интегрируется в жизненный цикл NestJS:
 * - OnModuleInit: открывает пул соединений с PostgreSQL при старте приложения.
 * - OnModuleDestroy: корректно закрывает соединения при остановке контейнера.
 *
 * В режиме разработки логирует все выполняемые SQL-запросы и время их выполнения (ms),
 * что позволяет наглядно контролировать отсутствие проблемы N+1 в GraphQL.
 */
@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const isDev = process.env.NODE_ENV !== 'production';

    super({
      log: isDev
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : [{ emit: 'stdout', level: 'error' }],
    });

    if (isDev) {
      this.$on('query', (event: Prisma.QueryEvent) => {
        this.logger.debug(
          `SQL [${event.duration}ms]: ${event.query} | params: ${event.params}`,
        );
      });
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Successfully connected to PostgreSQL database');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database');
  }
}
