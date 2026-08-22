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
  const {
    serviceId,
    bookingDate: bookingDateString,
    location,
    bookingDetails,
  } = payload;
  const bookingDate = new Date(bookingDateString);
  // 2. Get the selected service + its technician
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      technicianProfile: {
        include: {
          user: true,
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
    !technician.photoUrl ||
    !technician.phone ||
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

  const isCustomer = booking.customerId === userId;

  const isTechnician = booking.technicianProfile.userId === userId;

  if (!isCustomer && !isTechnician) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this booking",
    );
  }

  // Customer can cancel before the job starts
  if (isCustomer && status === BookingStatus.CANCELLED) {
    if (
      booking.status === BookingStatus.REQUESTED ||
      booking.status === BookingStatus.ACCEPTED ||
      booking.status === BookingStatus.PAID
    ) {
      return prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });
    }

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking cannot be cancelled at this stage",
    );
  }

  // Technician accepts or denies a requested booking
  if (isTechnician && booking.status === BookingStatus.REQUESTED) {
    if (status === BookingStatus.ACCEPTED || status === BookingStatus.DENIED) {
      return prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status,
        },
      });
    }

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Requested booking can only be accepted or denied",
    );
  }

  // Technician starts a paid booking
  if (isTechnician && booking.status === BookingStatus.PAID) {
    if (status === BookingStatus.IN_PROGRESS) {
      return prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: BookingStatus.IN_PROGRESS,
        },
      });
    }

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Paid booking can only be started",
    );
  }

  // Technician completes an in-progress booking
  if (isTechnician && booking.status === BookingStatus.IN_PROGRESS) {
    if (status === BookingStatus.COMPLETED) {
      return prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: BookingStatus.COMPLETED,
        },
      });
    }

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "In-progress booking can only be completed",
    );
  }

  // No transition is allowed from terminal states
  if (
    booking.status === BookingStatus.DENIED ||
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking can no longer be updated",
    );
  }

  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Invalid booking status transition",
  );
};

const getABooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      technicianProfile: {
        select: {
          location: true,
          experience: true,
          user: {
            select: {
              name: true,
              photoUrl: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  // Only the customer who created the booking can view it
  if (booking.customerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to view this booking",
    );
  }
  return booking;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getABooking,
};
