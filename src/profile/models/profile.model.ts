import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Language } from '../enums/language.enum';
import { CertificationModel } from './certification.model';
import { ExperienceModel } from './experience.model';
import { ProjectModel } from './project.model';
import { SkillModel } from './skill.model';
import { SocialLinkModel } from './social-link.model';

@ObjectType('Profile', {
  description: 'Specialist profile and related collections',
})
export class ProfileModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String)
  location!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  phone!: string;

  @Field(() => String)
  telegram!: string;

  @Field(() => [SocialLinkModel])
  links?: SocialLinkModel[];

  @Field(() => [SkillModel])
  skills?: SkillModel[];

  @Field(() => [ExperienceModel])
  experience?: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects?: ProjectModel[];

  @Field(() => [CertificationModel])
  certifications?: CertificationModel[];

  _lang?: Language;
}
