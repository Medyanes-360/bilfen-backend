import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { r2 } from '@/lib/r2';
import slugify from 'slugify';
import { getServerSession } from "next-auth";


export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  }

  const session = await getServerSession();
  if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const originalName = file.name.split('.').slice(0, -1).join('.');
  const extension = file.name.split('.').pop();
  const safeName = slugify(originalName, { lower: true, strict: true });
  const fileName = `${safeName}-${uuidv4()}.${extension}`;
  const key = `uploads/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
  });

  try {
    await r2.send(command);
    const url = key;
    return NextResponse.json({ status: 'success', url });
  } catch (err) {
    return NextResponse.json({ error: 'Yükleme başarısız', detail: err.message }, { status: 500 });
  }
}
