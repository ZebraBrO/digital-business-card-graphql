import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Language, OptimizationStrategy } from './enums/language.enum';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let prismaMock: {
    profile: {
      findFirst: jest.Mock;
    };
  };

  const mockProfileRecord = {
    id: '045d879a-c3a8-421c-bc26-89adeaaa1ba8',
    slug: 'dmitrii-sivirin',
    nameEn: 'Dmitrii Sivirin',
    nameRu: 'Дмитрий Сивирин',
    titleEn: 'Full-Stack / Back-End Engineer',
    titleRu: 'Full-Stack / Backend-разработчик',
    descriptionEn: 'English summary',
    descriptionRu: 'Русское описание',
    locationEn: 'Kostanay, KZ',
    locationRu: 'Костанай, Казахстан',
    email: 'thezebrabro@gmail.com',
    phone: '+7 (705) 590-24-73',
    telegram: '@zebrabro',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      profile: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('returns English profile fields by default when lang is EN', async () => {
    prismaMock.profile.findFirst.mockResolvedValue(mockProfileRecord);

    const result = await service.getProfile(
      Language.EN,
      OptimizationStrategy.DATALOADER,
    );

    expect(result.name).toBe('Dmitrii Sivirin');
    expect(result.description).toBe('English summary');
    expect(prismaMock.profile.findFirst).toHaveBeenCalledWith({
      where: { slug: 'dmitrii-sivirin' },
      include: undefined,
    });
  });

  it('returns Russian profile fields when lang is RU', async () => {
    prismaMock.profile.findFirst.mockResolvedValue(mockProfileRecord);

    const result = await service.getProfile(
      Language.RU,
      OptimizationStrategy.DATALOADER,
    );

    expect(result.name).toBe('Дмитрий Сивирин');
    expect(result.description).toBe('Русское описание');
  });

  it('passes requested relations to Prisma include when strategy is AST_JOIN', async () => {
    prismaMock.profile.findFirst.mockResolvedValue({
      ...mockProfileRecord,
      skills: [
        {
          id: 'skill-1',
          name: 'PostgreSQL',
          categoryEn: 'Databases',
          categoryRu: 'Базы данных',
          sortOrder: 1,
          profileId: mockProfileRecord.id,
        },
      ],
    });

    const result = await service.getProfile(
      Language.RU,
      OptimizationStrategy.AST_JOIN,
      {
        links: false,
        skills: true,
        experience: false,
        projects: false,
        certifications: false,
      },
    );

    expect(prismaMock.profile.findFirst).toHaveBeenCalledWith({
      where: { slug: 'dmitrii-sivirin' },
      include: {
        links: false,
        skills: { orderBy: { sortOrder: 'asc' } },
        experience: false,
        projects: false,
        certifications: false,
      },
    });
    expect(result.skills).toEqual([
      {
        id: 'skill-1',
        name: 'PostgreSQL',
        category: 'Базы данных',
      },
    ]);
  });

  it('throws NotFoundException when profile is missing in database', async () => {
    prismaMock.profile.findFirst.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toThrow(NotFoundException);
  });
});
