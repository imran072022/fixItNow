import { Role } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import type { TUpdateProfile } from "./profile.type";
import type { JwtUserPayload } from "../auth/auth.types";
import { isTechnicianBookable } from "../../utils/isTechnicianBookable";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      photoUrl: true,
      phone: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === Role.TECHNICIAN) {
    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: {
        userId,
      },
      include: {
        availabilitySlots: true,
        services: true,
      },
    });

    if (!technicianProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
    }

    return {
      ...user,
      technicianProfile,
      isBookable: isTechnicianBookable({ ...technicianProfile, user }),
    };
  }

  // CUSTOMER / ADMIN
  return user;
};

const updateMyProfile = async (
  updateProfilePayload: TUpdateProfile,
  userInfo: JwtUserPayload,
) => {
  const { name, photoUrl, phone, dob, location, experience } =
    updateProfilePayload;
  const { role, id: userId } = userInfo;

  const updatedProfile = await prisma.$transaction(async (tx) => {
    // Common profile information — every role can have these
    const updatedUser = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        phone: true,
        role: true,
      },
    });

    // Only technicians have TechnicianProfile
    if (role === Role.TECHNICIAN) {
      const technicianProfile = await tx.technicianProfile.findUnique({
        where: {
          userId,
        },
      });

      if (!technicianProfile) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "Technician profile not found",
        );
      }

      const updatedTechnicianProfile = await tx.technicianProfile.update({
        where: {
          userId,
        },
        data: {
          ...(dob !== undefined && { dob }),
          ...(location !== undefined && { location }),
          ...(experience !== undefined && { experience }),
        },
        select: {
          id: true,
          dob: true,
          location: true,
          experience: true,
          isOnVacation: true,
          updatedAt: true,
        },
      });

      return {
        ...updatedUser,
        technicianProfile: updatedTechnicianProfile,
      };
    }

    // Customer / Admin
    return updatedUser;
  });

  return updatedProfile;
};

export const profileService = {
  getMyProfile,
  updateMyProfile,
};
