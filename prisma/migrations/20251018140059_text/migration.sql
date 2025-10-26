-- CreateEnum
CREATE TYPE "Language" AS ENUM ('RU', 'EN');

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);
