import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

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
