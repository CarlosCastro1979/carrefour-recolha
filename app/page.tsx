import Link from "next/link";
import { Smartphone, Monitor, BarChart3, Camera } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-primary via-[#002d75] to-[#001a45]">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Carrefour Portugal
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Recolha de Dados
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Stock físico, stock de sistema, preços e fotos dos lineares — com
            histórico por loja e recolhedor.
          </p>
        </div>

        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          <Link
            href="/mobile"
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Smartphone className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold">Versão Mobile</h2>
            <p className="mt-2 text-sm text-muted">
              Para quem está na loja. Recolha stock, preços e tire fotos dos
              lineares.
            </p>
            <span className="mt-4 text-sm font-medium text-primary group-hover:underline">
              Abrir recolha →
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Monitor className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold">Versão Desktop</h2>
            <p className="mt-2 text-sm text-muted">
              Consulte histórico, compare stocks e veja fotos de todas as lojas.
            </p>
            <span className="mt-4 text-sm font-medium text-accent group-hover:underline">
              Abrir dashboard →
            </span>
          </Link>
        </div>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-4 text-white/70 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            10 lojas
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            Histórico completo
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Camera className="h-4 w-4" />
            Fotos lineares
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            Stock vs sistema
          </div>
        </div>
      </div>
    </div>
  );
}
