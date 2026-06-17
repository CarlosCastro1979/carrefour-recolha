import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await prisma.collectionSession.findUnique({
    where: { id },
    include: {
      store: true,
      entries: {
        include: { product: true },
        orderBy: { product: { category: "asc" } },
      },
      photos: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.collectionSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
