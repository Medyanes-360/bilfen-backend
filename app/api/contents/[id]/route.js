import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

// Belirli bir içeriği getir
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const content = await prisma.content.findUnique({
      where: { id },
    });

    if (!content) {
      return NextResponse.json({ error: "İçerik bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error("İçerik alınırken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik alınırken bir hata oluştu" }, { status: 500 });
  }
}

// İçeriği güncelle
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Tarih formatlarını düzelt
    const publishDateStudent = new Date(data.publishDateStudent);
    const publishDateTeacher = new Date(data.publishDateTeacher);

    // Etiketleri diziye dönüştür
    const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];

    await prisma.content.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        category: data.category,
        ageGroup: data.ageGroup,
        publishDateStudent,
        publishDateTeacher,
        isActive: data.isActive !== undefined ? data.isActive : true,
        fileUrl: data.fileUrl || null,
        description: data.description || "",
        tags: tags,
      },
    });

    // 204 No Content yanıtı döndür
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("İçerik güncellenirken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik güncellenirken bir hata oluştu" }, { status: 500 });
  }
}

// İçeriği sil
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.content.delete({
      where: { id },
    });

    // 204 No Content yanıtı döndür
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("İçerik silinirken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik silinirken bir hata oluştu" }, { status: 500 });
  }
}
