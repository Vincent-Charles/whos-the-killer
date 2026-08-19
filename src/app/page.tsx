import Link from "next/link";
import { gameConfig } from "@/config/game";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 py-6 text-white">
      <section className="w-full max-w-md">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <p className="text-xs font-black uppercase text-red-300">No host. The app runs quietly.</p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-none tracking-normal">{gameConfig.title}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            The app runs the room quietly. You only see what your player should see.
          </p>

          <div className="mt-8 grid gap-3">
            <Link
              className="flex min-h-14 items-center justify-center rounded-lg bg-red-600 px-5 text-base font-black uppercase text-white shadow-lg shadow-red-950/30"
              href="/join/K7R4Q"
            >
              Join Game
            </Link>
            <button className="min-h-14 rounded-lg border border-white/15 bg-white px-5 text-base font-black uppercase text-zinc-950">
              Create Game
            </button>
          </div>
        </div>

        <Link
          className="mt-4 flex min-h-12 items-center justify-center rounded-lg border border-white/10 text-sm font-black uppercase text-zinc-300"
          href="/demo/full-round"
        >
          Test Full Round
        </Link>
      </section>
    </main>
  );
}
