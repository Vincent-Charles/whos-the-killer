import Link from "next/link";
import { buildFullRoundScript, moodSampler } from "@/game/fullRoundScript";

const toneClass = {
  moderator: "border-red-200 bg-red-50",
  private: "border-zinc-800 bg-zinc-950 text-white",
  player: "border-zinc-200 bg-white",
  system: "border-blue-200 bg-blue-50",
  vote: "border-amber-200 bg-amber-50",
} as const;

export default function FullRoundDemo() {
  const script = buildFullRoundScript();
  const samples = moodSampler();

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-5 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-red-700">Local Validation Simulator</p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-none sm:text-6xl">Full Round Bluff Test</h1>
            <p className="mt-3 max-w-2xl text-zinc-700">
              A scripted all-player pass through night, discussion, voting, hidden roles, moderator tone, and final reveal.
            </p>
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 font-black uppercase" href="/">
            Home
          </Link>
        </div>

        <section className="mt-6 grid gap-3 lg:grid-cols-6">
          {["Vincent: Sheriff", "Robert: Villager", "Aman: Doctor", "Raghav: Killer", "Suzil: Villager", "John: Villager"].map((player) => (
            <div key={player} className="rounded-lg bg-white p-3 shadow-sm">
              <div className="text-sm font-black">{player}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-3 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-3">
            {script.map((beat, index) => (
              <article key={`${beat.speaker}-${index}`} className={`rounded-lg border p-4 shadow-sm ${toneClass[beat.type]}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-black uppercase">{beat.speaker}</h2>
                  <div className="flex gap-2">
                    <span className="rounded-lg bg-black/10 px-2 py-1 text-xs font-black uppercase">{beat.type}</span>
                    {beat.mood ? <span className="rounded-lg bg-red-600 px-2 py-1 text-xs font-black uppercase text-white">{beat.mood}</span> : null}
                    {beat.privateFor ? <span className="rounded-lg bg-white/20 px-2 py-1 text-xs font-black uppercase">Private: {beat.privateFor}</span> : null}
                  </div>
                </div>
                <p className="mt-3 text-base leading-7">{beat.text}</p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-lg bg-zinc-950 p-4 text-white lg:sticky lg:top-4">
            <h2 className="text-xl font-black uppercase">Mood Sampler</h2>
            <p className="mt-2 text-sm text-zinc-300">Moderator lines by mood. Mean and rude stay playful, not abusive.</p>
            <div className="mt-4 grid gap-2">
              {samples.map((sample, index) => (
                <div key={`${sample.mood}-${index}`} className="rounded-lg bg-white/10 p-3">
                  <div className="text-xs font-black uppercase text-red-300">{sample.mood}</div>
                  <p className="mt-1 text-sm leading-6">{sample.line}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
