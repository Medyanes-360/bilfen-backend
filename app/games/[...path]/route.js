import { r2 } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { createGzip } from 'zlib';
import { Readable } from 'stream';

/**
 * "games" rotası altındaki dinamik olarak oluşturulan yollar için GET isteğini işler.
 *
 * @async
 * @function GET
 * @param {Request} _ - Gelen HTTP istek nesnesi (bu fonksiyonda kullanılmaz).
 * @param {Object} context - Rota parametrelerini içeren bağlam nesnesi.
 * @param {Object} context.params - Rota parametreleri.
 * @param {string[]} [context.params.path] - Dinamik yol segmentlerini bir dizi olarak içerir.
 * @returns {Promise<NextResponse>} İstenen dosyayı veya bir hata mesajını içeren bir yanıt nesnesi.
 *
 * @throws {Error} Depolama alanından dosya alınırken bir sorun oluşursa hata fırlatır.
 *
 * @açıklama
 * Bu fonksiyon, istekte sağlanan dinamik yola göre bir dosyayı nesne depolama alanından alır.
 * Eğer dosyanın içerik türü sıkıştırılabilir (örneğin, metin veya JSON) ise, yanıt gzip kullanılarak sıkıştırılır.
 * Yanıt, içerik türü, kodlama ve önbellekleme için uygun başlıkları içerir.
 *
 * - Sıkıştırılabilir içerik türleri şunları içerir:
 *   - text/html
 *   - text/css
 *   - application/javascript
 *   - application/json
 *   - text/plain
 *   - application/xml
 *
 * - Eğer dosya bulunamazsa veya bir hata oluşursa, bir hata mesajı içeren 404 JSON yanıtı döner.
 */
export async function GET(_, { params }) {
  const dynamicPath = params.path?.join('/') || '';
  const key = `games/${dynamicPath}`;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const result = await r2.send(command);
    const contentType = result.ContentType || 'application/octet-stream';

    const compressibleTypes = [
      'text/html',
      'text/css',
      'application/javascript',
      'application/json',
      'text/plain',
      'application/xml',
    ];

    const shouldCompress = compressibleTypes.some(t => contentType.includes(t));

    if (shouldCompress) {
      const gzip = createGzip();
      const stream = Readable.from(result.Body);
      stream.pipe(gzip);

      return new NextResponse(gzip, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Encoding': 'gzip',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse(result.Body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Proxy gzip hatası:', err);
    return NextResponse.json(
      { error: 'Dosya bulunamadı', detail: err.message },
      { status: 404 }
    );
  }
}
