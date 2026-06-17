"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Loader2,
  Save,
  Store,
  User,
  X,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type StoreType = { id: string; code: string; name: string };
type Product = {
  id: string;
  position: number;
  material: string;
  description: string;
  category: string;
  ean: string;
};

type EntryDraft = {
  stockFisico: string;
  stockSistema: string;
  preco: string;
};

export default function MobilePage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [storeId, setStoreId] = useState("");
  const [collector, setCollector] = useState("");
  const [collectedAt, setCollectedAt] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [entries, setEntries] = useState<Record<string, EntryDraft>>({});
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [step, setStep] = useState<"setup" | "data" | "photos">("setup");

  useEffect(() => {
    Promise.all([
      fetch("/api/stores").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([storesData, productsData]) => {
        setStores(storesData);
        setProducts(productsData);
        const initial: Record<string, EntryDraft> = {};
        productsData.forEach((p: Product) => {
          initial[p.id] = { stockFisico: "", stockSistema: "", preco: "" };
        });
        setEntries(initial);
        if (productsData.length > 0) {
          setExpandedCategory(productsData[0].category);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, Product[]>();
    products.forEach((p) => {
      const list = map.get(p.category) || [];
      list.push(p);
      map.set(p.category, list);
    });
    return Array.from(map.entries());
  }, [products]);

  const filledCount = useMemo(
    () =>
      Object.values(entries).filter(
        (e) => e.stockFisico || e.stockSistema || e.preco
      ).length,
    [entries]
  );

  const selectedStore = stores.find((s) => s.id === storeId);

  function updateEntry(productId: string, field: keyof EntryDraft, value: string) {
    setEntries((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  }

  function handlePhotoCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      setPhotos((prev) => [
        ...prev,
        { file, preview: URL.createObjectURL(file) },
      ]);
    });
    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit() {
    if (!storeId || !collector.trim()) {
      setError("Selecione a loja e indique o seu nome.");
      setStep("setup");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        storeId,
        collector: collector.trim(),
        collectedAt,
        entries: Object.entries(entries)
          .filter(([, e]) => e.stockFisico || e.stockSistema || e.preco)
          .map(([productId, e]) => ({
            productId,
            stockFisico: e.stockFisico ? Number(e.stockFisico) : null,
            stockSistema: e.stockSistema ? Number(e.stockSistema) : null,
            preco: e.preco ? Number(e.preco.replace(",", ".")) : null,
          })),
      };

      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao guardar");
      }

      const session = await res.json();

      for (const photo of photos) {
        const formData = new FormData();
        formData.append("photo", photo.file);
        await fetch(`/api/sessions/${session.id}/photos`, {
          method: "POST",
          body: formData,
        });
      }

      setSaved(true);
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotos([]);
      setEntries((prev) => {
        const cleared: Record<string, EntryDraft> = {};
        Object.keys(prev).forEach((k) => {
          cleared[k] = { stockFisico: "", stockSistema: "", preco: "" };
        });
        return cleared;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-green-50 px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-success">Dados guardados!</h1>
        <p className="mt-2 text-muted">
          Recolha de {selectedStore?.name} registada com sucesso.
        </p>
        <button
          onClick={() => {
            setSaved(false);
            setStep("setup");
          }}
          className="mt-8 rounded-xl bg-primary px-6 py-3 font-medium text-white"
        >
          Nova recolha
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <header className="sticky top-0 z-20 border-b border-border bg-primary text-white shadow-md">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-lg p-1 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Recolha Mobile</h1>
            {selectedStore && (
              <p className="text-xs text-white/70">{selectedStore.name}</p>
            )}
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs">
            {filledCount} produtos
          </span>
        </div>

        <div className="flex border-t border-white/10">
          {(["setup", "data", "photos"] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={cn(
                "flex-1 py-2 text-xs font-medium transition",
                step === s
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white/80"
              )}
            >
              {i + 1}. {s === "setup" ? "Identificação" : s === "data" ? "Produtos" : "Fotos"}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "setup" && (
        <div className="space-y-4 p-4">
          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Store className="h-4 w-4 text-primary" />
              Loja
            </label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecionar loja...</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-primary" />
              Nome do recolhedor
            </label>
            <input
              type="text"
              value={collector}
              onChange={(e) => setCollector(e.target.value)}
              placeholder="O seu nome"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <label className="mb-2 block text-sm font-medium">
              Data e hora da recolha
            </label>
            <input
              type="datetime-local"
              value={collectedAt}
              onChange={(e) => setCollectedAt(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            onClick={() => setStep("data")}
            disabled={!storeId || !collector.trim()}
            className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white disabled:opacity-40"
          >
            Continuar para produtos
          </button>
        </div>
      )}

      {step === "data" && (
        <div className="p-4">
          <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-muted/10 p-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted">
            <span>Stock físico</span>
            <span>Stock sistema</span>
            <span>Preço €</span>
          </div>

          {categories.map(([category, catProducts]) => (
            <div key={category} className="mb-3 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === category ? null : category)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold"
              >
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-muted">
                    {catProducts.length} produtos
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition",
                      expandedCategory === category && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {expandedCategory === category && (
                <div className="divide-y divide-border border-t border-border">
                  {catProducts.map((product) => {
                    const entry = entries[product.id];
                    const hasData =
                      entry?.stockFisico || entry?.stockSistema || entry?.preco;
                    return (
                      <div
                        key={product.id}
                        className={cn("px-4 py-3", hasData && "bg-primary/5")}
                      >
                        <div className="mb-2">
                          <p className="text-sm font-medium leading-tight">
                            {product.description}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">
                            {product.material} · EAN {product.ean}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            placeholder="Físico"
                            value={entry?.stockFisico || ""}
                            onChange={(e) =>
                              updateEntry(product.id, "stockFisico", e.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-2 py-2.5 text-center text-sm outline-none focus:border-primary"
                          />
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            placeholder="Sistema"
                            value={entry?.stockSistema || ""}
                            onChange={(e) =>
                              updateEntry(product.id, "stockSistema", e.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-2 py-2.5 text-center text-sm outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0,00"
                            value={entry?.preco || ""}
                            onChange={(e) =>
                              updateEntry(product.id, "preco", e.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-2 py-2.5 text-center text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => setStep("photos")}
            className="mt-2 w-full rounded-xl border-2 border-primary py-3 font-semibold text-primary"
          >
            Continuar para fotos
          </button>
        </div>
      )}

      {step === "photos" && (
        <div className="space-y-4 p-4">
          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <h2 className="mb-1 font-semibold">Fotos dos lineares</h2>
            <p className="mb-4 text-sm text-muted">
              Tire fotos das prateleiras para documentar o estado da loja.
            </p>

            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-8 transition hover:border-primary/50">
              <Camera className="h-10 w-10 text-primary" />
              <span className="font-medium text-primary">Tirar / escolher fotos</span>
              <span className="text-xs text-muted">Câmara ou galeria</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.preview}
                    alt={`Foto ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl bg-muted/10 p-4 text-sm text-muted">
            <p>
              <strong className="text-foreground">{filledCount}</strong> produtos
              preenchidos
            </p>
            <p>
              <strong className="text-foreground">{photos.length}</strong> fotos
              anexadas
            </p>
            <p className="mt-1">
              Recolhedor: <strong className="text-foreground">{collector}</strong>
            </p>
            <p>
              Data:{" "}
              <strong className="text-foreground">
                {formatDate(collectedAt)}
              </strong>
            </p>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          onClick={handleSubmit}
          disabled={saving || !storeId || !collector.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3.5 font-semibold text-white disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? "A guardar..." : "Guardar recolha"}
        </button>
      </footer>
    </div>
  );
}
