import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
    });

    if (!profile || profile.role !== "tech_staff") {
      return new Response("Forbidden", { status: 403 });
    }

    const components = await prisma.hallComponent.findMany({
      include: {
        hall: true,
      },
    });

    return Response.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
