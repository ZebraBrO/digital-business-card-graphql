-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name_en" VARCHAR(150) NOT NULL,
    "name_ru" VARCHAR(150) NOT NULL,
    "title_en" VARCHAR(255) NOT NULL,
    "title_ru" VARCHAR(255) NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ru" TEXT NOT NULL,
    "location_en" VARCHAR(255) NOT NULL,
    "location_ru" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(100) NOT NULL,
    "telegram" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" UUID NOT NULL,
    "platform" VARCHAR(100) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "category_en" VARCHAR(150) NOT NULL,
    "category_ru" VARCHAR(150) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "company_en" VARCHAR(200) NOT NULL,
    "company_ru" VARCHAR(200) NOT NULL,
    "position_en" VARCHAR(200) NOT NULL,
    "position_ru" VARCHAR(200) NOT NULL,
    "period_en" VARCHAR(150) NOT NULL,
    "period_ru" VARCHAR(150) NOT NULL,
    "achievements_en" TEXT[],
    "achievements_ru" TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ru" TEXT NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "tech_stack" TEXT[],
    "is_nda" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "title_en" VARCHAR(300) NOT NULL,
    "title_ru" VARCHAR(300) NOT NULL,
    "issuer" VARCHAR(150) NOT NULL,
    "year" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_slug_key" ON "profiles"("slug");

-- CreateIndex
CREATE INDEX "idx_social_links_profile_sort" ON "social_links"("profile_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_skills_profile_sort" ON "skills"("profile_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_experiences_profile_sort" ON "experiences"("profile_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_projects_profile_sort" ON "projects"("profile_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_certifications_profile_sort" ON "certifications"("profile_id", "sort_order");

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
