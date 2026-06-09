import { prisma } from "@/lib/prisma"
import { getContestConfig, stageVoteField } from "@/lib/contest-config"
import { isAdminSession } from "@/lib/admin-auth";
import { storeContestantImage } from "@/lib/image-upload";
import { Prisma } from "@/src/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server"

const publicContestantSelect = {
  contestantId: true,
  firstName: true,
  lastName: true,
  stage1vote: true,
  stage2vote: true,
  stage3vote: true,
  gender: true,
  age: true,
  picture: true,
} satisfies Prisma.ContestantSelect;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function imageUploadErrorResponse(error: unknown) {
  if (!(error instanceof Error)) return null;

  if (error.message === "INVALID_IMAGE_TYPE") {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, or WebP image." },
      { status: 400 },
    );
  }

  if (error.message === "IMAGE_TOO_LARGE") {
    return NextResponse.json(
      { error: "Image must be 5MB or smaller." },
      { status: 400 },
    );
  }

  if (error.message === "IMAGE_STORAGE_NOT_CONFIGURED") {
    return NextResponse.json(
      { error: "Image storage is not configured." },
      { status: 503 },
    );
  }

  if (error.message === "IMAGE_UPLOAD_FAILED") {
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }

  return null;
}

async function nextContestantId() {
  const existingCount = await prisma.contestant.count();

  try {
    const counter = await prisma.counter.upsert({
      where: { key: "contestant" },
      update: { value: { increment: 1 } },
      create: { key: "contestant", value: existingCount + 1 },
    });

    return String(counter.value).padStart(3, "0");
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const counter = await prisma.counter.update({
      where: { key: "contestant" },
      data: { value: { increment: 1 } },
    });

    return String(counter.value).padStart(3, "0");
  }
}

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const ranking = searchParams.get("rank");

    let contestants;

    if (ranking === "top") {
      const config = await getContestConfig();
      const field = stageVoteField(config.currentStage);

      const raw = await prisma.contestant.findMany({
        where: { disabled: false },
        select: publicContestantSelect,
        orderBy: { [field]: "desc" },
        take: 5,
      });

      contestants = raw.map((c) => ({ ...c, currentVotes: c[field] }));
    } else {
      contestants = await prisma.contestant.findMany({
        where: { disabled: false },
        select: publicContestantSelect,
      })
    }

    return NextResponse.json(contestants);

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const picture = formData.get("picture") as File | null;
    const videoUrl = formData.get("videoUrl") as string | null;

    if (!firstName || !lastName || !gender || !age || !parent || !phone || !whatsapp || !picture) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let pictureUrl: string | null = null;

    if (picture) {
      pictureUrl = await storeContestantImage(picture, "contestants");
    }

    const nextId = await nextContestantId();

    const contestant = await prisma.contestant.create({
      data: {
        contestantId: nextId,
        firstName: String(firstName),
        lastName: String(lastName),
        gender: String(gender),
        age: String(age),
        picture: pictureUrl,
        videoUrl: videoUrl || null,
        parent: String(parent),
        phone: String(phone),
        whatsapp: String(whatsapp)
      }
    });

    return NextResponse.json({ name: `${contestant.firstName} ${contestant.lastName}`, id: contestant.contestantId });
  } catch (error) {
    const uploadResponse = imageUploadErrorResponse(error);
    if (uploadResponse) return uploadResponse;

    console.error("Error creating contestant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const contestantId = formData.get("contestantId") as string | null;
    const picture = formData.get("picture") as File | null;

    if (!contestantId || !picture) {
      return NextResponse.json(
        { error: "contestantId and picture are required" },
        { status: 400 }
      );
    }

    const pictureUrl = await storeContestantImage(picture, "contestants");

    const contestant = await prisma.contestant.update({
      where: {
        contestantId,
      },
      data: {
        picture: pictureUrl,
      },
    });

    return NextResponse.json({ contestant }, { status: 200 });
  } catch (error) {
    const uploadResponse = imageUploadErrorResponse(error);
    if (uploadResponse) return uploadResponse;

    console.error(error);

    return NextResponse.json(
      { error: "Failed to update contestant picture" },
      { status: 500 }
    );
  }
}


// export async function DELETE(request: NextRequest) {
//   try {
//     const result = await prisma.contestant.updateMany({
//       where: {
//         stage1vote: {
//           lt: 300,
//         },
//       },
//       data: {
//         disabled: true,
//       },
//     });
//     return NextResponse.json(result);


//   } catch (error) {
//     console.log(error)
//   }
// }
