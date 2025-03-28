import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json({ message: "Öğrenci bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Öğrenci bilgileri alınırken hata:", error);
    return NextResponse.json(
      { message: "Öğrenci bilgileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return NextResponse.json({ message: "Öğrenci bulunamadı" }, { status: 404 });
    }

    // TC Kimlik No değiştirilmişse, benzersiz olup olmadığını kontrol et
    if (data.tcNo && data.tcNo !== existingStudent.tcNo) {
      const tcNoExists = await prisma.student.findUnique({
        where: { tcNo: data.tcNo },
      });

      if (tcNoExists) {
        return NextResponse.json(
          { message: "Bu TC Kimlik Numarası ile kayıtlı başka bir öğrenci bulunmaktadır" },
          { status: 400 }
        );
      }
    }

    const formattedData = {
      ...data,
      grade: data.grade ? parseInt(data.grade, 10) : null,
      studentNumber: data.studentNumber || null,
    };

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: formattedData,
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Öğrenci güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Öğrenci güncellenirken bir hata oluştu", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json({ message: "Öğrenci bulunamadı" }, { status: 404 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Öğrenci başarıyla silindi" }, { status: 200 });
  } catch (error) {
    console.error("Öğrenci silme hatası:", error);
    return NextResponse.json(
      { message: "Öğrenci silinirken bir hata oluştu", error: error.message },
      { status: 500 }
    );
  }
}
