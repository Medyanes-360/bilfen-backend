import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Tarihleri formatla
    const formattedContents = contents.map((content) => ({
      ...content,
      publishDateStudent: content.publishDateStudent?.toISOString().split("T")[0],
      publishDateTeacher: content.publishDateTeacher?.toISOString().split("T")[0],
      endDateStudent: content.endDateStudent?.toISOString().split("T")[0],
      endDateTeacher: content.endDateTeacher?.toISOString().split("T")[0],
    }));

    return NextResponse.json(formattedContents);
  } catch (error) {
    console.error("İçerikler alınırken hata oluştu:", error);
    return NextResponse.json({ error: "İçerikler alınırken bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 gün milisaniye

    // tarih dönüşümü
    const parseDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    };

    const publishDateStudent = parseDate(data.publishDateStudent);
    const publishDateTeacher = parseDate(data.publishDateTeacher);

    const endDateStudent = data.endDateStudent
      ? parseDate(data.endDateStudent)
      : publishDateStudent
        ? new Date(publishDateStudent.getTime() + oneWeek)
        : null;

    const endDateTeacher = data.endDateTeacher
      ? parseDate(data.endDateTeacher)
      : publishDateTeacher
        ? new Date(publishDateTeacher.getTime() + oneWeek)
        : null;


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
        title: data.title || null,
        type: data.type || null,
        branch: data.branch || null,
        ageGroup: data.ageGroup || null,
        publishDateStudent,
        publishDateTeacher,
        endDateStudent,
        endDateTeacher,
        isActive:
          data.isActive !== undefined
            ? data.isActive
            : publishDateStudent && publishDateTeacher
              ? now >= publishDateStudent && now >= publishDateTeacher
              : false,
        fileUrl: data.fileUrl || null,
        description: data.description || "",
        tags,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("İçerik eklenirken hata oluştu:", error.message, error.stack);
    return NextResponse.json({ error: "İçerik eklenirken bir hata oluştu" }, { status: 500 });
  }
}

