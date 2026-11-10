import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Certification,
  Experience,
  Profile,
  Project,
  Skill,
  SocialLink,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Language, OptimizationStrategy } from './enums/language.enum';
import { CertificationModel } from './models/certification.model';
import { ExperienceModel } from './models/experience.model';
import { ProfileModel } from './models/profile.model';
import { ProjectModel } from './models/project.model';
import { SkillModel } from './models/skill.model';
import { SocialLinkModel } from './models/social-link.model';
import { RequestedProfileRelations } from './utils/graphql-ast.util';

type ProfileWithOptionalRelations = Profile & {
  links?: SocialLink[];
  skills?: Skill[];
  experience?: Experience[];
  projects?: Project[];
  certifications?: Certification[];
};

/**
 * Слой бизнес-логики профиля (Business Logic Layer).
 *
 * Отвечает за:
 * 1. Запрос данных профиля из PrismaService (в зависимости от выбранной стратегии оптимизации:
 *    либо легковесный запрос только корневой записи под DataLoader,
 *    либо запрос с точечным `include` на основе анализа AST-дерева запроса).
 * 2. Маппинг билингвальных полей БД (`*En` / `*Ru`) в чистую доменную модель GraphQL
 *    в соответствии с запрошенным языком (`Language.EN` или `Language.RU`).
 */
@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(
    lang: Language = Language.EN,
    strategy: OptimizationStrategy = OptimizationStrategy.DATALOADER,
    requestedRelations?: RequestedProfileRelations,
  ): Promise<ProfileModel> {
    const useAstInclude =
      strategy === OptimizationStrategy.AST_JOIN && requestedRelations;

    const record: ProfileWithOptionalRelations | null =
      await this.prisma.profile.findFirst({
        where: { slug: 'dmitrii-sivirin' },
        include: useAstInclude
          ? {
              links: requestedRelations.links
                ? { orderBy: { sortOrder: 'asc' } }
                : false,
              skills: requestedRelations.skills
                ? { orderBy: { sortOrder: 'asc' } }
                : false,
              experience: requestedRelations.experience
                ? { orderBy: { sortOrder: 'asc' } }
                : false,
              projects: requestedRelations.projects
                ? { orderBy: { sortOrder: 'asc' } }
                : false,
              certifications: requestedRelations.certifications
                ? { orderBy: { sortOrder: 'asc' } }
                : false,
            }
          : undefined,
      });

    if (!record) {
      throw new NotFoundException(
        'Profile "dmitrii-sivirin" not found in the database. Make sure prisma db seed has been executed.',
      );
    }

    return this.mapProfile(record, lang);
  }

  public mapProfile(
    record: ProfileWithOptionalRelations,
    lang: Language,
  ): ProfileModel {
    const isRu = lang === Language.RU;

    return {
      id: record.id,
      name: isRu ? record.nameRu : record.nameEn,
      title: isRu ? record.titleRu : record.titleEn,
      description: isRu ? record.descriptionRu : record.descriptionEn,
      location: isRu ? record.locationRu : record.locationEn,
      email: record.email,
      phone: record.phone,
      telegram: record.telegram,
      _lang: lang,
      links: record.links
        ? record.links.map((item) => this.mapSocialLink(item))
        : undefined,
      skills: record.skills
        ? record.skills.map((item) => this.mapSkill(item, lang))
        : undefined,
      experience: record.experience
        ? record.experience.map((item) => this.mapExperience(item, lang))
        : undefined,
      projects: record.projects
        ? record.projects.map((item) => this.mapProject(item, lang))
        : undefined,
      certifications: record.certifications
        ? record.certifications.map((item) => this.mapCertification(item, lang))
        : undefined,
    };
  }

  public mapSocialLink(record: SocialLink): SocialLinkModel {
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
    };
  }

  public mapSkill(record: Skill, lang: Language): SkillModel {
    const isRu = lang === Language.RU;
    return {
      id: record.id,
      name: record.name,
      category: isRu ? record.categoryRu : record.categoryEn,
    };
  }

  public mapExperience(record: Experience, lang: Language): ExperienceModel {
    const isRu = lang === Language.RU;
    return {
      id: record.id,
      company: isRu ? record.companyRu : record.companyEn,
      position: isRu ? record.positionRu : record.positionEn,
      period: isRu ? record.periodRu : record.periodEn,
      achievements: isRu ? record.achievementsRu : record.achievementsEn,
    };
  }

  public mapProject(record: Project, lang: Language): ProjectModel {
    const isRu = lang === Language.RU;
    return {
      id: record.id,
      name: isRu ? record.nameRu : record.nameEn,
      description: isRu ? record.descriptionRu : record.descriptionEn,
      url: record.url,
      techStack: record.techStack,
      isNda: record.isNda,
    };
  }

  public mapCertification(
    record: Certification,
    lang: Language,
  ): CertificationModel {
    const isRu = lang === Language.RU;
    return {
      id: record.id,
      code: record.code,
      title: isRu ? record.titleRu : record.titleEn,
      issuer: record.issuer,
      year: record.year,
    };
  }
}
