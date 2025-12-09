-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."CreditTransactionType" ADD VALUE 'RUNWAY_PROMPT';
ALTER TYPE "public"."CreditTransactionType" ADD VALUE 'METADATA_GENERATION';
ALTER TYPE "public"."CreditTransactionType" ADD VALUE 'BG_REMOVAL';

-- CreateTable
CREATE TABLE "public"."runway_prompts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'runway',
    "lowMotion" TEXT,
    "mediumMotion" TEXT,
    "highMotion" TEXT,
    "description" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "runway_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metadata_generations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metadata_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "runway_prompts_userId_idx" ON "public"."runway_prompts"("userId");

-- CreateIndex
CREATE INDEX "runway_prompts_createdAt_idx" ON "public"."runway_prompts"("createdAt");

-- CreateIndex
CREATE INDEX "runway_prompts_userId_createdAt_idx" ON "public"."runway_prompts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "metadata_generations_userId_idx" ON "public"."metadata_generations"("userId");

-- CreateIndex
CREATE INDEX "metadata_generations_createdAt_idx" ON "public"."metadata_generations"("createdAt");

-- CreateIndex
CREATE INDEX "metadata_generations_userId_createdAt_idx" ON "public"."metadata_generations"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."runway_prompts" ADD CONSTRAINT "runway_prompts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."metadata_generations" ADD CONSTRAINT "metadata_generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
