import type { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { TCreateService, TGetServicesQuery } from "./service.type";
import httpStatus from "http-status";

const createService = async (payload: TCreateService, userId: string) => {
  const { categoryId, name, description, price } = payload;
  const priceInCents = price * 100;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category doesn't exist");
  }
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });
  if (!technicianProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }
  const service = await prisma.service.create({
    data: {
      technicianProfileId: technicianProfile.id,
      categoryId,
      name,
      description,
      price: priceInCents,
    },
  });

  return service;
};

const getServices = async (query: TGetServicesQuery) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = query;
  const where: Prisma.ServiceWhereInput = {
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(category && {
      category: {
        name: {
          contains: category,
          mode: "insensitive",
        },
      },
    }),

    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && {
          gte: minPrice,
        }),
        ...(maxPrice !== undefined && {
          lte: maxPrice,
        }),
      },
    }),
  };

  const orderBy: Prisma.ServiceOrderByWithRelationInput = {
    ...(sortBy === "price" && {
      price: sortOrder ?? "asc",
    }),

    ...(sortBy === "createdAt" && {
      createdAt: sortOrder ?? "desc",
    }),
  };

  const skip = (page - 1) * limit;

  const [services, total] = await prisma.$transaction([
    prisma.service.findMany({
      where,
      orderBy,
      skip,
      take: limit,

      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,

        technicianProfile: {
          select: {
            id: true,
            location: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.service.count({
      where,
    }),
  ]);

  return {
    services,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const serviceService = {
  createService,
  getServices,
};
