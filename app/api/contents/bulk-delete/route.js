import { NextResponse } from "next/server";
import prisma from "@/prisma/prismadb";
import { r2 } from "@/lib/r2";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export async function POST(request) {
  try {
    const bodyText = await request.text();
    console.log("Gelen body:", bodyText);

    let parsed;
    try {
      parsed = JSON.parse(bodyText);
    } catch (jsonError) {
      return NextResponse.json(
        { error: "Geçersiz JSON formatı." },
        { status: 400 }
      );
    }

    const { ids, fileKeys } = parsed;

    const validIds = (ids || []).filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    if (!Array.isArray(validIds) || validIds.length === 0) {
      return NextResponse.json(
        { error: "Silinecek geçerli içerik bulunamadı." },
        { status: 400 }
      );
    }

    // ✅ Veritabanından içerik kayıtlarını sil
    await prisma.content.deleteMany({
      where: {
        id: {
          in: validIds,
        },
      },
    });

    // ✅ R2 üzerinde dosya silme işlemi (fileKeys gönderilmişse)
    const validKeys = (fileKeys || []).filter(
      (key) => typeof key === "string" && key.trim() !== ""
    );

    if (validKeys.length > 0) {
      const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Delete: {
          Objects: validKeys.map((key) => ({ Key: key })),
          Quiet: false,
        },
      };

      try {
        await r2.send(new DeleteObjectsCommand(params));
        console.log("R2'dan dosyalar silindi:", validKeys);
      } catch (r2Err) {
        console.error("R2 silme hatası:", r2Err);
      }
    } else {
      console.log("Silinecek geçerli dosya bulunamadı.");
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Toplu silme hatası:", error);
    return NextResponse.json(
      { error: `Toplu silme sırasında bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
}
