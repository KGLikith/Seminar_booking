import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const hall = await prisma.seminarHall.findUnique({
      where: { id: params.id },
      include: {
        equipment: true,
        components: true,
        bookings: {
          where: { status: "approved" },
          take: 5,
        },
      },
    });

    if (!hall) {
      return new Response("Hall not found", { status: 404 });
    }

    return Response.json(hall);
  } catch (error) {
    console.error("Error fetching hall:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
