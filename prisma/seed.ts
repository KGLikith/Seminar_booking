import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const depts = await Promise.all([
    prisma.department.create({
      data: {
        name: "Computer Science",
        description: "Department of Computer Science and Engineering",
      },
    }),
    prisma.department.create({
      data: {
        name: "Electronics",
        description: "Department of Electronics and Communication",
      },
    }),
    prisma.department.create({
      data: {
        name: "Mechanical",
        description: "Department of Mechanical Engineering",
      },
    }),
  ]);

  console.log("Created departments:", depts.length);

  // Create seminar halls
  const halls = await Promise.all([
    prisma.seminarHall.create({
      data: {
        name: "Main Auditorium",
        seating_capacity: 500,
        location: "Building A, Ground Floor",
        description:
          "Large auditorium with advanced audio-visual systems suitable for major events and seminars.",
        department_id: depts[0].id,
        image_url: "/placeholder.svg",
      },
    }),
    prisma.seminarHall.create({
      data: {
        name: "Tech Conference Room",
        seating_capacity: 100,
        location: "Building B, 2nd Floor",
        description:
          "Modern conference room equipped with projector and video conferencing setup.",
        department_id: depts[0].id,
        image_url: "/placeholder.svg",
      },
    }),
    prisma.seminarHall.create({
      data: {
        name: "Workshop Hall",
        seating_capacity: 75,
        location: "Building C, 1st Floor",
        description:
          "Flexible space designed for workshops and interactive learning sessions.",
        department_id: depts[1].id,
        image_url: "/placeholder.svg",
      },
    }),
  ]);

  console.log("Created halls:", halls.length);

  // Create equipment for halls
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: "Projector",
        type: "AV Equipment",
        serial_number: "PROJ-001",
        condition: "active",
        hall_id: halls[0].id,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Microphone System",
        type: "Audio",
        serial_number: "MIC-001",
        condition: "active",
        hall_id: halls[0].id,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Projector",
        type: "AV Equipment",
        serial_number: "PROJ-002",
        condition: "active",
        hall_id: halls[1].id,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Whiteboard",
        type: "Accessories",
        serial_number: "WB-001",
        condition: "active",
        hall_id: halls[1].id,
      },
    }),
  ]);

  console.log("Created equipment:", equipment.length);

  // Create hall components
  const components = await Promise.all([
    prisma.hallComponent.create({
      data: {
        name: "Ceiling Projector",
        type: "projector",
        status: "operational",
        location: "Ceiling Center",
        hall_id: halls[0].id,
        notes: "Installed 2024, working properly",
      },
    }),
    prisma.hallComponent.create({
      data: {
        name: "Wall-mounted Speaker",
        type: "speaker",
        status: "operational",
        location: "Left Wall",
        hall_id: halls[0].id,
      },
    }),
    prisma.hallComponent.create({
      data: {
        name: "Podium Microphone",
        type: "microphone",
        status: "operational",
        location: "Front Center",
        hall_id: halls[0].id,
      },
    }),
    prisma.hallComponent.create({
      data: {
        name: "AC Unit",
        type: "ac",
        status: "operational",
        location: "Back Wall",
        hall_id: halls[1].id,
        notes: "Temperature control working fine",
      },
    }),
    prisma.hallComponent.create({
      data: {
        name: "WiFi Router",
        type: "wifi_router",
        status: "operational",
        location: "Ceiling Corner",
        hall_id: halls[1].id,
      },
    }),
    prisma.hallComponent.create({
      data: {
        name: "LED Lighting System",
        type: "lighting",
        status: "operational",
        location: "Ceiling Grid",
        hall_id: halls[2].id,
      },
    }),
  ]);

  console.log("Created components:", components.length);

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
