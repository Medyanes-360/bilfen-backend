import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(req) {
       //const session = await requireAdmin()
      //if (session instanceof Response) return session;
    try {
        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get("fileUrl");
        const asAttachment = searchParams.get("download") === "true";

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `uploads/${fileUrl.split('/').pop()}`,
        });

        const response = await r2.send(command);
        const stream = response.Body;

        const headers = new Headers();
        headers.set("Content-Type", response.ContentType || "application/octet-stream");
        headers.set("Content-Length", response.ContentLength?.toString() || "");

        const dispositionType = asAttachment ? "attachment" : "inline";
        headers.set("Content-Disposition", `${dispositionType}; filename="${fileUrl}"`);

        return new NextResponse(stream, { status: 200, headers });
    } catch (err) {
        return NextResponse.json({ error: "Dosya bulunamadı", detail: err.message }, { status: 404 });
    }
}
