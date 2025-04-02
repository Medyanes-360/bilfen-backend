import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        tcNo: true,
        name: true,
        surname: true,
        studentNumber: true,
        grade: true,
        classroom: true,
        parentName: true,
        parentPhone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          grade: "asc",
        },
        {
          classroom: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json({
      students,
      count: students.length,
    });
  } catch (error) {
    console.error("Öğrenci listesi getirme hatası:", error);
    return NextResponse.json(
      {
        message: "Öğrenciler listelenirken bir hata oluştu",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
