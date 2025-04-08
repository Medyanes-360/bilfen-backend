import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

// Geçerli seçenekler
const VALID_PRIORITIES = ["Düşük", "Orta", "Yüksek"];
const VALID_STATUSES = ["Beklemede", "Devam Ediyor", "Tamamlandı"];

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Görevler getirilirken hata:", error);
    return NextResponse.json({ error: "Görevler getirilirken bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Zorunlu alanları kontrol et
    if (!data.title || !data.dueDate) {
      return NextResponse.json(
        { error: "Başlık ve son tarih alanları zorunludur" },
        { status: 400 }
      );
    }

    // Öncelik ve durum değerlerini doğrula
    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      return NextResponse.json(
        { error: "Geçersiz öncelik değeri. Geçerli değerler: Düşük, Orta, Yüksek" },
        { status: 400 }
      );
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      return NextResponse.json(
        { error: "Geçersiz durum değeri. Geçerli değerler: Beklemede, Devam Ediyor, Tamamlandı" },
        { status: 400 }
      );
    }

    // Varsayılan değerleri ayarla
    const taskData = {
      ...data,
      priority: data.priority || "Orta",
      status: data.status || "Beklemede",
      isCompleted: typeof data.isCompleted === "boolean" ? data.isCompleted : false,
    };

    const task = await prisma.task.create({
      data: taskData,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Görev oluşturulurken hata:", error);
    return NextResponse.json({ error: "Görev oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
