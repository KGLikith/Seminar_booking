import { prisma } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== "tech_staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignedHalls = await prisma.hallTechStaff.findMany({
      where: { tech_staff_id: profile.id },
      select: { hall_id: true },
    });

    const hallIds = assignedHalls.map((ah:any) => ah.hall_id);

    const equipment = await prisma.equipment.findMany({
      where: { hall_id: { in: hallIds } },
      include: { hall: { select: { name: true } }, updated_by: { select: { name: true } } },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== "tech_staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { equipment_id, condition, notes } = await req.json();

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipment_id },
    });

    if (!equipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    // Create equipment log
    await prisma.equipmentLog.create({
      data: {
        equipment_id,
        previous_condition: equipment.condition,
        new_condition: condition,
        notes,
        updated_by: profile.id,
      },
    });

    const updatedEquipment = await prisma.equipment.update({
      where: { id: equipment_id },
      data: {
        condition,
        last_updated_by: profile.id,
        last_updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedEquipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    return NextResponse.json(
      { error: "Failed to update equipment" },
      { status: 500 }
    );
  }
}
