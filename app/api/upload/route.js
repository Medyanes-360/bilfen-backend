import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { r2 } from '@/lib/r2';


export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileExt = file.name.split('.').pop();
  const key = `uploads/${uuidv4()}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
  });

  try {
    await r2.send(command);
    const url = `${process.env.R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ status: 'success', url });
  } catch (err) {
    return NextResponse.json({ error: 'Yükleme başarısız', detail: err.message }, { status: 500 });
  }
}
