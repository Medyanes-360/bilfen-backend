import { NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function GET() {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME,
            Prefix: 'uploads/',
        });

        const result = await r2.send(command);

        const files = (result.Contents || []).map((item) => {
            const key = item.Key;
            return {
                fileName: key.split('/').pop(),
                fileUrl: key,
                size: item.Size,
                lastModified: item.LastModified,
                url: `/api/file/view?fileUrl=${key}`,
            };
        });

        return NextResponse.json({ files });
    } catch (err) {
        console.error('Listeleme hatası:', err);
        return NextResponse.json({ error: 'Dosyalar listelenemedi' }, { status: 500 });
    }
}
