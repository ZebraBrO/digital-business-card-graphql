import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Project')
export class ProjectModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String)
  url!: string;

  @Field(() => [String])
  techStack!: string[];

  @Field(() => Boolean)
  isNda!: boolean;
}
