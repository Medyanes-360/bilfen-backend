import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req) {
    try {
        const contents = await prisma.content.findMany();
   
        return NextResponse.json(
            { message: "Veriler başarıyla getirildi", data: contents },
            { status: 200 }
            
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        let { contents } = body;
        if (!contents) {
            return NextResponse.json(
                { status: "error", error: "İçerik bilgisi eksik!" },
                { status: 400 }
            );
        }

        try {
            if (!Array.isArray(contents)) {
                contents = [contents];
            }
        } catch (error) {
            return NextResponse.json(
                { status: "error", error: "İçerikler işlenirken hata oluştu." },
                { status: 400 }
            );
        }

        try {
            for (const content of contents) {
                const { title, type, fileUrl, gameUrl } = content;

                if (!title || !type) {
                    return NextResponse.json(
                        { status: "error", error: "Her içerik için başlık ve içerik türü zorunludur." },
                        { status: 400 }
                    );
                }

                if (type === "VIDEO" || type === "DOCUMENT") {
                    if (!fileUrl) {
                        return NextResponse.json(
                            { status: "error", error: "Video veya doküman için dosya URL'si zorunludur." },
                            { status: 400 }
                        );
                    }
                } else if (type === "GAME") {
                    if (!gameUrl) {
                        return NextResponse.json(
                            { status: "error", error: "Oyun eklemek için oyun URL'si zorunludur." },
                            { status: 400 }
                        );
                    }
                }
            }
        } catch (error) {
            return NextResponse.json(
                { status: "error", error: "İçerik doğrulama sırasında bir hata oluştu." },
                { status: 400 }
            );
        }

        let formattedContents;
        try {
            formattedContents = contents.map(content => {
                let studentDate = content.publishDateForStudent ? new Date(content.publishDateForStudent) : null;
                let teacherDate = studentDate ? new Date(studentDate) : null;
                
                if (teacherDate) teacherDate.setDate(teacherDate.getDate() - 7);
        
                return {
                    ...content,
                    
                    publishDateForStudent: studentDate || null,  
                    publishDateForTeacher: teacherDate || null, 
                    isArchived: false
                };
            });
        } catch (error) {
            return NextResponse.json(
                { status: "error", error: "Yayınlanma tarihleri belirlenirken bir hata oluştu." },
                { status: 400 }
            );
        }
        

        let newContents;
        try {
           
            if (formattedContents.length === 1) {
                newContents = await prisma.content.create({ data: formattedContents[0] });
            } else {
                newContents = await prisma.content.createMany({ data: formattedContents });
            }

        } catch (error) {
            return NextResponse.json(
                { status: "error", error: error.message || "İçerikler eklenirken bir hata oluştu." },
                { status: 500 }
            );
        }

     
        if (!newContents || newContents.error) {
            return NextResponse.json(
                { status: "error", error: newContents.error || "İçerikler eklenirken bir hata oluştu." },
                { status: 500 }
            );
        }

   
        return NextResponse.json(
            {
                status: "success",
                message: formattedContents.length === 1 ? "İçerik başarıyla eklendi." : "İçerikler başarıyla eklendi.",
                contents: newContents
            },
            { status: 201 }
        );
    } catch (error) {
   
        return NextResponse.json(
            { status: "error", error: error.message || "Beklenmedik bir hata oluştu." },
            { status: 500 }
        );
    }
}
