// /api/contents/filtered/student/route.js
import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessSettings = await prisma.accessSettings.findFirst();
    const now = new Date();

    const days = accessSettings?.studentDays ?? 0;
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    const contents = await prisma.content.findMany({
      where: {
        publishDateStudent: {
          gte: startDate,
          lte: now,
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