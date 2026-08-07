import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { TechnicianProfileId, TUpdateProfile } from "./technician.type";
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
const updateProfile = async (
  updateProfilePayload: TUpdateProfile,
  userId: string,
) => {
  const { name, photoUrl, dob, location, experience } = updateProfilePayload;

  const profile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const updatedProfile = await prisma.$transaction(async (tx) => {
    const updatedName = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name !== undefined && { name }),
      },
      select: {
        name: true,
      },
    });

    const updatedTechnicianProfile = await tx.technicianProfile.update({
      where: {
        userId,
      },
      data: {
        ...(photoUrl !== undefined && { photoUrl }),
        ...(dob !== undefined && { dob }),
        ...(location !== undefined && { location }),
        ...(experience !== undefined && { experience }),
      },
      select: {
        id: true,
        photoUrl: true,
        dob: true,
        location: true,
        experience: true,
        updatedAt: true,
      },
    });
    return { ...updatedTechnicianProfile, ...updatedName };
  });
  return updatedProfile;
};
const setAvailability = async () => {};

export const technicianService = {
  getTechnicianProfiles,
  getATechnicianProfile,
  updateProfile,
  setAvailability,
};
