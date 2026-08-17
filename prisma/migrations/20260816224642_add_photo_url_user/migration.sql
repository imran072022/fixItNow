/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `TechnicianProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TechnicianProfile" DROP COLUMN "photoUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "photoUrl" TEXT;
