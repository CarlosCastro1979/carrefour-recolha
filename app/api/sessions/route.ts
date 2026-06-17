import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId");
  const limit = Number(request.nextUrl.searchParams.get("limit") || "50");

  const sessions = await prisma.collectionSession.findMany({
    where: storeId ? { storeId } : undefined,
    include: {
      store: true,
      _count: { select: { entries: true, photos: true } },
    },
    orderBy: { collectedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { storeId, collector, collectedAt, notes, entries } = body;

  if (!storeId || !collector?.trim()) {
    return NextResponse.json(
      { error: "Loja e nome do recolhedor são obrigatórios" },
      { status: 400 }
    );
  }

  const session = await prisma.collectionSession.create({
    data: {
      storeId,
      collector: collector.trim(),
      collectedAt: collectedAt ? new Date(collectedAt) : new Date(),
      notes: notes?.trim() || null,
      entries: {
        create: (entries || [])
          .filter(
            (e: { productId?: string }) =>
              e.productId &&
              (e.stockFisico != null ||
                e.stockSistema != null ||
                e.preco != null)
          )
          .map(
            (e: {
              productId: string;
              stockFisico?: number | null;
              stockSistema?: number | null;
              preco?: number | null;
            }) => ({
              productId: e.productId,
              stockFisico:
                e.stockFisico != null ? Number(e.stockFisico) : null,
              stockSistema:
                e.stockSistema != null ? Number(e.stockSistema) : null,
              preco: e.preco != null ? Number(e.preco) : null,
            })
          ),
      },
    },
    include: {
      store: true,
      entries: { include: { product: true } },
      photos: true,
    },
  });

  return NextResponse.json(session, { status: 201 });
}
