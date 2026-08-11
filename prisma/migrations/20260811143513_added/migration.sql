/*
  Warnings:

  - A unique constraint covering the columns `[technicianProfileId,dayOfWeek,startMinute,endMinute]` on the table `AvailabilitySlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AvailabilitySlot_technicianProfileId_dayOfWeek_startMinute__key" ON "AvailabilitySlot"("technicianProfileId", "dayOfWeek", "startMinute", "endMinute");
