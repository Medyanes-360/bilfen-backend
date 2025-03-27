import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        tcNo: true,
        name: true,
        surname: true,
        email: true,
        branch: true,
        phone: true,
        experience: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error("Öğretmen listesi getirme hatası:", error);
    return NextResponse.json(
      {
        message: "Öğretmenler listelenirken bir hata oluştu",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
