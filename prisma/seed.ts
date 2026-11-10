import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting database seed for profile: Dmitrii Sivirin...');

  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
      where: { slug: 'dmitrii-sivirin' },
      update: {
        nameEn: 'Dmitrii Sivirin',
        nameRu: 'Дмитрий Сивирин',
        titleEn: 'Full-Stack / Back-End Engineer (PHP / TypeScript / PostgreSQL / Linux)',
        titleRu: 'Full-Stack / Backend-разработчик (PHP / TypeScript / PostgreSQL / Linux)',
        descriptionEn:
          'Full-Stack & Back-End Engineer with over 4.5 years of commercial experience building, modernizing, and optimizing enterprise web applications, APIs, relational databases, and Linux infrastructure. Certified PostgreSQL DBA & Query Performance Tuning specialist (completed the full 4-tier Postgres Professional certification track). Experienced in migrating legacy C# monoliths to modern Web architectures, building data processing pipelines in Python (Pandas, OpenPyXL), and developing scalable services with PHP, TypeScript/Node.js, and PostgreSQL.',
        descriptionRu:
          'Full-Stack и Backend-разработчик с коммерческим опытом более 4.5 лет в проектировании, модернизации и оптимизации корпоративных веб-приложений, API, реляционных баз данных и Linux-инфраструктуры. Сертифицированный специалист по администрированию и оптимизации запросов PostgreSQL (полный цикл из 4 сертификаций Postgres Professional DBA + QPT). Имею большой практический опыт переноса легаси C#-монолитов в веб, автоматизации бизнес-процессов и ETL-обработки данных на Python (Pandas, OpenPyXL), а также разработки на PHP, TypeScript/Node.js и PostgreSQL.',
        locationEn: 'Kostanay, Kazakhstan / Surgut, Russia (Ready to relocate)',
        locationRu: 'Костанай, Казахстан / Сургут, Россия (Готов к релокации)',
        email: 'thezebrabro@gmail.com',
        phone: '+7 (705) 590-24-73 / +7 (906) 895-98-10',
        telegram: '@zebrabro',
      },
      create: {
        slug: 'dmitrii-sivirin',
        nameEn: 'Dmitrii Sivirin',
        nameRu: 'Дмитрий Сивирин',
        titleEn: 'Full-Stack / Back-End Engineer (PHP / TypeScript / PostgreSQL / Linux)',
        titleRu: 'Full-Stack / Backend-разработчик (PHP / TypeScript / PostgreSQL / Linux)',
        descriptionEn:
          'Full-Stack & Back-End Engineer with over 4.5 years of commercial experience building, modernizing, and optimizing enterprise web applications, APIs, relational databases, and Linux infrastructure. Certified PostgreSQL DBA & Query Performance Tuning specialist (completed the full 4-tier Postgres Professional certification track). Experienced in migrating legacy C# monoliths to modern Web architectures, building data processing pipelines in Python (Pandas, OpenPyXL), and developing scalable services with PHP, TypeScript/Node.js, and PostgreSQL.',
        descriptionRu:
          'Full-Stack и Backend-разработчик с коммерческим опытом более 4.5 лет в проектировании, модернизации и оптимизации корпоративных веб-приложений, API, реляционных баз данных и Linux-инфраструктуры. Сертифицированный специалист по администрированию и оптимизации запросов PostgreSQL (полный цикл из 4 сертификаций Postgres Professional DBA + QPT). Имею большой практический опыт переноса легаси C#-монолитов в веб, автоматизации бизнес-процессов и ETL-обработки данных на Python (Pandas, OpenPyXL), а также разработки на PHP, TypeScript/Node.js и PostgreSQL.',
        locationEn: 'Kostanay, Kazakhstan / Surgut, Russia (Ready to relocate)',
        locationRu: 'Костанай, Казахстан / Сургут, Россия (Готов к релокации)',
        email: 'thezebrabro@gmail.com',
        phone: '+7 (705) 590-24-73 / +7 (906) 895-98-10',
        telegram: '@zebrabro',
      },
    });

    await Promise.all([
      tx.socialLink.deleteMany({ where: { profileId: profile.id } }),
      tx.skill.deleteMany({ where: { profileId: profile.id } }),
      tx.experience.deleteMany({ where: { profileId: profile.id } }),
      tx.project.deleteMany({ where: { profileId: profile.id } }),
      tx.certification.deleteMany({ where: { profileId: profile.id } }),
    ]);

    await tx.socialLink.createMany({
      data: [
        {
          profileId: profile.id,
          platform: 'GitHub',
          url: 'https://github.com/zebrabro',
          sortOrder: 1,
        },
        {
          profileId: profile.id,
          platform: 'Telegram',
          url: 'https://t.me/zebrabro',
          sortOrder: 2,
        },
        {
          profileId: profile.id,
          platform: 'Email',
          url: 'mailto:thezebrabro@gmail.com',
          sortOrder: 3,
        },
      ],
    });

    await tx.skill.createMany({
      data: [
        {
          profileId: profile.id,
          name: 'PostgreSQL (Query Optimization, Execution Plans, Indexing, Replication, Backup & Recovery)',
          categoryEn: 'Databases & SQL',
          categoryRu: 'Базы данных и SQL',
          sortOrder: 1,
        },
        {
          profileId: profile.id,
          name: 'TypeScript / Node.js / NestJS',
          categoryEn: 'Back-End & Architecture',
          categoryRu: 'Бэкенд и Архитектура',
          sortOrder: 2,
        },
        {
          profileId: profile.id,
          name: 'GraphQL (Apollo Server, Schema Design, DataLoader N+1 Optimization) & REST API',
          categoryEn: 'Back-End & Architecture',
          categoryRu: 'Бэкенд и Архитектура',
          sortOrder: 3,
        },
        {
          profileId: profile.id,
          name: 'Prisma ORM / Custom Data Mapper / SQL',
          categoryEn: 'Databases & SQL',
          categoryRu: 'Базы данных и SQL',
          sortOrder: 4,
        },
        {
          profileId: profile.id,
          name: 'PHP (OOP, SOLID, MVC Architecture, Strict Typing, PSR Standards, RBAC)',
          categoryEn: 'Back-End & Architecture',
          categoryRu: 'Бэкенд и Архитектура',
          sortOrder: 5,
        },
        {
          profileId: profile.id,
          name: 'Python (Pandas, OpenPyXL, ETL Pipelines, Excel Automation & Scripting)',
          categoryEn: 'Data Processing & Automation',
          categoryRu: 'Обработка данных и Автоматизация',
          sortOrder: 6,
        },
        {
          profileId: profile.id,
          name: 'JavaScript (ES6+, Modular JS, Async Fetch/AJAX, DOM, HTML5, CSS3/SASS)',
          categoryEn: 'Front-End Web',
          categoryRu: 'Фронтенд и Веб-интерфейсы',
          sortOrder: 7,
        },
        {
          profileId: profile.id,
          name: 'Docker & Docker Compose, Linux Server Administration (Nginx, systemd, Bash, SSH)',
          categoryEn: 'DevOps & Infrastructure',
          categoryRu: 'DevOps и Инфраструктура',
          sortOrder: 8,
        },
        {
          profileId: profile.id,
          name: 'Proxmox VE Virtualization, Git, CI/CD Pipelines',
          categoryEn: 'DevOps & Infrastructure',
          categoryRu: 'DevOps и Инфраструктура',
          sortOrder: 9,
        },
      ],
    });

    await tx.experience.createMany({
      data: [
        {
          profileId: profile.id,
          companyEn: 'Surgutneftegas PJSC (Polytechnic Training Center)',
          companyRu: 'ПАО «Сургутнефтегаз» (Центр политехнического обучения)',
          positionEn: 'Web Programmer / Back-End Developer (PHP / Python / JS / PostgreSQL)',
          positionRu: 'Web-программист / Backend-разработчик (PHP / Python / JS / PostgreSQL)',
          periodEn: 'June 2025 - Present (1 year 5 months)',
          periodRu: 'Июнь 2025 - Настоящее время (1 год 5 месяцев)',
          achievementsEn: [
            'Designed, developed, and maintained the back-end architecture, REST APIs, and web interfaces for 15+ internal enterprise automation systems serving corporate training across regional divisions.',
            'Migrated a massive legacy C# monolith (PIOK) serving 5 departments and a training polygon into a modern web application with fuzzy string matching for course/profession deduplication and SAP ERP data ingestion.',
            'Built an end-to-end Training Group Dossier & Workflow Engine from scratch that automated over 50% of the department operational document workflow.',
            'Automated ~40% of routine operational workflows by integrating Python services (Pandas, OpenPyXL) for SAP data reconciliation, test grading analytics, and dynamic Excel/Word report generation.',
            'Engineered a fault-tolerant 4-node Node.js video streaming service with automatic client-side failover over shared network storage.',
            'Provisioned and maintained the production Linux server environment from scratch (Nginx, PostgreSQL, PHP-FPM, systemd) and eliminated complex PostgreSQL query bottlenecks.',
            'Awarded a 2nd Degree Corporate Innovation Diploma for a technical software project that delivered a verified economic effect for the enterprise.',
          ],
          achievementsRu: [
            'Спроектировал и разработал бэкенд-архитектуру, API и веб-интерфейсы для 15+ внутренних корпоративных систем автоматизации учебного центра ПАО «Сургутнефтегаз».',
            'Выполнил миграцию крупного легаси-монолита (ПИОК) с C# на веб-архитектуру (для 5 отделов и учебного полигона), реализовав пайплайны сверки выгрузок из SAP ERP и алгоритм нечеткого поиска (Fuzzy Matching) для исправления опечаток в справочниках.',
            'Разработал с нуля систему формирования «Дел групп», которая полностью автоматизировала более 50% бумажной и операционной работы профильного отдела.',
            'Автоматизировал ~40% рутинных процессов за счет внедрения Python-сервисов (Pandas, OpenPyXL) для обработки данных из SAP, Moodle и ЕИСОТ с генерацией сложных отчетов в Excel и Word (.docx).',
            'Создал отказоустойчивый видеохостинг на Node.js (кластер из 4 рабочих узлов с автоматическим клиентским фейловером поверх сетевого хранилища).',
            'Развернул и администрировал с нуля продакшн Linux-серверы (Nginx, PostgreSQL, PHP-FPM, systemd) и оптимизировал тяжелые аналитические SQL-запросы.',
            'Награжден Дипломом II степени на научно-технической конференции за разработку ПО с подтвержденным экономическим эффектом.',
          ],
          sortOrder: 1,
        },
        {
          profileId: profile.id,
          companyEn: 'Uchi.ru',
          companyRu: 'Учи.ру (Uchi.ru)',
          positionEn: 'Web & Infrastructure Engineer (PHP / Python / JS / Linux)',
          positionRu: 'Инженер веб-разработки и инфраструктуры (PHP / Python / JS / Linux)',
          periodEn: 'March 2022 - May 2025 (3 years 3 months)',
          periodRu: 'Март 2022 - Май 2025 (3 года 3 месяца)',
          achievementsEn: [
            'Developed and maintained internal web services, scripts, and automation tools in PHP, Python, and JavaScript to manage accounting, scheduling, and educational workflows.',
            'Designed relational database schemas, wrote optimized SQL queries, and administered PostgreSQL and MySQL databases.',
            'Deployed and supported on-premise Linux server infrastructure based on Proxmox VE virtualization to keep internal systems and testing stands running reliably.',
            'Wrote Bash and Python CLI utilities to automate routine infrastructure operations, including database backups, VM state resets, and node availability monitoring.',
            'Conducted regular code reviews across Python, JavaScript, and C# projects, led technical workshops, and onboarded staff to internal systems.',
          ],
          achievementsRu: [
            'Разрабатывал и поддерживал внутренние веб-сервисы и инструменты автоматизации на PHP, Python и JavaScript для управления учетом, расписаниями и учебными процессами.',
            'Проектировал схемы реляционных БД, оптимизировал SQL-запросы и администрировал серверы PostgreSQL и MySQL.',
            'Развернул и сопровождал on-premise серверную инфраструктуру на базе виртуализации Proxmox VE и Linux.',
            'Написал комплекс CLI-скриптов на Bash и Python для автоматизации резервного копирования БД, сброса состояний виртуальных машин и мониторинга доступности узлов.',
            'Проводил код-ревью проектов на Python, JavaScript и C#, вел технические воркшопы и онбординг сотрудников.',
          ],
          sortOrder: 2,
        },
      ],
    });

    await tx.project.createMany({
      data: [
        {
          profileId: profile.id,
          nameEn: 'Digital Business Card GraphQL API (Open-Source)',
          nameRu: 'Цифровая визитка - GraphQL API (Open-Source)',
          descriptionEn:
            'Bilingual (EN/RU) digital business card backend built with NestJS, Apollo GraphQL, Prisma ORM, and PostgreSQL. Features DataLoader and AST lookahead optimizations to eliminate the GraphQL N+1 query problem, idempotent ACID database seeding, automated E2E tests, and zero-config Docker Compose startup.',
          descriptionRu:
            'Двуязычный (RU/EN) бэкенд цифровой визитки на NestJS, Apollo GraphQL, Prisma ORM и PostgreSQL. Включает оптимизацию вложенных запросов (DataLoader и анализ AST-дерева запроса против проблемы N+1), идемпотентное заполнение БД в транзакции, E2E-тесты и запуск с нуля одной командой в Docker Compose.',
          url: 'https://github.com/zebrabro/digital-business-card-graphql',
          techStack: [
            'TypeScript',
            'Node.js',
            'NestJS',
            'GraphQL (Apollo)',
            'Prisma ORM',
            'PostgreSQL 16',
            'DataLoader',
            'Docker',
          ],
          isNda: false,
          sortOrder: 1,
        },
        {
          profileId: profile.id,
          nameEn: 'Automated Training Group Dossier & Document Workflow Engine ("Group Dossiers")',
          nameRu: 'Система автоматизации документооборота и формирования «Дел групп»',
          descriptionEn:
            'Built from scratch to automate over 50% of the training department operational workload. Ingests cross-division applications, forms training groups, calculates classroom utilization and schedules, maintains electronic attendance journals, generates cybersecurity/safety compliance forms, renders graduation certificates from templates, and compiles complete archival dossiers.',
          descriptionRu:
            'Разработанная с нуля комплексная система, автоматизировавшая более 50% работы отдела. Собирает заявки от структурных подразделений, формирует учебные группы, рассчитывает расписание и загрузку аудиторного фонда, ведет электронные журналы, генерирует бланки инструктажей по ИБ, печатает сертификаты по шаблонам и собирает итоговое архивное дело группы.',
          url: 'Corporate NDA (Surgutneftegas PJSC - Internal Enterprise System)',
          techStack: ['PHP 7.4 (OOP/MVC)', 'PostgreSQL', 'Python (OpenPyXL)', 'JavaScript (ES6+)', 'HTML5/SASS'],
          isNda: true,
          sortOrder: 2,
        },
        {
          profileId: profile.id,
          nameEn: 'PIOK - Legacy C# Monolith to Web Migration & SAP Data Reconciliation Platform',
          nameRu: 'ПИОК - Миграция легаси C#-монолита в Web и платформа сверки данных SAP ERP',
          descriptionEn:
            'Migrated a core legacy C# desktop/monolith system serving 5 departments and a training polygon into a modular web platform. Implemented Python (Pandas, OpenPyXL) ETL pipelines for SAP ERP Excel exports (staff timesheets and instructor hourly payroll calculation), fuzzy string matching for deduplicating misspelled course and profession names, field-level RBAC database editing, and automated .doc/.docx document generation.',
          descriptionRu:
            'Перенос ключевого легаси-монолита с C# на современную веб-архитектуру для 5 отделов и учебного полигона. Реализованы пайплайны на Python (Pandas, OpenPyXL) для обработки выгрузок из SAP ERP (табелирование сотрудников и расчет почасовой оплаты преподавателей), алгоритм нечеткого поиска (Fuzzy Matching) для исправления опечаток в названиях курсов и профессий, ролевой доступ (RBAC) к редактированию справочников БД и генерация документов .doc/.docx по шаблонам.',
          url: 'Corporate NDA (Surgutneftegas PJSC - Internal Enterprise System)',
          techStack: ['PHP 7.4', 'C# (.NET Legacy)', 'Python (Pandas, OpenPyXL)', 'PostgreSQL', 'JavaScript'],
          isNda: true,
          sortOrder: 3,
        },
        {
          profileId: profile.id,
          nameEn: 'Course Curriculum Constructor & Tariff Rule Engine (1,500+ Courses)',
          nameRu: 'Конструктор учебных программ и движок правил тарификации (1 500+ курсов)',
          descriptionEn:
            'Domain-driven curriculum management system handling 1,500+ corporate courses across 15 training formats (full-time, blended, distance, polygon). Engineered a cross-attribute validation and calculation engine managing ~50 interdependent parameters to automatically balance theory, practice, polygon, and e-learning hours alongside cost calculation.',
          descriptionRu:
            'Система проектирования и управления базой из 1 500+ учебных курсов (15 типов обучения: с отрывом, частичным отрывом, электронно-смешанные, полигонные). Реализован движок перекрестной валидации ~50 взаимозависимых атрибутов курса с автоматическим сведением баланса часов (теория, практика, полигон, эл. занятость) и расчетом стоимости.',
          url: 'Corporate NDA (Surgutneftegas PJSC - Internal Enterprise System)',
          techStack: ['PHP 7.4 (OOP/MVC)', 'PostgreSQL', 'JavaScript (ES6+)', 'REST API'],
          isNda: true,
          sortOrder: 4,
        },
        {
          profileId: profile.id,
          nameEn: 'Real-Time Collaborative SAP Group Request Dispatch Queue',
          nameRu: 'Real-Time система диспетчеризации заявок на создание групп в SAP',
          descriptionEn:
            'Multi-operator request dispatch application for annual and unplanned SAP training group creation. Features real-time state synchronization via Long-Polling (operators see claimed, completed, and canceled requests instantaneously without page reloads) backed by a comprehensive PostgreSQL audit log.',
          descriptionRu:
            'Многопользовательская система диспетчеризации плановых и внеплановых заявок от руководителей подразделений на формирование учебных групп в SAP. Реализована мгновенная синхронизация статусов между всеми сотрудниками отдела через Long-Polling (взятие заявки в работу, выполнение, удаление) с полным логированием действий в PostgreSQL.',
          url: 'Corporate NDA (Surgutneftegas PJSC - Internal Enterprise System)',
          techStack: ['PHP 7.4', 'JavaScript (Long-Polling / Async Fetch)', 'PostgreSQL', 'RBAC'],
          isNda: true,
          sortOrder: 5,
        },
        {
          profileId: profile.id,
          nameEn: 'Fault-Tolerant Node.js Video Streaming Cluster & LMS/Safety Analytics Suite',
          nameRu: 'Отказоустойчивый видеохостинг на Node.js и комплекс аналитики Moodle / ЕИСОТ',
          descriptionEn:
            'Distributed internal video streaming service built on Node.js across 4 workstation nodes over shared SMB storage with automatic client-side failover (zero downtime when individual host PCs are powered off). Paired with Python (Pandas, OpenPyXL) automation tools for LMS Moodle (bulk HR password management, hybrid paper/online exam grading with styled Excel exports) and EISOT occupational safety certification expiry tracking.',
          descriptionRu:
            'Распределенный внутренний видеохостинг на Node.js, запущенный на 4 узлах поверх общего сетевого хранилища с клиентской балансировкой и отказоустойчивостью (автоматическое переключение на первый доступный сервер при выключении ПК сотрудника). Дополнен сервисами на Python (Pandas, OpenPyXL) для LMS Moodle (массовый сброс паролей для ОК, сводная аналитика электронного и бумажного тестирования в Excel) и мониторинга сроков проверки знаний по охране труда (ЕИСОТ).',
          url: 'Corporate NDA (Surgutneftegas PJSC - Internal Enterprise System)',
          techStack: ['Node.js', 'Python (Pandas, OpenPyXL)', 'PHP 7.4', 'PostgreSQL', 'Moodle LMS'],
          isNda: true,
          sortOrder: 6,
        },
      ],
    });

    await tx.certification.createMany({
      data: [
        {
          profileId: profile.id,
          code: 'QPT',
          titleEn: 'Query Performance Tuning in PostgreSQL (SQL optimization, execution plans, indexing)',
          titleRu: 'QPT: Оптимизация запросов в PostgreSQL (планы выполнения, индексы, профилирование SQL)',
          issuer: 'Postgres Professional',
          year: 2026,
          sortOrder: 1,
        },
        {
          profileId: profile.id,
          code: 'DBA3',
          titleEn: 'PostgreSQL Administration - Backup & Replication (High Availability & Fault Tolerance)',
          titleRu: 'DBA3: Администрирование PostgreSQL - Резервное копирование и репликация (Отказоустойчивость)',
          issuer: 'Postgres Professional',
          year: 2026,
          sortOrder: 2,
        },
        {
          profileId: profile.id,
          code: 'DBA2',
          titleEn: 'PostgreSQL Administration - Tuning & Monitoring (Performance Configuration & Diagnostics)',
          titleRu: 'DBA2: Администрирование PostgreSQL - Настройка и мониторинг производительности',
          issuer: 'Postgres Professional',
          year: 2026,
          sortOrder: 3,
        },
        {
          profileId: profile.id,
          code: 'DBA1',
          titleEn: 'PostgreSQL Administration - Core Course (Database Architecture & Core DBA Operations)',
          titleRu: 'DBA1: Администрирование PostgreSQL - Базовый курс (Архитектура СУБД и эксплуатация)',
          issuer: 'Postgres Professional',
          year: 2026,
          sortOrder: 4,
        },
        {
          profileId: profile.id,
          code: 'ALTSHELL / ALTSEC / ALTVIRT',
          titleEn: '3-Course Linux Track: Advanced Shell Scripting, Linux OS Security & Virtualization',
          titleRu: 'Трехступенчатый курс BaseALT: Автоматизация в командной оболочке, Безопасность и Виртуализация Linux',
          issuer: 'BaseALT Linux',
          year: 2025,
          sortOrder: 5,
        },
      ],
    });
  });

  console.log('Database seed completed successfully (EN + RU data loaded).');
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
