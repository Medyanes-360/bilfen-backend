// lib/auth.js
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/pages/api/auth/[...nextauth]";

export async function requireAdmin(req, res) {
  const session = await getServerSession(req, res, OPTIONS);

  if (!session) {
    res.status(401).json({ message: "Oturum bulunamadı" });
    return null;
  }

  return session;
}

/* Örnek Kullanım
export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  // Buraya sadece admin erişebilir
  res.status(200).json({ message: "Bu veri sadece admin içindir." });
}

*/