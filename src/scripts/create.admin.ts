import bcrypt from "bcryptjs";
import { Role } from "../../prisma/generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  await prisma.user.create({
    data: {
      name: "Yin",
      email: "yin@example.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin created.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
