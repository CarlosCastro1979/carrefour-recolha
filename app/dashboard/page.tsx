"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronRight,
  Filter,
  Loader2,
  Store,
  Trash2,
  User,
} from "lucide-react";
import { cn, formatCurrency, formatDate, formatDateShort } from "@/lib/utils";

type StoreType = { id: string; code: string; name: string };

type SessionSummary = {
  id: string;
  collector: string;
  collectedAt: string;
  store: StoreType;
  _count: { entries: number; photos: number };
};

type SessionDetail = SessionSummary & {
  entries: {
    id: string;
    stockFisico: number | null;
    stockSistema: number | null;
    preco: number | null;
    product: {
      id: string;
      material: string;
      description: string;
      category: string;
      ean: string;
      position: number;
    };
  }[];
  photos: { id: string; filename: string; caption: string | null }[];
};

export default function DashboardPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionDetail | null>(
    null
  );
  const [filterStore, setFilterStore] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then(setStores);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = filterStore
      ? `/api/sessions?storeId=${filterStore}`
      : "/api/sessions";
    fetch(url)
      .then((r) => r.json())
      .then(setSessions)
      .finally(() => setLoading(false));
  }, [filterStore]);

  async function openSession(id: string) {
    setDetailLoading(true);
    const data = await fetch(`/api/sessions/${id}`).then((r) => r.json());
    setSelectedSession(data);
    setDetailLoading(false);
  }

  async function deleteSession(id: string) {
    if (!confirm("Eliminar esta recolha?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setSelectedSession(null);
  }

  const groupedEntries = selectedSession
    ? selectedSession.entries.reduce<
        Record<string, SessionDetail["entries"]>
      >((acc, entry) => {
        const cat = entry.product.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(entry);
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="rounded-lg p-2 text-muted hover:bg-muted/10 hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Dashboard Carrefour</h1>
            <p className="text-sm text-muted">
              Histórico de recolhas, stocks e fotos por loja
            </p>
          </div>
          <Link
            href="/mobile"
            className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white sm:block"
          >
            Abrir Mobile
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filtrar por loja
            </label>
            <select
              value={filterStore}
              onChange={(e) => {
                setFilterStore(e.target.value);
                setSelectedSession(null);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">Todas as lojas</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-semibold">Histórico de recolhas</h2>
              <p className="text-xs text-muted">{sessions.length} registos</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">
                Ainda não há recolhas registadas.
              </p>
            ) : (
              <ul className="max-h-[calc(100dvh-280px)] divide-y divide-border overflow-y-auto">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <button
                      onClick={() => openSession(session.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-muted/5",
                        selectedSession?.id === session.id && "bg-primary/5"
                      )}
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {session.store.code}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {session.store.name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                          <User className="h-3 w-3" />
                          {session.collector}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.collectedAt)}
                        </p>
                        <div className="mt-1 flex gap-2 text-[11px] text-muted">
                          <span>{session._count.entries} produtos</span>
                          <span>·</span>
                          <span>{session._count.photos} fotos</span>
                        </div>
                      </div>
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="min-h-[400px] rounded-2xl bg-card shadow-sm ring-1 ring-border">
          {detailLoading ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !selectedSession ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-6 text-center text-muted">
              <Store className="mb-4 h-12 w-12 opacity-30" />
              <p className="text-lg font-medium text-foreground">
                Selecione uma recolha
              </p>
              <p className="mt-1 max-w-sm text-sm">
                Escolha um registo no histórico para ver stocks, preços e fotos
                dos lineares.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-5">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-white">
                      {selectedSession.store.code}
                    </span>
                    <h2 className="text-xl font-bold">
                      {selectedSession.store.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedSession.collector}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDateShort(selectedSession.collectedAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteSession(selectedSession.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>

              {selectedSession.photos.length > 0 && (
                <div className="border-b border-border px-6 py-5">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <Camera className="h-4 w-4" />
                    Fotos dos lineares ({selectedSession.photos.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {selectedSession.photos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() =>
                          setPhotoModal(`/uploads/${photo.filename}`)
                        }
                        className="group aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/uploads/${photo.filename}`}
                          alt="Linear"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto px-6 py-5">
                {Object.entries(groupedEntries).map(([category, entries]) => (
                  <div key={category} className="mb-8 last:mb-0">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                      {category}
                    </h3>
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase text-muted">
                          <th className="pb-2 pr-4">Produto</th>
                          <th className="pb-2 px-2 text-center">Stock físico</th>
                          <th className="pb-2 px-2 text-center">Stock sistema</th>
                          <th className="pb-2 px-2 text-center">Diferença</th>
                          <th className="pb-2 pl-2 text-right">Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => {
                          const diff =
                            entry.stockFisico != null &&
                            entry.stockSistema != null
                              ? entry.stockFisico - entry.stockSistema
                              : null;
                          return (
                            <tr
                              key={entry.id}
                              className="border-b border-border/60 hover:bg-muted/5"
                            >
                              <td className="py-3 pr-4">
                                <p className="font-medium">
                                  {entry.product.description}
                                </p>
                                <p className="text-xs text-muted">
                                  {entry.product.material}
                                </p>
                              </td>
                              <td className="px-2 py-3 text-center font-medium">
                                {entry.stockFisico ?? "—"}
                              </td>
                              <td className="px-2 py-3 text-center">
                                {entry.stockSistema ?? "—"}
                              </td>
                              <td
                                className={cn(
                                  "px-2 py-3 text-center font-medium",
                                  diff != null &&
                                    diff !== 0 &&
                                    (diff < 0
                                      ? "text-warning"
                                      : "text-success")
                                )}
                              >
                                {diff != null
                                  ? diff > 0
                                    ? `+${diff}`
                                    : diff
                                  : "—"}
                              </td>
                              <td className="py-3 pl-2 text-right">
                                {formatCurrency(entry.preco)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {photoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPhotoModal(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoModal}
            alt="Foto ampliada"
            className="max-h-[90dvh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
