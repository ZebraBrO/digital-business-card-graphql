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

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileDataLoader: ProfileDataLoader,
  ) {}

  @Query(() => ProfileModel, {
    name: 'profile',
    description: 'Fetch specialist profile, skills, experience, projects, and certifications',
  })
  async getProfile(
    @Args('lang', {
      type: () => Language,
      defaultValue: Language.EN,
    })
    lang: Language,
    @Args('strategy', {
      type: () => OptimizationStrategy,
      defaultValue: OptimizationStrategy.DATALOADER,
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
