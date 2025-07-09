-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
