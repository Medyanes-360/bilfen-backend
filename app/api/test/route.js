import {NextResponse} from "next/server"
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const comments = await prisma.comment.findMany();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req){
  try {
    const {title,description}= await req.json();
    const newComment = await prisma.comment.create({
      data:{title,description},
    })
    NextResponse.json({newComment,status:201})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}