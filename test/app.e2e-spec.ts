import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Digital Business Card GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('executes the exact GraphQL query from the specification', async () => {
    const query = `
      query {
        profile {
          name
          description
          skills {
            name
          }
          experience {
            company
            position
          }
          projects {
            name
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const profile = response.body.data.profile;
    expect(profile.name).toBe('Dmitrii Sivirin');
    expect(profile.description).toContain('Full-Stack');
    expect(profile.skills.length).toBeGreaterThan(0);
    expect(profile.experience.length).toBeGreaterThanOrEqual(2);
    expect(profile.projects.length).toBeGreaterThanOrEqual(6);
  });

  it('supports Russian localization (lang: RU) and AST_JOIN optimization strategy', async () => {
    const query = `
      query {
        profile(lang: RU, strategy: AST_JOIN) {
          name
          title
          links {
            platform
            url
          }
          experience {
            company
            position
            achievements
          }
          certifications {
            code
            issuer
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const profile = response.body.data.profile;
    expect(profile.name).toBe('Дмитрий Сивирин');
    expect(profile.experience[0].company).toContain('Сургутнефтегаз');
    expect(profile.certifications[0].code).toBe('QPT');
  });

  it('responds with status ok on GET /health', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.database).toBe('up');
  });
});
