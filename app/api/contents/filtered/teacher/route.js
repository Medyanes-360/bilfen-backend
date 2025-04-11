// /api/contents/filtered/teacher/route.js
import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessSettings = await prisma.accessSettings.findFirst();
    const now = new Date();

    const days = accessSettings?.teacherDays ?? 0;
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    const contents = await prisma.content.findMany({
      where: {
        publishDateTeacher: {
          gte: startDate,
          lte: now,
        },
        isActive: true,
        isPublished: true,
      },
      orderBy: {
        publishDateTeacher: "desc",
      },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Öğretmen içerikleri alınamadı:", error);
    return NextResponse.json({ error: "İçerikler getirilemedi" }, { status: 500 });
  }
}
