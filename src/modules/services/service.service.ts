import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { servicePayload } from "./service.type";
import httpStatus from "http-status";

const createService = async (payload: servicePayload, userId: string) => {
  const { categoryId, name, description, price } = payload;
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
      price,
    },
  });

  return service;
};

const getServices = async () => {
  const services = await prisma.service.findMany({
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
          photoUrl: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      bookings: true,
    },
  });
  return services;
};

export const serviceService = {
  createService,
  getServices,
};
