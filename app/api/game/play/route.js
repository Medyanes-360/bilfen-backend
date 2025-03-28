// app/api/game/play/route.js

import { r2 } from '@/lib/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

/**
 * Bir oyunun iframe URL'sini almak için GET isteğini işler.
 *
 * Bu fonksiyon, istek URL'sinden `game` parametresini alır, belirtilen bucket'ta
 * ilgili `index.html` dosyasının var olup olmadığını kontrol eder ve bulunursa
 * iframe URL'sini döner. Eğer `game` parametresi eksikse veya `index.html` dosyası
 * bulunamazsa, uygun bir hata mesajı ile yanıt verir.
 *
 * @async
 * @function GET
 * @param {Request} req - Gelen HTTP istek nesnesi.
 * @returns {Promise<Response>} iframe URL'sini veya bir hata mesajını içeren bir JSON yanıtı.
 *
 * @throws {Error} İstek veya sunucu tarafı işleminde bir sorun oluşursa hata fırlatır.
 *
 * @example
 * // Örnek istek URL'si: /api/game/play?game=games/example-game
 * const response = await GET(req);
 * // Yanıt: { iframeUrl: "/games/example-game/index.html" }
 *
 * @error {400} Eğer `game` parametresi eksikse.
 * @error {404} Eğer belirtilen bucket'ta `index.html` dosyası bulunamazsa.
 * @error {500} Eğer sunucu tarafında bir hata oluşursa.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game');
    if (!game) {
      return NextResponse.json({ error: 'game parametresi eksik' }, { status: 400 });
    }

    const prefix = game.endsWith('/') ? game : `${game}/`;

    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: prefix,
    });
    const result = await r2.send(listCommand);
    const keys = result.Contents?.map(obj => obj.Key) || [];
    const hasIndex = keys.some(key => key === `${prefix}index.html`);

    if (!hasIndex) {
      return NextResponse.json({ error: 'index.html bulunamadı' }, { status: 404 });
    }

    const slugPart = game.replace(/^games\//, '');
    const iframeUrl = `/games/${slugPart}/index.html`;
    return NextResponse.json({ iframeUrl });
  } catch (err) {
    console.error('Oyun oynatma endpointi hatası:', err);
    return NextResponse.json(
      { error: 'Sunucu hatası', detail: err.message },
      { status: 500 }
    );
  }
}
