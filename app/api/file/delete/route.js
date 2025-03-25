import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req) {
          //const session = await requireAdmin()
      //if (session instanceof Response) return session;
    try {
        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get("fileUrl");

        if (!fileUrl)
            return NextResponse.json({ error: "Geçerli bir dosya değil." }, { status: 400 });

      

        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `uploads/${fileUrl}`,
        });

        await r2.send(command);

        return NextResponse.json({ status: "success" });
    } catch (err) {
        console.error("Silme hatası:", {
            code: err.Code,
            message: err.message,
            key: err.Key,
        });

        return NextResponse.json(
            {
                error: "Dosya silinemedi",
                code: err.Code,
                message: err.message,
            },
            { status: 500 }
        );
    }
}
