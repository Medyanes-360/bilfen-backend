import { NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';

export async function GET() {
    const session = await getServerSession();
    if (!session)
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

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
                url: `/api/file/view?fileUrl=${key.split('/').pop()}`,
            };
        });

        return NextResponse.json({ files });
    } catch (err) {
        console.error('Listeleme hatası:', err);
        return NextResponse.json({ error: 'Dosyalar listelenemedi' }, { status: 500 });
    }
}
