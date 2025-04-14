// /api/contents/filtered/student/route.js
import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessSettings = await prisma.accessSettings.findFirst();

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Bugünün sonu

    const startDate = new Date();
    startDate.setDate(today.getDate() - (accessSettings?.studentDays ?? 0));
    startDate.setHours(0, 0, 0, 0); // Başlangıç günü: 00:00

    console.log("startDate:", startDate.toISOString());
    console.log("today:", today.toISOString());

    const contents = await prisma.content.findMany({
      where: {
        publishDateStudent: {
          gte: startDate,
          lte: today,
        },
        isActive: true,
        isPublished: true,
      },
      orderBy: {
        publishDateStudent: "desc",
      },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Öğrenci içerikleri alınamadı:", error);
    return NextResponse.json({ error: "İçerikler getirilemedi" }, { status: 500 });
  }
}
