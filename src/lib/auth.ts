import { auth } from "@clerk/nextjs/server";
import { prisma } from "./db";

export async function getUser() {
  const { userId } = await auth();
  return userId;
}

export async function getCurrentUserProfile() {
  const userId = await getUser();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true },
  });

  return user?.profile || null;
}

export async function getUserRole() {
  const profile = await getCurrentUserProfile();
  return profile?.role || null;
}
