import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience', {
  description: 'Место коммерческой работы и ключевые достижения',
})
export class ExperienceModel {
  @Field(() => ID, { description: 'Уникальный идентификатор записи опыта работы (UUID)' })
  id!: string;

  @Field(() => String, { description: 'Название компании / организации' })
  company!: string;

  @Field(() => String, { description: 'Занимаемая должность' })
  position!: string;

  @Field(() => String, { description: 'Период работы' })
  period!: string;

  @Field(() => [String], { description: 'Список ключевых инженерных достижений на данном месте работы' })
  achievements!: string[];
}
