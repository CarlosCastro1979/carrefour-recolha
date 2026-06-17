import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedPhoto } from "@/lib/upload";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await prisma.collectionSession.findUnique({
    where: { id },
  });

  if (!session) {
    return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("photo") as File | null;
  const caption = (formData.get("caption") as string) || null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Foto obrigatória" }, { status: 400 });
  }

  const filename = await saveUploadedPhoto(file, id);

  const photo = await prisma.shelfPhoto.create({
    data: {
      sessionId: id,
      filename,
      caption,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const photos = await prisma.shelfPhoto.findMany({
    where: { sessionId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(photos);
}
