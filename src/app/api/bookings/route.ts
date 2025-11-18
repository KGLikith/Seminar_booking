import { prisma } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where:
        profile.role === "teacher"
          ? { teacher_id: profile.id }
          : { hall: { department_id: profile.department_id } },
      include: {
        hall: { select: { name: true, seating_capacity: true, location: true } },
        teacher: { select: { name: true, email: true } },
        hod: { select: { name: true } },
      },
      orderBy: { booking_date: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      hall_id,
      booking_date,
      start_time,
      end_time,
      purpose,
      permission_letter_url,
    } = await req.json();

    const booking = await prisma.booking.create({
      data: {
        hall_id,
        booking_date: new Date(booking_date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        purpose,
        permission_letter_url,
        teacher_id: profile.id,
      },
      include: { hall: true, teacher: true },
    });

    // Create notification for HOD
    const hods = await prisma.profile.findMany({
      where: { role: "hod", department_id: profile.department_id },
    });

    for (const hod of hods) {
      await prisma.notification.create({
        data: {
          user_id: hod.id,
          title: "New Booking Request",
          message: `${profile.name} has requested a booking for ${booking.hall.name}`,
          type: "booking_request",
          related_booking_id: booking.id,
        },
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
