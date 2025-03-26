// lib/auth.js
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getServerSession(OPTIONS);

  if (!session) {
    return NextResponse.json({ message: "Oturum bulunamadı" }, { status: 401 });
  }

  
  return session;
}

/* Örnek Kullanım
export async function GET() {
  const session = await requireAdmin();
  if (session instanceof Response) return session; // 401 veya 403 dönüyorsa direkt çık

  // Admin işlemleri
  return NextResponse.json({ message: "Admin verisi" });
}

*/
