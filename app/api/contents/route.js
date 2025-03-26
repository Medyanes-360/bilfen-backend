import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

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

export async function POST(request) {
  //const session = await requireAdmin()
  //if (session instanceof Response) return session;
  try {
    const data = await request.json();

    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 gün milisaniye

    // Yayın tarihlerini oluştur
    const publishDateStudent = new Date(data.publishDateStudent);
    const publishDateTeacher = new Date(data.publishDateTeacher);

    // Bitiş tarihlerini oluştur
    const endDateStudent = data.endDateStudent
      ? new Date(data.endDateStudent)
      : new Date(publishDateStudent.getTime() + oneWeek);

    const endDateTeacher = data.endDateTeacher
      ? new Date(data.endDateTeacher)
      : new Date(publishDateTeacher.getTime() + oneWeek);

    let tags = [];
    if (data.tags) {
      if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (typeof data.tags === "string") {
        tags = data.tags.split(",").map((tag) => tag.trim());
      }
    }

    const content = await prisma.content.create({
      data: {
        title: data.title,
        type: data.type,
        category: data.category,
        ageGroup: data.ageGroup,
        publishDateStudent,
        publishDateTeacher,
        endDateStudent,
        endDateTeacher,
        isActive:
          data.isActive !== undefined
            ? data.isActive
            : now >= publishDateStudent && now >= publishDateTeacher,
        fileUrl: data.fileUrl || null,
        description: data.description || "",
        tags,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("İçerik eklenirken hata oluştu:", error);
    return NextResponse.json({ error: "İçerik eklenirken bir hata oluştu" }, { status: 500 });
  }
}
