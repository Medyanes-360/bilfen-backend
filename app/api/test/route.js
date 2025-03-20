import {NextResponse} from "next/server"
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const comments = await prisma.comments.findMany();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req){
  try {
    const body= await req.json();
    const {title,description} = body;
    const newComment = await prisma.comments.create({
      data:{title,description},
    })
    return NextResponse.json({ newComment }, { status: 201 });
  } catch (error) {
    console.error("Prisma MongoDB Hatası:", error); // Hata mesajını yazdır
    return NextResponse.json({ error: error.message }, { status: 500 });  }

}