import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Language } from '../enums/language.enum';
import { CertificationModel } from './certification.model';
import { ExperienceModel } from './experience.model';
import { ProjectModel } from './project.model';
import { SkillModel } from './skill.model';
import { SocialLinkModel } from './social-link.model';

@ObjectType('Profile', {
  description: 'Цифровая визитка специалиста (основной профиль и связанные коллекции)',
})
export class ProfileModel {
  @Field(() => ID, { description: 'Уникальный идентификатор профиля (UUID)' })
  id!: string;

  @Field(() => String, { description: 'Имя и фамилия специалиста' })
  name!: string;

  @Field(() => String, { description: 'Специализация / грейд / основной профиль' })
  title!: string;

  @Field(() => String, { description: 'Краткое профессиональное описание (Summary / Bio)' })
  description!: string;

  @Field(() => String, { description: 'Локация и готовность к релокации' })
  location!: string;

  @Field(() => String, { description: 'Контактный Email' })
  email!: string;

  @Field(() => String, { description: 'Контактный телефон' })
  phone!: string;

  @Field(() => String, { description: 'Никнейм в Telegram' })
  telegram!: string;

  @Field(() => [SocialLinkModel], {
    description: 'Ссылки на GitHub, Telegram и другие профессиональные ресурсы',
  })
  links?: SocialLinkModel[];

  @Field(() => [SkillModel], {
    description: 'Список технических навыков и компетенций',
  })
  skills?: SkillModel[];

  @Field(() => [ExperienceModel], {
    description: 'Коммерческий опыт работы и достижения',
  })
  experience?: ExperienceModel[];

  @Field(() => [ProjectModel], {
    description: 'Реализованные проекты (Open-Source и коммерческие системы)',
  })
  projects?: ProjectModel[];

  @Field(() => [CertificationModel], {
    description: 'Профессиональные сертификации (PostgreSQL DBA/QPT, Linux)',
  })
  certifications?: CertificationModel[];

  /**
   * Внутреннее служебное свойство (не публикуется в схему GraphQL, т.к. нет декоратора @Field).
   * Передает выбранный язык запроса (EN / RU) от корневого резолвера `profile`
   * во все дочерние резолверы `@ResolveField()`.
   */
  _lang?: Language;
}
