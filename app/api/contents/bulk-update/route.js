import { NextResponse } from "next/server";
import prisma from "@/prisma/prismadb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { contents } = body;

    //  Validasyon
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json(
        { error: "Güncellenecek içerik listesi boş veya geçersiz." },
        { status: 400 }
      );
    }

    // Tüm güncellemeleri bir transaction içerisinde yapıyoruz.
    //  Böylece bir tanesi bile hata verse hepsi geri alınır.
    const updatedContents = await prisma.$transaction(
      contents.map((item) => {
        const { id, ...data } = item;
        if (!id) {
          throw new Error("Content item missing 'id' field.");
        }

        // Prisma "update" ile kısmi güncelleme
        // 'data' içinde hangi alanlar varsa sadece onlar güncellenir.
        return prisma.content.update({
          where: { id },
          data,
        });
      })
    );

    return NextResponse.json({
      status: "success",
      data: updatedContents,
    });
  } catch (err) {
    console.error("bulk update error:", err);
    return NextResponse.json(
      { error: "Toplu güncelleme sırasında bir hata oluştu.", detail: err.message },
      { status: 500 }
    );
  }
}
