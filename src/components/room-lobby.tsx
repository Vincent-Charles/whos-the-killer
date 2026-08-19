"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Play, Share2 } from "lucide-react";

type RoomLobbyProps = {
  code: string;
  playerName: string;
  isCreator: boolean;
};

export function RoomLobby({ code, playerName, isCreator }: RoomLobbyProps) {
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const players = [playerName];
  const readyCount = ready ? 1 : 0;

  async function copyLink() {
    const link = `${window.location.origin}/join/${code}`;
    await navigator.clipboard?.writeText(link).catch(() => undefined);
    setCopied(true);
  }

  async function shareLink() {
    const link = `${window.location.origin}/join/${code}`;
    if (navigator.share) {
      await navigator.share({ title: "Join WHO'S THE KILLER?", url: link }).catch(() => undefined);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-4 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-zinc-400">Waiting Room</p>
            <h1 className="font-mono text-4xl font-black">{code}</h1>
          </div>
          <div className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-black uppercase text-emerald-950">Synced</div>
        </header>

        <section className="mt-5 rounded-lg bg-white p-4 text-zinc-950">
          <p className="text-xs font-black uppercase text-zinc-500">You are</p>
          <h2 className="mt-1 text-3xl font-black">{playerName}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-zinc-300 font-black uppercase" onClick={copyLink}>
              <Copy className="size-4" aria-hidden />
              {copied ? "Copied" : "Copy"}
            </button>
            <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-zinc-300 font-black uppercase" onClick={shareLink}>
              <Share2 className="size-4" aria-hidden />
              Share
            </button>
          </div>
        </section>

        <section className="mt-4 grid gap-2">
          {players.map((player) => (
            <div key={player} className="flex min-h-14 items-center justify-between rounded-lg bg-white/10 px-3">
              <span className="font-black">{player}</span>
              <span className={player === playerName && ready ? "text-emerald-300" : "text-zinc-500"}>
                {player === playerName && ready ? "Ready" : "Waiting"}
              </span>
            </div>
          ))}
        </section>

        <div className="mt-auto grid gap-3 pt-5">
          <div className="rounded-lg bg-white/10 p-3">
            <div className="flex items-center justify-between text-sm font-black uppercase">
              <span>Ready</span>
              <span>
                {readyCount} / {players.length}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-red-500" style={{ width: `${(readyCount / players.length) * 100}%` }} />
            </div>
          </div>

          <button
            className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-base font-black uppercase text-white"
            onClick={() => setReady((value) => !value)}
          >
            <Check className="size-5" aria-hidden />
            {ready ? "Not Ready Yet" : "Ready"}
          </button>

          {isCreator ? (
            <Link
              className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-white px-5 text-base font-black uppercase text-zinc-950"
              href={`/demo/full-round?player=${encodeURIComponent(playerName)}`}
            >
              <Play className="size-5" aria-hidden />
              Start Game
            </Link>
          ) : (
            <p className="rounded-lg border border-white/10 p-3 text-center text-sm font-bold text-zinc-300">
              Waiting for the app to start the game.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
