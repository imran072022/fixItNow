import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type catchAsync from "../../utils/catchAsync";
import type { AvailabilitySlot, TechnicianProfileId } from "./technician.type";
import httpStatus from "http-status";

const getTechnicianProfiles = async () => {
  const technicianProfiles = await prisma.technicianProfile.findMany({
    select: {
      id: true,
      photoUrl: true,
      location: true,
      experience: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return technicianProfiles;
};
const getATechnicianProfile = async (id: TechnicianProfileId) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      photoUrl: true,
      dob: true,
      location: true,
      experience: true,
      isOnVacation: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      availabilitySlots: {
        select: {
          id: true,
          dayOfWeek: true,
          startMinute: true,
          endMinute: true,
        },
      },
      services: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          review: true,
          createdAt: true,
        },
      },
    },
  });
  return technicianProfile;
};

const setAvailability = async (payload: AvailabilitySlot, userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });
  if (!profile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile doesn't exist",
    );
  }
  const { dayOfWeek, startMinute, endMinute } = payload;

  const slot = await prisma.availabilitySlot.create({
    data: {
      technicianProfileId: profile.id,
      dayOfWeek,
      startMinute,
      endMinute,
    },
  });
  return slot;
};

export const technicianService = {
  getTechnicianProfiles,
  getATechnicianProfile,
  setAvailability,
};
