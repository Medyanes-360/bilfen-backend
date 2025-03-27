import { NextResponse } from 'next/server';
import {
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { r2 } from '@/lib/r2'; // R2 client burada tanımlı
import slugify from 'slugify';

const MULTIPART_THRESHOLD = 10 * 1024 * 1024; // 10MB

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('file');

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  }

  const uploadTasks = files.map(async (file) => {
    if (!file || typeof file.name !== 'string') return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = file.name.split('.').slice(0, -1).join('.') || 'dosya';
    const extension = file.name.split('.').pop() || 'bin';
    const safeName = slugify(originalName, { lower: true, strict: true });
    const fileName = `${safeName}-${uuidv4()}.${extension}`;
    const key = `uploads/${fileName}`;

    let uploadId;

    try {
      if (buffer.length < MULTIPART_THRESHOLD) {
        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type || 'application/octet-stream',
        });

        await r2.send(command);
      } else {
        const create = await r2.send(new CreateMultipartUploadCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          ContentType: file.type || 'application/octet-stream',
        }));

        uploadId = create.UploadId;

        const partSize = 5 * 1024 * 1024;
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

      return {
        fileName,
        url: key,
        size: buffer.length,
      };

    } catch (err) {
      if (uploadId) {
        await r2.send(new AbortMultipartUploadCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
        }));
      }

      return { error: file.name, detail: err.message };
    }
  });

  const uploadedFiles = (await Promise.all(uploadTasks)).filter(Boolean);

  return NextResponse.json({ status: 'success', files: uploadedFiles });
}
