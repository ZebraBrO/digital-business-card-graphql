import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';

/**
 * Корневой модуль приложения (AppModule).
 *
 * Аналогия с PHP (Symfony / Laminas):
 * Это центральный конфигурационный класс DI-контейнера (Service Container),
 * где мы регистрируем все подмодули нашего приложения:
 * - ConfigModule (чтение и валидация .env)
 * - PrismaModule (работа с БД PostgreSQL)
 * - GraphQLModule (движок Apollo Server, автогенерация схемы Code-First и Apollo Sandbox)
 * - ProfileModule (наш доменный модуль с бизнес-логикой резюме)
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-First подход: NestJS автоматически генерирует файл схемы GraphQL из наших TypeScript-классов
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // Включаем интроспекцию схемы и встроенный интерактивный Apollo Sandbox на любом окружении (включая облачное демо)
      introspection: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    }),
    PrismaModule,
    ProfileModule,
  ],
})
export class AppModule {}
