import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Certification', {
  description: 'Профессиональная сертификация (Postgres Professional DBA/QPT, BaseALT Linux)',
})
export class CertificationModel {
  @Field(() => ID, { description: 'Уникальный идентификатор сертификата (UUID)' })
  id!: string;

  @Field(() => String, { description: 'Код сертификации (например: QPT, DBA3, DBA2, DBA1)' })
  code!: string;

  @Field(() => String, { description: 'Полное название курса / сертификации' })
  title!: string;

  @Field(() => String, { description: 'Сертифицирующий центр (Postgres Professional, BaseALT)' })
  issuer!: string;

  @Field(() => Int, { description: 'Год получения сертификата' })
  year!: number;
}
