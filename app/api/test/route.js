import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const comments = await prisma.comments.findMany();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


/* 
{
   "name": "Serkan",
    "text": "Bu harika bir film!",
    "email": "serkan@example.com",
    "movie_id": "65f8b25c24f08a7d5f123456"
    
}
*/
export async function POST(req) {
  try {
    const body = await req.json();
    const date = new Date().toISOString();

    const { name, text, email, movie_id } = body;
    const newComment = await prisma.comments.create({
      data: { name, text, email, date, movie_id },
    });
    return NextResponse.json({ newComment }, { status: 201 });
  } catch (error) {
    console.error("Prisma MongoDB Hatası:", error); // Hata mesajını yazdır
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
