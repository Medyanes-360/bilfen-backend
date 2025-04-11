import prisma from "@/prisma/prismadb";
import { formatContent } from "@/utils/formatContent";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const content = await prisma.content.findUnique({
      where: { id },
    });

    if (!content) {
      return NextResponse.json({ error: "İçerik bulunamadı" }, { status: 404 });
    }

    const formattedContents = formatContent(content);
    
    return NextResponse.json(formattedContents);
  } catch (error) {
    console.error("İçerik alınırken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik alınırken bir hata oluştu" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();


    // publishDateStudent varsa Date'e çevir, yoksa dokunma
    const publishDateStudent = data.publishDateStudent
      ? new Date(data.publishDateStudent)
      : undefined;

    const publishDateTeacher = data.publishDateTeacher
      ? new Date(data.publishDateTeacher)
      : undefined;

      const endDateStudent = data.endDateStudent
      ? new Date(data.publishDateStudent)
      : undefined;

    const endDateTeacher = data.endDateTeacher
      ? new Date(data.publishDateTeacher)
      : undefined;


  const date = {
    ...(publishDateStudent && { publishDateStudent }),
    ...(publishDateTeacher && { publishDateTeacher }),
    ...(endDateStudent && { endDateStudent }),
    ...(endDateTeacher && {endDateTeacher}),
  }

    // Etiketleri diziye dönüştür
    let tags = [];
    if (data.tags) {
      tags = Array.isArray(data.tags)
        ? data.tags
        : data.tags.split(",").map((tag) => tag.trim());
    }

    // Güncellenecek alanları topluca yönet
    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.type && { type: data.type }),
      ...(data.branch && { branch: data.branch }),
      ...(data.ageGroup && { ageGroup: data.ageGroup }),
      
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.tags && { tags }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
    };

    await prisma.content.update({
      where: { id },
      data: updateData,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("İçerik güncellenirken hata oluştu:", error);
    return NextResponse.json(
      { error: "İçerik güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.content.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("İçerik silinirken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik silinirken bir hata oluştu" }, { status: 500 });
  }
}
// /api/contents/[id]/route.js
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updated = await prisma.content.update({
      where: { id },
      data: {
        fileUrl: data.fileUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH hatası:", error);
    return NextResponse.json({ error: "Dosya güncellenemedi" }, { status: 500 });
  }
}

