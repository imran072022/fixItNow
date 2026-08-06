/*
  Warnings:

  - A unique constraint covering the columns `[technicianProfileId,categoryId,name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_technicianProfileId_categoryId_name_key" ON "Service"("technicianProfileId", "categoryId", "name");
