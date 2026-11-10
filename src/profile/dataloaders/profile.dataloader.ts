import { Injectable, Scope } from '@nestjs/common';
import {
  Certification,
  Experience,
  Project,
  Skill,
  SocialLink,
} from '@prisma/client';
import * as DataLoader from 'dataloader';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Метод оптимизации №1: Паттерн DataLoader (Batching & Request-Scoped Caching).
 *
 * Почему `Scope.REQUEST`?
 * DataLoader создается заново для каждого входящего HTTP/GraphQL-запроса:
 * 1. В рамках одного тика Event Loop Node.js он собирает все вызовы `.load(profileId)`
 *    от дочерних резолверов `@ResolveField()` и склеивает их в ОДИН SQL-запрос
 *    вида `SELECT * FROM skills WHERE profile_id IN ($1, $2, ...) ORDER BY sort_order ASC`.
 * 2. Кэширует результаты только на время жизни текущего запроса, чтобы не было утечек памяти
 *    и устаревших данных между разными запросами.
 */
@Injectable({ scope: Scope.REQUEST })
export class ProfileDataLoader {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Батч-загрузчик профессиональных ссылок по массиву profileIds
   */
  public readonly linksLoader = new DataLoader<string, SocialLink[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.socialLink.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  /**
   * Батч-загрузчик технических навыков по массиву profileIds
   */
  public readonly skillsLoader = new DataLoader<string, Skill[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.skill.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  /**
   * Батч-загрузчик опыта работы по массиву profileIds
   */
  public readonly experienceLoader = new DataLoader<string, Experience[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.experience.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  /**
   * Батч-загрузчик проектов по массиву profileIds
   */
  public readonly projectsLoader = new DataLoader<string, Project[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.project.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  /**
   * Батч-загрузчик сертификаций по массиву profileIds
   */
  public readonly certificationsLoader = new DataLoader<
    string,
    Certification[]
  >(async (profileIds: readonly string[]) => {
    const rows = await this.prisma.certification.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
    return this.groupByProfileId(profileIds, rows);
  });

  /**
   * Важное требование контракта DataLoader:
   * Возвращаемый массив групп ОБЯЗАН иметь ту же длину и тот же порядок ключей,
   * что и входной массив `profileIds`.
   */
  private groupByProfileId<T extends { profileId: string }>(
    profileIds: readonly string[],
    rows: T[],
  ): T[][] {
    const map = new Map<string, T[]>();
    for (const id of profileIds) {
      map.set(id, []);
    }
    for (const row of rows) {
      map.get(row.profileId)?.push(row);
    }
    return profileIds.map((id) => map.get(id) ?? []);
  }
}
