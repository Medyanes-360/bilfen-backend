import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

// GET: Ayarlar varsa getir, yoksa default oluştur
export async function GET() {
  const existing = await prisma.accessSettings.findFirst();

  if (!existing) {
    const created = await prisma.accessSettings.create({
      data: {
        studentDays: 5,
        teacherDays: 7,
        teacherDaysFuture: 0,  
      },
    });
    return NextResponse.json(created);
  }

  return NextResponse.json(existing);
}

// POST: Güncelle veya oluştur
export async function POST(req) {
  const body = await req.json();

  const existing = await prisma.accessSettings.findFirst();

  if (existing) {
    const updated = await prisma.accessSettings.update({
      where: { id: existing.id },
      data: {
        studentDays: body.studentDays,
        teacherDays: body.teacherDays,
        teacherDaysFuture: body.teacherDaysFuture ?? 0, 
      },
    });
    return NextResponse.json(updated);
  } else {
    const created = await prisma.accessSettings.create({
      data: {
        studentDays: body.studentDays,
        teacherDays: body.teacherDays,
        teacherDaysFuture: body.teacherDaysFuture ?? 0, 
      },
    });
    return NextResponse.json(created);
  }
}
