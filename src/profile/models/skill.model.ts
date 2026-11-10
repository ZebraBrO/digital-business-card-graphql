import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Skill', {
  description: 'Профессиональный технический навык или технология',
})
export class SkillModel {
  @Field(() => ID, { description: 'Уникальный идентификатор навыка (UUID)' })
  id!: string;

  @Field(() => String, { description: 'Название технологии или компетенции' })
  name!: string;

  @Field(() => String, { description: 'Категория навыка (Databases, Back-End, DevOps и т.д.)' })
  category!: string;
}
