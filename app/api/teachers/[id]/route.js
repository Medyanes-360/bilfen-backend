import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return NextResponse.json({ message: "Öğretmen bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Öğretmen bilgileri alınırken hata:", error);
    return NextResponse.json(
      { message: "Öğretmen bilgileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return NextResponse.json({ message: "Öğretmen bulunamadı" }, { status: 404 });
    }

    if (data.tcNo && data.tcNo !== existingTeacher.tcNo) {
      const tcNoExists = await prisma.teacher.findUnique({
        where: { tcNo: data.tcNo },
      });

      if (tcNoExists) {
        return NextResponse.json(
          { message: "Bu TC Kimlik Numarası ile kayıtlı başka bir öğretmen bulunmaktadır" },
          { status: 400 }
        );
      }
    }

    const formattedData = {
      ...data,
      experience: data.experience ? parseInt(data.experience, 10) : null,
    };

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: formattedData,
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("Öğretmen güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Öğretmen güncellenirken bir hata oluştu", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return NextResponse.json({ message: "Öğretmen bulunamadı" }, { status: 404 });
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Öğretmen başarıyla silindi" }, { status: 200 });
  } catch (error) {
    console.error("Öğretmen silme hatası:", error);
    return NextResponse.json(
      { message: "Öğretmen silinirken bir hata oluştu", error: error.message },
      { status: 500 }
    );
  }
}
