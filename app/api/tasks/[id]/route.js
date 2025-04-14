import prisma from "@/prisma/prismadb";
import { NextResponse } from "next/server";

// Geçerli seçenekler
const VALID_PRIORITIES = ["Düşük", "Orta", "Yüksek"];
const VALID_STATUSES = ["Beklemede", "Devam Ediyor", "Tamamlandı"];

export async function GET(request, context) {
  try {
    const { id } = context.params;

    const task = await prisma.task.findFirst({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Görev getirilirken hata:", error);
    return NextResponse.json(
      { error: "Görev getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // .../tasks/123 → "123"

    const data = await request.json();

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      return NextResponse.json(
        { error: "Geçersiz öncelik değeri" },
        { status: 400 }
      );
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      return NextResponse.json(
        { error: "Geçersiz durum değeri" },
        { status: 400 }
      );
    }

    await prisma.task.update({
      where: { id },
      data,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Görev güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Görev güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}


export async function DELETE(request, context) {
  try {
    const { id } = context.params;

    await prisma.task.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Görev silinirken hata:", error);
    return NextResponse.json(
      { error: "Görev silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
