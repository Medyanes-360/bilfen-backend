import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    // endDate geçmiş ve hâlâ aktif içerikleri pasifleştir
    const result = await prisma.content.updateMany({
      where: {
        isActive: true,
        OR: [
          { endDateStudent: { lt: now } },
          { endDateTeacher: { lt: now } },
        ],
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      message: "Süresi dolan içerikler pasifleştirildi.",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Pasifleştirme sırasında hata oluştu:", error);
    return NextResponse.json(
      { error: "Pasifleştirme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
