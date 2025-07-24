/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Household` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Household" ADD COLUMN     "inviteCode" TEXT NOT NULL DEFAULT 'TEMP';

-- CreateIndex
CREATE UNIQUE INDEX "Household_inviteCode_key" ON "Household"("inviteCode");
