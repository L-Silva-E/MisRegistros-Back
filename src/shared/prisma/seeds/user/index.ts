import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../../../../modules/user/constants";

const prisma = new PrismaClient();

export async function seedUsers() {
  const users = [
    {
      email: "qwerty@example.com",
      username: "qwerty",
      password: "pass123",
      role: "ADMIN" as const,
    },
  ];

  for (const userData of users) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existing) {
      console.log(
        `   ⏭️  User '${userData.username}' already exists, skipping`,
      );
      continue;
    }

    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        passwordHash,
        role: userData.role,
      },
    });

    console.log(
      `   ✅ User '${user.username}' created (id: ${user.id}, role: ${user.role})`,
    );
  }
}
