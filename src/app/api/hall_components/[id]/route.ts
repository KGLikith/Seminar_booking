import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { status, notes } = await request.json();

    const component = await prisma.hallComponent.findUnique({
      where: { id: params.id },
    });

    if (!component) {
      return new Response("Component not found", { status: 404 });
    }

    const previousStatus = component.status;

    const updated = await prisma.hallComponent.update({
      where: { id: params.id },
      data: {
        status,
        notes,
        last_maintenance: new Date(),
      },
    });

    // Log the maintenance action
    await prisma.componentMaintenanceLog.create({
      data: {
        component_id: params.id,
        action: `Status updated to ${status}`,
        previous_status: previousStatus,
        new_status: status,
        notes,
        performed_by: profile.id,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating component:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
