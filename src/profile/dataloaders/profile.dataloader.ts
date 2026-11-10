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

@Injectable({ scope: Scope.REQUEST })
export class ProfileDataLoader {
  constructor(private readonly prisma: PrismaService) {}

  public readonly linksLoader = new DataLoader<string, SocialLink[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.socialLink.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  public readonly skillsLoader = new DataLoader<string, Skill[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.skill.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  public readonly experienceLoader = new DataLoader<string, Experience[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.experience.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

  public readonly projectsLoader = new DataLoader<string, Project[]>(
    async (profileIds: readonly string[]) => {
      const rows = await this.prisma.project.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      return this.groupByProfileId(profileIds, rows);
    },
  );

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
