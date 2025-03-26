import { NextResponse } from "next/server";
import prisma from "@/prisma/prismadb";
import { r2 } from "@/lib/r2";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export async function POST(request) {
  try {
    // Beklenen JSON body örneği:
    // {
    //   "ids": ["abc123", "def456", ...],
    //   "fileKeys": ["uploads/dosya1.pdf", "uploads/dosya2.pdf", ...]  // opsiyonel
    // }
    const { ids, fileKeys } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Silinecek içerik ID listesi geçersiz veya boş." },
        { status: 400 }
      );
    }
    
    // Veritabanından içerik kayıtlarını silme
    await prisma.content.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    
    // R2 üzerinde dosya silme işlemi (fileKeys gönderilmişse)
    if (fileKeys && Array.isArray(fileKeys) && fileKeys.length > 0) {
      // Geçersiz değerleri ayıkla (boş string, null, undefined)
      const validKeys = fileKeys.filter(
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
        
        await r2.send(new DeleteObjectsCommand(params));
      }
    }
    
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Toplu silme hatası:", error);
    return NextResponse.json(
      { error: "Toplu silme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

