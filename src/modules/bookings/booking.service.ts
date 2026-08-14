import {
  BookingStatus,
  Role,
  type DayOfWeek,
} from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { JwtUserPayload } from "../auth/auth.types";
import type { BookingPayload } from "./booking.type";
import httpStatus from "http-status";

const createBooking = async (payload: BookingPayload, userId: string) => {
  const { serviceId, bookingDate, location, bookingDetails } = payload;

  // 1. Check customer
  const customerExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!customerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer doesn't exist");
  }

  // 2. Get the selected service + its technician
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      technicianProfile: {
        include: {
          user: true,
          _count: {
            select: {
              services: true,
              availabilitySlots: true,
            },
          },
        },
      },
    },
  });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service doesn't exist");
  }

  const technicianProfile = service.technicianProfile;
  const technician = technicianProfile.user;

  // 3. Check technician profile is complete
  if (
    !technician.name ||
    !technicianProfile.photoUrl ||
    !technicianProfile.dob ||
    !technicianProfile.location
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician profile is incomplete and cannot receive bookings",
    );
  }

  // 4. Check technician is not on vacation
  if (technicianProfile.isOnVacation) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician is currently on vacation",
    );
  }

  // 5. Check technician has at least one service
  if (technicianProfile._count.services < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician has not created any services",
    );
  }

  // 6. Check technician has at least one availability slot
  if (technicianProfile._count.availabilitySlots < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician has not set any availability slots",
    );
  }

  // 7. Booking must be in Bangladesh time
  const timeZone = "Asia/Dhaka";

  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const today = dateFormatter.format(new Date());
  const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
  const maximumDate = dateFormatter.format(sixtyDaysFromNow);
  const requestedDate = dateFormatter.format(bookingDate);

  // 8. Check booking date is within next 60 days
  if (requestedDate < today || requestedDate > maximumDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking date must be within the next 60 days",
    );
  }

  // 9. Get weekday and time in Bangladesh
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
  })
    .format(bookingDate)
    .toUpperCase() as DayOfWeek;

  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(bookingDate);

  const hour = Number(timeParts.find((part) => part.type === "hour")?.value);

  const minute = Number(
    timeParts.find((part) => part.type === "minute")?.value,
  );

  const bookingMinute = hour * 60 + minute;

  // 10. Only allow 30-minute booking times
  if (minute % 30 !== 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking time must be in 30-minute intervals",
    );
  }

  // 11. Check that this weekday/time is inside technician availability
  const availabilitySlot = await prisma.availabilitySlot.findFirst({
    where: {
      technicianProfileId: technicianProfile.id,
      dayOfWeek: weekday,
      startMinute: {
        lte: bookingMinute,
      },
      endMinute: {
        gte: bookingMinute + 30,
      },
    },
  });

  if (!availabilitySlot) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician is not available at the selected time",
    );
  }

  // 12. Check whether this exact booking time is already occupied
  const existingBooking = await prisma.booking.findFirst({
    where: {
      bookingDate,
      service: {
        technicianProfileId: technicianProfile.id,
      },
      status: {
        in: ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"],
      },
    },
  });

  if (existingBooking) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Technician is already booked at this time",
    );
  }

  // 13. Create the booking
  return prisma.booking.create({
    data: {
      customerId: userId,
      technicianProfileId: technicianProfile.id,
      serviceId,
      bookingDetails,
      location,
      bookingDate,
    },
  });
};

const getAllBookings = async (userInfo: JwtUserPayload) => {
  const { id, role } = userInfo;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
  }
  const bookings =
    role === Role.ADMIN
      ? await prisma.booking.findMany()
      : role === Role.CUSTOMER
        ? await prisma.booking.findMany({
            where: {
              customerId: id,
            },
          })
        : await prisma.booking.findMany({
            where: {
              technicianProfile: {
                userId: id,
              },
            },
          });
  return {
    total: bookings?.length,
    bookings,
  };
};

const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      technicianProfile: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  // Make sure this technician owns the service
  if (booking.technicianProfile.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this booking",
    );
  }

  // Only REQUESTED bookings can be accepted or denied
  if (booking.status === BookingStatus.REQUESTED) {
    const result = prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
    });
    return result;
  }
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};
