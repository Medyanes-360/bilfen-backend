// app/api/download/route.js
import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get("fileUrl");

        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileUrl,
        });

        const response = await r2.send(command);
        const stream = response.Body;

        const headers = new Headers();
        headers.set("Content-Type", response.ContentType || "application/octet-stream");
        headers.set("Content-Length", response.ContentLength?.toString() || "");
        headers.set("Content-Disposition", `inline; filename="${fileUrl}"`);

        return new NextResponse(stream, {
            status: 200,
            headers
        });
    } catch (err) {
        console.error("R2 error:", err.Code, "-", err.message);
        return NextResponse.json({ error: "Dosya bulunamadı", code: err.Code }, { status: 404 });
    }
}
