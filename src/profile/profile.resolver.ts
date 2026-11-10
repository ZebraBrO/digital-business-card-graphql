import { Args, Info, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ProfileDataLoader } from './dataloaders/profile.dataloader';
import { Language, OptimizationStrategy } from './enums/language.enum';
import { CertificationModel } from './models/certification.model';
import { ExperienceModel } from './models/experience.model';
import { ProfileModel } from './models/profile.model';
import { ProjectModel } from './models/project.model';
import { SkillModel } from './models/skill.model';
import { SocialLinkModel } from './models/social-link.model';
import { ProfileService } from './profile.service';
import { extractRequestedRelations } from './utils/graphql-ast.util';

/**
 * Слой представления GraphQL (GraphQL Presentation Layer).
 *
 * Принцип разделения ответственности (SoC):
 * Резолвер НЕ обращается к базе данных напрямую (здесь нет импорта PrismaService).
 * Он отвечает только за:
 * 1. Прием аргументов GraphQL-запроса (`lang`, `strategy`) и анализ AST (`@Info()`).
 * 2. Вызов бизнес-логики из `ProfileService`.
 * 3. Разрешение вложенных полей (`@ResolveField`) через батчинг `ProfileDataLoader`
 *    (либо возврат уже предзагруженных данных при выборе стратегии `AST_JOIN`).
 */
@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileDataLoader: ProfileDataLoader,
  ) {}

  @Query(() => ProfileModel, {
    name: 'profile',
    description:
      'Получить цифровую визитку специалиста (профиль, ссылки, навыки, опыт работы, проекты и сертификации). По умолчанию возвращает данные на английском языке (EN) с оптимизацией вложенных запросов через DataLoader.',
  })
  async getProfile(
    @Args('lang', {
      type: () => Language,
      defaultValue: Language.EN,
      description: 'Язык возвращаемых данных: EN (по умолчанию) или RU',
    })
    lang: Language,
    @Args('strategy', {
      type: () => OptimizationStrategy,
      defaultValue: OptimizationStrategy.DATALOADER,
      description:
        'Стратегия оптимизации запросов к БД для вложенных полей: DATALOADER (по умолчанию) или AST_JOIN',
    })
    strategy: OptimizationStrategy,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ProfileModel> {
    const requestedRelations =
      strategy === OptimizationStrategy.AST_JOIN
        ? extractRequestedRelations(info)
        : undefined;

    return this.profileService.getProfile(lang, strategy, requestedRelations);
  }

  @ResolveField(() => [SocialLinkModel], { name: 'links' })
  async resolveLinks(
    @Parent() profile: ProfileModel,
  ): Promise<SocialLinkModel[]> {
    // Если связи уже были предзагружены стратегией AST_JOIN — отдаем их сразу без запроса к БД
    if (profile.links) {
      return profile.links;
    }
    const rows = await this.profileDataLoader.linksLoader.load(profile.id);
    return rows.map((row) => this.profileService.mapSocialLink(row));
  }

  @ResolveField(() => [SkillModel], { name: 'skills' })
  async resolveSkills(@Parent() profile: ProfileModel): Promise<SkillModel[]> {
    if (profile.skills) {
      return profile.skills;
    }
    const lang = profile._lang ?? Language.EN;
    const rows = await this.profileDataLoader.skillsLoader.load(profile.id);
    return rows.map((row) => this.profileService.mapSkill(row, lang));
  }

  @ResolveField(() => [ExperienceModel], { name: 'experience' })
  async resolveExperience(
    @Parent() profile: ProfileModel,
  ): Promise<ExperienceModel[]> {
    if (profile.experience) {
      return profile.experience;
    }
    const lang = profile._lang ?? Language.EN;
    const rows = await this.profileDataLoader.experienceLoader.load(profile.id);
    return rows.map((row) => this.profileService.mapExperience(row, lang));
  }

  @ResolveField(() => [ProjectModel], { name: 'projects' })
  async resolveProjects(
    @Parent() profile: ProfileModel,
  ): Promise<ProjectModel[]> {
    if (profile.projects) {
      return profile.projects;
    }
    const lang = profile._lang ?? Language.EN;
    const rows = await this.profileDataLoader.projectsLoader.load(profile.id);
    return rows.map((row) => this.profileService.mapProject(row, lang));
  }

  @ResolveField(() => [CertificationModel], { name: 'certifications' })
  async resolveCertifications(
    @Parent() profile: ProfileModel,
  ): Promise<CertificationModel[]> {
    if (profile.certifications) {
      return profile.certifications;
    }
    const lang = profile._lang ?? Language.EN;
    const rows = await this.profileDataLoader.certificationsLoader.load(
      profile.id,
    );
    return rows.map((row) => this.profileService.mapCertification(row, lang));
  }
}
