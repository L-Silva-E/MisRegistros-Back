import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Data
import dataFeatures from "./features";

export async function seedFeatures() {
  await generateFeatures();
}

async function generateFeatures() {
  console.log(" > 🌟 Features");

  for (const feature of dataFeatures.data) {
    await prisma.feature.create({
      data: feature,
    });
    console.log("  > " + feature.name);
  }
}
