import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

// İçerikleri listele
export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("İçerikler alınırken hata oluştu:", error);
    return NextResponse.json({ error: "İçerikler alınırken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni içerik ekle
export async function POST(request) {
  try {
    const data = await request.json();

    // Tarih formatlarını düzelt
    const publishDateStudent = new Date(data.publishDateStudent);
    const publishDateTeacher = new Date(data.publishDateTeacher);

    // Etiketleri diziye dönüştür
    const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];

    const content = await prisma.content.create({
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

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("İçerik eklenirken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik eklenirken bir hata oluştu" }, { status: 500 });
  }
}
