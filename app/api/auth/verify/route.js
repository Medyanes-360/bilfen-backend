import { NextResponse } from "next/server";
import prisma from "@/prisma/prismadb";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { tc, password } = await request.json();

    //Ogretmen tablosunda arama yapılır
    let user = await prisma.teacher.findUnique({
      where: { tcNo: tc },
    });

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return NextResponse.json({
          id: user.id,
          name: user.name,
          tc: user.tcNo,
          role: "teacher",
          branch: user.branch,
        });
      }
    }

    //Ogretmen yoksa ogrenci tablosunda arama yapılır
    user = await prisma.student.findUnique({
      where: { tcNo: tc },
    });

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return NextResponse.json({
          id: user.id,
          name: user.name,
          tc: user.tcNo,
          role: "student",
          grade: user.grade,
        });
      }
    }
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
