# FixItNow API

FixItNow is a service marketplace backend built with Express, TypeScript, Prisma, PostgreSQL, JWT authentication, and Stripe payments. Customers can browse technicians and services, request bookings, track booking status, and complete payments. Technicians can publish services, manage availability, and accept or decline booking requests.

## Important Business Rules

These rules are essential when testing the API because a technician may exist in the database without being bookable yet.

### Technician booking readiness

A technician can receive bookings only when all of the following are true:

1. The technician has completed the profile with:
   - Name
   - Photo URL
   - Phone number
   - Date of birth
   - Location
2. The technician has created at least one service.
3. The technician has created at least one availability slot.
4. The technician is not marked as being on vacation.

If any requirement is missing, creating a booking is rejected. A useful setup order for manual testing is:

1. Register a user with the `TECHNICIAN` role.
2. Complete the technician profile using `PATCH /api/profile/me`.
3. Add a service using `POST /api/services`.
4. Add an availability slot using `POST /api/technicians/me/availability`.
5. Make sure the technician is not on vacation.
6. Register or log in as a customer and create a booking.

### Booking constraints

- The booking date must be within the next 60 days.
- Booking times must use 30-minute intervals.
- The selected time must fall inside one of the technician's availability slots.
- A technician cannot have more than one active booking at the same time.
- Active booking statuses are `REQUESTED`, `ACCEPTED`, `PAID`, and `IN_PROGRESS`.
- Booking and availability times are evaluated in the `Asia/Dhaka` time zone.

### Roles

- `CUSTOMER`: browse services and technicians, create and track bookings, and make payments.
- `TECHNICIAN`: manage services and availability, and manage incoming booking requests.
- `ADMIN`: access administrative operations and view all bookings.

## Features

- User registration, login, refresh tokens, logout, and current-user lookup
- JWT-based authentication with role-based authorization
- Technician profile and availability management
- Service and technician browsing with validation and filtering support
- Booking creation, retrieval, and status updates
- Stripe checkout sessions, webhook handling, and customer payment history
- Reviews and categories
- Centralized validation and error handling
- Prisma migrations for database schema management

## Technology Stack

- Node.js and TypeScript
- Express 5
- PostgreSQL
- Prisma 7
- Zod
- JWT and bcryptjs
- Stripe
- tsup and tsx

## Prerequisites

- Node.js 20 or a compatible modern Node.js version
- npm
- PostgreSQL database
- Stripe account and API credentials for payment testing

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
PORT=5000
NODE_ENV=development
BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=replace-with-a-long-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_replace-me
STRIPE_WEBHOOK_SECRET=whsec_replace-me
FRONTEND_URL=http://localhost:3000
```

`DATABASE_URL`, both JWT secrets, both JWT expirations, `BCRYPT_SALT_ROUND`, and `STRIPE_SECRET_KEY` are required when the application starts. `STRIPE_WEBHOOK_SECRET` is required when processing Stripe webhooks.

### 3. Prepare the database

Apply the committed Prisma migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma client if needed:

```bash
npx prisma generate
```

### 4. Start the application

Development mode with automatic reload:

```bash
npm run dev
```

Build and run the production bundle:

```bash
npm run build
npm start
```

The server listens on the port configured by `PORT`.

## API Overview

All routes are prefixed with `/api` unless noted otherwise. Protected routes require the access token according to the authentication middleware used by the endpoint.

| Area           | Main endpoints                                                                                         | Purpose                                          |
| -------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Authentication | `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh-token`, `/api/auth/me`, `/api/auth/logout` | Account and token management                     |
| Profiles       | `/api/profile/me`                                                                                      | View and update the signed-in user's profile     |
| Technicians    | `/api/technicians`, `/api/technicians/:id`                                                             | Browse technician profiles                       |
| Availability   | `/api/technicians/me/availability`                                                                     | Create, view, and update technician availability |
| Services       | `/api/services`                                                                                        | Create and browse services                       |
| Bookings       | `/api/bookings`, `/api/bookings/:id`, `/api/bookings/:id/status`                                       | Create, view, and update bookings                |
| Payments       | `/api/payments/create-checkout-session`, `/api/payments/`                                              | Stripe checkout and payment history              |
| Stripe webhook | `/api/payments/webhook`                                                                                | Receive Stripe payment events                    |
| Categories     | `/api/categories`                                                                                      | Manage or browse service categories              |
| Reviews        | `/api/reviews`                                                                                         | Manage booking reviews                           |
| Admin          | `/api/admin/...`                                                                                       | Administrative operations                        |

The exact request body, query, and parameter requirements are defined by the Zod validation schemas in each module's `*.validation.ts` file.

## Payment Flow

1. A customer creates a booking.
2. The customer uses `POST /api/payments/create-checkout-session` with the booking identifier.
3. Stripe processes the checkout.
4. Stripe sends the event to `POST /api/payments/webhook`.
5. The webhook updates the payment and booking state in the database.

For local Stripe testing, expose the webhook endpoint with the Stripe CLI and place the generated signing secret in `STRIPE_WEBHOOK_SECRET`.

## Project Structure

```text
src/
  app.ts                 Express application and route registration
  server.ts              Database connection and HTTP server startup
  config/                Environment configuration
  middlewares/           Authentication, authorization, and validation
  modules/               Feature modules and controllers/services/routes
  errors/                Application and Prisma error handling
  lib/                   Prisma and Stripe clients
  utils/                 Shared helpers
prisma/
  schema/                Prisma schema split into models and enums
  migrations/            Versioned database migrations
```

## Available Scripts

| Command                     | Description                                   |
| --------------------------- | --------------------------------------------- |
| `npm run dev`               | Start the development server with `tsx watch` |
| `npm run build`             | Bundle the server into `dist/` with tsup      |
| `npm start`                 | Run the compiled server                       |
| `npx prisma migrate deploy` | Apply committed migrations                    |
| `npx prisma generate`       | Generate the Prisma client                    |

## Error Handling

The API validates request data with Zod and returns errors through a centralized error handler. Common failure cases during testing include:

- `401 Unauthorized`: missing or invalid authentication token
- `403 Forbidden`: authenticated user does not have the required role
- `400 Bad Request`: invalid input or a business rule violation
- `404 Not Found`: requested resource does not exist
- `409 Conflict`: a booking time is already occupied

## Testing Notes

There is currently no automated test script configured in `package.json`. For a complete manual verification, test the role-specific workflow above and include both successful and rejected booking attempts, especially an incomplete technician profile, missing service, missing availability, vacation mode, unavailable time, and an already-booked time.

## License

This project is an educational bootcamp assignment.
