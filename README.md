# Digital Business Card - GraphQL API

Backend application presenting the engineering profile, work experience, technical skills, projects, and certifications of **Dmitrii Sivirin**.

## Tech Stack

- **Runtime & Language:** Node.js, TypeScript
- **Framework:** NestJS (Code-First GraphQL, Dependency Injection)
- **API Layer:** GraphQL, Apollo Server v4 (with embedded Apollo Sandbox), DataLoader
- **Database & ORM:** PostgreSQL 16, Prisma ORM (Migrations + Transactional Seeding)
- **Containerization & CI:** Docker, Docker Compose, GitHub Actions CI
- **Testing:** Jest, Supertest (Unit + E2E GraphQL tests)

---

## Quick Start (Docker Compose - Zero Config)

Run the entire stack (PostgreSQL 16 + automatic migrations + database seeding + NestJS server) with a single command:

```bash
docker compose up --build
```

Once started, open in your browser:
- **Apollo Sandbox (GraphQL Playground):** `http://localhost:3000/graphql`
- **Interactive Web Business Card (EN / RU):** `http://localhost:3000/`
- **Healthcheck Endpoint:** `http://localhost:3000/health`

---

## Example GraphQL Queries

### 1. Specification Query (Default `EN` + `DATALOADER`)

```graphql
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
```

### 2. Full Bilingual Query (`lang: RU` or `lang: EN`, `strategy: DATALOADER` or `strategy: AST_JOIN`)

```graphql
query {
  profile(lang: RU, strategy: DATALOADER) {
    name
    title
    description
    location
    email
    phone
    telegram
    links {
      platform
      url
    }
    skills {
      category
      name
    }
    experience {
      company
      position
      period
      achievements
    }
    projects {
      name
      description
      url
      techStack
      isNda
    }
    certifications {
      code
      title
      issuer
      year
    }
  }
}
```

---

## Architecture & Engineering Decisions

### 1. Separation of Concerns (Layered Architecture)
- **Presentation Layer (`ProfileResolver`):** Handles GraphQL query arguments (`lang`, `strategy`), AST inspection (`@Info()`), and field resolution (`@ResolveField()`). Contains zero direct database calls.
- **Business Logic Layer (`ProfileService`):** Coordinates data retrieval and maps bilingual database columns (`*En` / `*Ru`) into localized GraphQL domain models.
- **N+1 Optimization Layer (`ProfileDataLoader` & `extractRequestedRelations`):** Eliminates redundant SQL queries when resolving nested GraphQL fields.
- **Data Access Layer (`PrismaService`):** Manages the PostgreSQL connection pool, graceful shutdown hooks (`OnModuleInit` / `OnModuleDestroy`), and query duration logging in development mode.

### 2. Solving the GraphQL N+1 Problem (Two Implemented Strategies)
The API implements and allows comparing two approaches to nested field loading:
1. **`DATALOADER` (Default):** Request-scoped `DataLoader` instances batch child relation calls (`links`, `skills`, `experience`, `projects`, `certifications`) within a single Event Loop tick into `WHERE profile_id IN ($1) ORDER BY sort_order ASC` queries. Unrequested GraphQL fields are never queried in PostgreSQL.
2. **`AST_JOIN` (`@Info()` Lookahead):** Parses the incoming GraphQL Abstract Syntax Tree (`GraphQLResolveInfo`) before querying PostgreSQL and passes a selective `include` map to Prisma so only the requested child tables are fetched upfront.

### 3. PostgreSQL Indexing & Idempotent Seeding
- **Composite B-Tree Indexes:** Child tables (`social_links`, `skills`, `experiences`, `projects`, `certifications`) define composite indexes `@@index([profileId, sortOrder])` so filtered and ordered queries execute via index scans without in-memory sorting.
- **Idempotent ACID Seeding (`prisma/seed.ts`):** Database initialization runs inside `prisma.$transaction(...)` using `upsert` on the unique `slug` (`dmitrii-sivirin`). Container restarts never fail or duplicate records.

---

## Local Development (Without Docker for Node.js)

```bash
# 1. Start PostgreSQL 16 in Docker
docker compose up -d postgres

# 2. Install dependencies
npm install

# 3. Apply migrations and seed database
npm run prisma:migrate:deploy
npm run prisma:seed

# 4. Run tests (Unit & E2E)
npm test
npm run test:e2e

# 5. Start development server
npm run start:dev
```
