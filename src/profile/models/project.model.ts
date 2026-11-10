import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Project', {
  description: 'Реализованный проект (Open-Source репозиторий или коммерческая система под NDA)',
})
export class ProjectModel {
  @Field(() => ID, { description: 'Уникальный идентификатор проекта (UUID)' })
  id!: string;

  @Field(() => String, { description: 'Название проекта' })
  name!: string;

  @Field(() => String, { description: 'Подробное описание архитектуры и решенных бизнес-задач' })
  description!: string;

  @Field(() => String, {
    description: 'Ссылка на проект/репозиторий GitHub или статус коммерческого NDA',
  })
  url!: string;

  @Field(() => [String], { description: 'Стек использованных технологий' })
  techStack!: string[];

  @Field(() => Boolean, { description: 'Флаг нахождения исходного кода под корпоративным NDA' })
  isNda!: boolean;
}
