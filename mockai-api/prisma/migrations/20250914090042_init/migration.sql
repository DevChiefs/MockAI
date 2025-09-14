-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;
