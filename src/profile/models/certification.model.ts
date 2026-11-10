import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Certification')
export class CertificationModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  code!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  issuer!: string;

  @Field(() => Int)
  year!: number;
}
