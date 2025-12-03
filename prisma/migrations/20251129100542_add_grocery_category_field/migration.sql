-- CreateEnum
CREATE TYPE "GroceryCategory" AS ENUM ('PRODUCE', 'MEAT', 'DAIRY', 'FROZEN', 'BAKERY', 'CLEANING', 'HOUSEHOLD', 'MISC');

-- AlterTable
ALTER TABLE "GroceryItem" ADD COLUMN     "category" "GroceryCategory" NOT NULL DEFAULT 'MISC';
