import type { ReactNode } from "react";
import { Check, Copy, QrCode, Share2, Wifi } from "lucide-react";
import clsx from "clsx";

export function PrimaryButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button className={clsx("min-h-14 rounded-lg bg-red-600 px-5 py-3 text-base font-black uppercase text-white shadow-lg shadow-red-950/20 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300", className)}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button className={clsx("min-h-14 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-base font-black uppercase text-zinc-950 transition hover:border-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-300", className)}>
      {children}
    </button>
  );
}

export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-950 px-3 py-2">
      <div className="text-[11px] font-bold uppercase tracking-normal text-zinc-300">{label}</div>
      <div className="text-lg font-black text-white">{value}</div>
    </div>
  );
}

export function IconAction({ kind, label }: { kind: "copy" | "share" | "qr" | "ready"; label: string }) {
  const Icon = kind === "copy" ? Copy : kind === "share" ? Share2 : kind === "qr" ? QrCode : Check;
  return (
    <button aria-label={label} title={label} className="grid size-12 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-red-200">
      <Icon aria-hidden className="size-5" />
    </button>
  );
}

export function ConnectionIndicator() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">
      <Wifi className="size-4" aria-hidden />
      Synced
    </div>
  );
}
