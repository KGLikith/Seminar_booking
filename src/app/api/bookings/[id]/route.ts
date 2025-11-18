import { prisma } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== "hod") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, rejection_reason } = await req.json();

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        hod_id: profile.id,
        approved_at: status === "approved" ? new Date() : undefined,
        rejection_reason:
          status === "rejected" ? rejection_reason : undefined,
      },
      include: { teacher: true, hall: true },
    });

    // Create notification for teacher
    await prisma.notification.create({
      data: {
        user_id: booking.teacher_id,
        title:
          status === "approved"
            ? "Booking Approved"
            : "Booking Rejected",
        message: `Your booking for ${booking.hall.name} has been ${status}${
          status === "rejected" ? ": " + rejection_reason : ""
        }`,
        type: `booking_${status}`,
        related_booking_id: booking.id,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
