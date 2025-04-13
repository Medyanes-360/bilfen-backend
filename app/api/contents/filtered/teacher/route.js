import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

function toStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toEndOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export async function GET() {
  try {
    const accessSettings = await prisma.accessSettings.findFirst();
    const today = toStartOfDay(new Date());

    const pastDays = accessSettings?.teacherDays ?? 0;
    const futureDays = accessSettings?.teacherDaysFuture ?? 0;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - pastDays);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + futureDays);

    const contents = await prisma.content.findMany({
      where: {
        publishDateTeacher: {
          gte: startDate,
          lte: toEndOfDay(endDate),
        },
        // isActive: true,
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
