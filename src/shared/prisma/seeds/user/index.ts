import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../../../../modules/user/constants";

const prisma = new PrismaClient();

export async function seedUsers() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminUsername = process.env.SEED_ADMIN_USERNAME;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminUsername || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL, SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables are required to run seeds",
    );
  }

  const users = [
    {
      email: adminEmail,
      username: adminUsername,
      password: adminPassword,
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
