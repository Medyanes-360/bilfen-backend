// app/api/game/upload/route.js

export const config = {
    api: { bodyParser: false }, // FormData kullanıldığı için bodyParser kapatılır.
  };
  
  import { NextResponse } from 'next/server';
  import { v4 as uuidv4 } from 'uuid';
  import slugify from 'slugify';
  import { PutObjectCommand } from '@aws-sdk/client-s3';
  import { r2 } from '@/lib/r2';
  
  /**
   * Oyun dosyalarını yüklemek için POST isteğini işler.
   *
   * @async
   * @function POST
   * @param {Request} req - Gelen HTTP istek nesnesi.
   * @returns {Promise<Response>} Yükleme durumunu belirten bir JSON yanıtı.
   *
   * @throws {Error} Yükleme işlemi sırasında bir hata oluşursa.
   *
   * @description
   * Bu fonksiyon, oyun dosyalarını içeren multipart/form-data isteğini işler.
   * Dosyaları çıkarır, ilk dosyanın yoluna dayalı olarak benzersiz bir klasör adı oluşturur
   * ve her dosyayı bir R2 bucket'ına yükler. Yüklenen dosyalar yapılandırılmış bir klasör
   * hiyerarşisinde saklanır. Eğer dosya sağlanmazsa veya bir hata oluşursa, uygun bir hata
   * yanıtı döndürülür.
   *
   * @example
   * // Örnek kullanım:
   * const response = await POST(request);
   * console.log(await response.json());
   */
  export async function POST(req) {
    try {
      const formData = await req.formData();
      const files = formData.getAll('files');
  
      if (!files || files.length === 0) {
        return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
      }
  
      const rawFolder = files[0].name.split('/')[0];
      const slug = slugify(rawFolder, { lower: true, strict: true });
      const gameId = uuidv4();
      const baseFolder = `games/${slug}-${gameId}`;
  
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const relativePath = file.name.replace(`${rawFolder}/`, '');
        const key = `${baseFolder}/${relativePath}`;
  
        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream',
          })
        );
      }
  
      return NextResponse.json({ status: 'success', gameUrl: baseFolder });
    } catch (err) {
      console.error('Yükleme hatası:', err);
      return NextResponse.json(
        { error: 'Yükleme başarısız', detail: err.message },
        { status: 500 }
      );
    }
  }
  