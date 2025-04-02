import prisma from "@/prisma/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const body = await request.json();
    const { role } = body;

    // Şifreyi hash'le
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    let user;

    // Rol tipine göre farklı tablolara kaydet
    if (role === "TEACHER") {
      // TC No kontrolü
      const existingTeacher = await prisma.teacher.findUnique({
        where: { tcNo: body.tcNo },
      });

      if (existingTeacher) {
        return NextResponse.json(
          {
            message: "Bu TC Kimlik numarası zaten kullanılıyor",
          },
          { status: 400 }
        );
      }

      const existingTeacherByEmail = await prisma.teacher.findFirst({
        where: { email: body.email.toLowerCase() },
      });

      if (existingTeacherByEmail) {
        return NextResponse.json(
          {
            message: "Bu e-posta adresi zaten kullanılıyor",
          },
          { status: 400 }
        );
      }

      user = await prisma.teacher.create({
        data: {
          tcNo: body.tcNo,
          password: hashedPassword,
          name: body.name.toLowerCase(),
          surname: body.surname.toLowerCase(),
          email: body.email.toLowerCase(),
          branch: body.branch,
          phone: body.phone || "",
          experience: body.experience ? parseInt(body.experience) : null,
          role: "TEACHER",
          isActive: true,
        },
      });

      // Hassas bilgileri çıkar
      const { password: _, ...userWithoutPassword } = user;
      user = userWithoutPassword;
    } else if (role === "STUDENT") {
      // TC No kontrolü
      const existingStudent = await prisma.student.findUnique({
        where: { tcNo: body.tcNo },
      });

      if (existingStudent) {
        return NextResponse.json(
          {
            message: "Bu TC Kimlik numarası zaten kullanılıyor",
          },
          { status: 400 }
        );
      }

      user = await prisma.student.create({
        data: {
          tcNo: body.tcNo,
          password: hashedPassword,
          name: body.name.toLowerCase(),
          surname: body.surname.toLowerCase(),
          studentNumber: body.studentNumber,
          grade: body.grade ? parseInt(body.grade) : null,
          classroom: body.classroom ? body.classroom.toLowerCase() : null,
          parentName: body.parentName ? body.parentName.toLowerCase() : null,
          parentPhone: body.parentPhone,
          role: "STUDENT",
          isActive: true,
        },
      });

      // Hassas bilgileri çıkar
      const { password: _, ...userWithoutPassword } = user;
      user = userWithoutPassword;
    } else {
      return NextResponse.json(
        {
          message: "Geçersiz kullanıcı tipi",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `${role === "TEACHER" ? "Öğretmen" : "Öğrenci"} başarıyla oluşturuldu`,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      {
        message: "Kullanıcı oluşturulurken bir hata oluştu",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
