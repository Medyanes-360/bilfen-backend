import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const existing = await prisma.accessSettings.findFirst();
  
    // Eğer yoksa, otomatik bir tane oluştur (opsiyonel)
    if (!existing) {
      const created = await prisma.accessSettings.create({
        data: { studentDays: 5, teacherDays: 7 }
      });
      return NextResponse.json(created);
    }
  
    return NextResponse.json(existing);
  }
  

export async function POST(req) {
  const body = await req.json();

  const existing = await prisma.accessSettings.findFirst();

  if (existing) {
    const updated = await prisma.accessSettings.update({
      where: { id: existing.id },
      data: {
        studentDays: body.studentDays,
        teacherDays: body.teacherDays,
      },
    });
    return NextResponse.json(updated);
  } else {
    const created = await prisma.accessSettings.create({
      data: {
        studentDays: body.studentDays,
        teacherDays: body.teacherDays,
      },
    });
    return NextResponse.json(created);
  }
}
