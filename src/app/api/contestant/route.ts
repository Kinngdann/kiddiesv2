import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const gender = formData.get("gender");
    const age = formData.get("age");
    const parent = formData.get("parent");
    const phone = formData.get("phone");
    const whatsapp = formData.get("whatsapp");
    const picture = formData.get('picture') as File | null;

    let fileName;

    if (picture) {
      const buffer = Buffer.from(await picture.arrayBuffer());

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      fileName = `${Date.now()}-${firstName}_${lastName}-${picture.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
    }


    if (!firstName || !lastName || !age || !phone || !whatsapp)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const totalContestants = await prisma.contestant.count();
    const nextId = String(totalContestants + 1).padStart(3, "0");

    const contestant = await prisma.contestant.create({
      data: {
        contestantId: nextId,
        firstName: String(firstName),
        lastName: String(lastName),
        gender: String(gender),
        age: String(age),
        picture: picture ? `uploads/${fileName}` : null,
        parent: String(parent),
        phone: String(phone),
        whatsapp: String(whatsapp)
      }
    });

    return NextResponse.json({ name: `${contestant.firstName} ${contestant.lastName}`, id: contestant.contestantId });
  } catch (error) {
    console.error("Error creating contestant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    const contestantId = formData.get("contestantId") as string | null;
    const picture = formData.get("picture") as File | null;

    if (!contestantId || !picture) {
      return NextResponse.json(
        { error: "contestantId and picture are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await picture.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${contestantId}-${picture.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const contestant = await prisma.contestant.update({
      where: {
        contestantId,
      },
      data: {
        picture: `uploads/${fileName}`,
      },
    });

    return NextResponse.json({ contestant }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update contestant picture" },
      { status: 500 }
    );
  }
}

