import prisma from "@/prisma/prismadb";
import { formatContent } from "@/utils/formatContent";
import { NextResponse } from "next/server";
import { withPagination } from "@/lib/withPagination";

// Yardımcı Fonksiyonlar

const buildWhereClause = (params) => {
  const where = {};

  if (params.title) {
    where.title = {
      contains: params.title,
      mode: "insensitive",
    };
  }

  ["type", "ageGroup", "branch", "grade"].forEach((field) => {
    if (params[field]) {
      where[field] = params[field];
    }
  });

  ["isActive", "isPublished", "isWeeklyContent", "isExtra", "isCompleted"].forEach((field) => {
    if (params[field] !== undefined) {
      where[field] = params[field] === "true";
    }
  });

  // if (params.startDate && params.endDate) {
  //   where.createdAt = {
  //     gte: new Date(params.startDate),
  //     lte: new Date(params.endDate),
  //   };
  // }

  // for daily materials
  if (params.startDate && params.endDate) {
    where.publishDateTeacher = {
      gte: new Date(params.startDate),
      lt: new Date(params.endDate),
    };
  }

  // for archive materials
  if (params.rangeStartDate && params.rangeEndDate) {
    where.publishDateTeacher = {
      gte: new Date(params.rangeStartDate),
      lt: new Date(params.rangeEndDate),
    };
  }

  if (params.tag) {
    where.tags = {
      has: params.tag,
    };
  }

  return where;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

const calculateIsActive = (publishStudent, publishTeacher, providedValue) => {
  if (providedValue !== undefined) return providedValue;
  if (publishStudent && publishTeacher) {
    const now = new Date();
    return now >= publishStudent && now >= publishTeacher;
  }
  return false;
};

// GET Method
export async function GET(request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  try {
    const where = Object.keys(params).length === 0 ? undefined : buildWhereClause(params);

    const contents = await prisma.content.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedContents = contents.map(formatContent);

    // if pagination is required, gotta ensure the response includes metadata
    const pagiData = withPagination(request, formattedContents);

    // return paginated data
    return NextResponse.json(pagiData, { status: 200 });
  } catch (error) {
    console.error("Error fetching contents:", error);
    return NextResponse.json({ error: "Error fetching contents" }, { status: 500 });
  }
}

// POST Method
export async function POST(request) {
  try {
    const data = await request.json();
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

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

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === "string"
        ? data.tags.split(",").map((tag) => tag.trim())
        : [];

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
        isActive: calculateIsActive(publishDateStudent, publishDateTeacher, data.isActive),
        fileUrl: data.fileUrl || null,
        description: data.description || "",
        tags,
        isWeeklyContent: data.isWeeklyContent || false,
        weeklyContentStartDate: parseDate(data.weeklyContentStartDate),
        weeklyContentEndDate: parseDate(data.weeklyContentEndDate),
      },
    });

    const formattedContent = formatContent(content);

    return NextResponse.json(formattedContent, { status: 201 });
  } catch (error) {
    console.error("İçerik eklenirken hata oluştu:", error.message, error.stack);
    return NextResponse.json({ error: "İçerik eklenirken bir hata oluştu" }, { status: 500 });
  }
}
