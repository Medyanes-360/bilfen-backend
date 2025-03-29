import { NextResponse } from "next/server";
import {
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { r2 } from "@/lib/r2";
import slugify from "slugify";
import prisma from "@/prisma/prismadb";

const MULTIPART_THRESHOLD = 10 * 1024 * 1024; // 10 MB

export async function POST(req) {
  try {
    // FormData al
    const formData = await req.formData();
    // "files" ismindeki alanı çoklu dosya şeklinde çekme
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Yüklenecek dosya bulunamadı" },
        { status: 400 }
      );
    }

    // Başarılı yüklenen içerikleri tutmak için dizi oluşturma
    const createdContents = [];

    //Her dosya için tek tek yükleme işlemi
    for (const file of files) {
      // file.name yoksa atla
      if (!file || typeof file.name !== "string") {
        continue;
      }

      // Dosyayı buffer'a dönüştürme
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Orijinal dosya adını slugify ile güvenli hale getirme
      const originalName = file?.name?.split('.')?.slice(0, -1)?.join('.') || 'dosya';
      const extension = file?.name?.split('.')?.pop() || 'bin';
      const safeName = slugify(originalName, { lower: true, strict: true });
      const fileName = `${safeName}-${uuidv4()}.${extension}`;
      const key = `uploads/${fileName}`;

      let uploadId;

      try {
        // 10 MB altında tek parça yükleme
        if (buffer.length < MULTIPART_THRESHOLD) {
          const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream',
          });
          await r2.send(command);
        } 
        // 10 MB üstünde multipart upload
        else {
          const create = await r2.send(new CreateMultipartUploadCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: file.type || 'application/octet-stream',
          }));
          uploadId = create.UploadId;

          const partSize = 5 * 1024 * 1024; // 5 MB
          const partCount = Math.ceil(buffer.length / partSize);
          const parts = [];

          for (let i = 0; i < partCount; i++) {
            const start = i * partSize;
            const end = Math.min(start + partSize, buffer.length);
            const partBuffer = buffer.subarray(start, end);

            const uploadPart = await r2.send(new UploadPartCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
              UploadId: uploadId,
              PartNumber: i + 1,
              Body: partBuffer,
            }));
            parts.push({
              ETag: uploadPart.ETag,
              PartNumber: i + 1,
            });
          }

          await r2.send(new CompleteMultipartUploadCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
          }));
        }

        // Yükleme başarılıysa veritabanına “taslak” Content kaydı oluşturma
        const newContent = await prisma.content.create({
          data: {
            title: safeName,             // Taslak başlık
            type: "",                   // İçerik türü henüz belli değil
            branch: "DRAFT",            // Örnek olarak varsayılan bir branş
            ageGroup: "",               // Henüz yaş grubu belirlenmedi
            fileUrl: key,               // Yüklenen dosyanın R2 üzerindeki path’i
            description: "",            // Açıklama boş
            tags: [],                   // Etiketler boş
          },
        });

        createdContents.push(newContent);

      } catch (err) {
        // Multipart sırasında hata olursa abort etme
        if (uploadId) {
          await r2.send(new AbortMultipartUploadCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
          }));
        }
        console.error("Dosya yükleme hatası:", err);
      }
    }

    return NextResponse.json({ status: "success", data: createdContents });
  } catch (err) {
    console.error("Toplu yükleme hatası:", err);
    return NextResponse.json(
      { error: "Toplu yükleme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
