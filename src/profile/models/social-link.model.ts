import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('SocialLink', {
  description: 'Ссылка на профессиональный ресурс (GitHub, Telegram, Email и др.)',
})
export class SocialLinkModel {
  @Field(() => ID, { description: 'Уникальный идентификатор ссылки (UUID)' })
  id!: string;

  @Field(() => String, { description: 'Название платформы (GitHub, Telegram, LinkedIn)' })
  platform!: string;

  @Field(() => String, { description: 'URL-адрес профиля или ресурса' })
  url!: string;
}
