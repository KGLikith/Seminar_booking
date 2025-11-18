import { prisma } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fullProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        department: { select: { name: true } },
        user: { select: { email: true } },
      },
    });

    return NextResponse.json(fullProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
