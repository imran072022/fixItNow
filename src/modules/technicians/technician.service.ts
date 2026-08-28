import type { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type {
  TAvailabilitySlot,
  TechnicianProfileId,
  TGetTechnicianProfilesQuery,
} from "./technician.type";
import httpStatus from "http-status";

const getTechnicianProfiles = async (query: TGetTechnicianProfilesQuery) => {
  const {
    search,
    category,
    minExperience,
    minRating,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = query;
  const where: Prisma.TechnicianProfileWhereInput = {
    ...(search && {
      OR: [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          services: {
            some: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          location: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(category && {
      services: {
        some: {
          category: {
            name: {
              contains: category,
              mode: "insensitive",
            },
          },
        },
      },
    }),

    ...(minExperience !== undefined && {
      experience: {
        gte: minExperience,
      },
    }),

    ...(minRating !== undefined && {
      ratingAverage: {
        gte: minRating,
      },
    }),
  };

  const orderBy: Prisma.TechnicianProfileOrderByWithRelationInput = {
    ...(sortBy === "experience" && {
      experience: sortOrder ?? "desc",
    }),

    ...(sortBy === "rating" && {
      ratingAverage: sortOrder ?? "desc",
    }),
  };

  const skip = (page - 1) * limit;

  const [technicianProfiles, total] = await prisma.$transaction([
    prisma.technicianProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,

      select: {
        id: true,
        location: true,
        experience: true,
        ratingAverage: true,
        reviewCount: true,

        user: {
          select: {
            name: true,
            phone: true,
            photoUrl: true,
          },
        },

        services: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    }),

    prisma.technicianProfile.count({
      where,
    }),
  ]);

  return {
    technicianProfiles,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getATechnicianProfile = async (id: TechnicianProfileId) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      dob: true,
      location: true,
      experience: true,
      isOnVacation: true,
      ratingAverage: true,
      reviewCount: true,
      createdAt: true,

      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          photoUrl: true,
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

      bookings: {
        where: {
          review: {
            isNot: null,
          },
        },
        select: {
          review: {
            select: {
              id: true,
              rating: true,
              review: true,
              createdAt: true,
              reviewer: {
                select: {
                  name: true,
                  photoUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const isProfileComplete =
    !!technicianProfile.user.name &&
    !!technicianProfile.user.photoUrl &&
    !!technicianProfile.user.phone &&
    !!technicianProfile.dob &&
    !!technicianProfile.location;

  const hasService = technicianProfile.services.length > 0;

  const hasAvailability = technicianProfile.availabilitySlots.length > 0;

  const isBookable =
    isProfileComplete &&
    hasService &&
    hasAvailability &&
    !technicianProfile.isOnVacation;

  return {
    ...technicianProfile,
    isBookable,
  };
};

const setAvailability = async (payload: TAvailabilitySlot, userId: string) => {
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
