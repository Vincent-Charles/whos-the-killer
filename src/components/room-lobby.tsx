"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Play, Share2 } from "lucide-react";

type RoomLobbyProps = {
  code: string;
  clientId?: string;
  fallbackPlayerName: string;
  playerId?: string;
};

type LobbyPlayer = {
  id: string;
  displayName: string;
  ready: boolean;
  connected: boolean;
  joinedAt: string;
};

type LobbyRoom = {
  code: string;
  isCreator: boolean;
  storage: "redis" | "temporary";
  players: LobbyPlayer[];
};

export function RoomLobby({ code, clientId, fallbackPlayerName, playerId }: RoomLobbyProps) {
  const [copied, setCopied] = useState(false);
  const [room, setRoom] = useState<LobbyRoom | null>(null);
  const [error, setError] = useState(clientId ? "" : "Open this room from Create Game or Join Game so the app knows which player is you.");
  const [pendingReady, setPendingReady] = useState(false);

  const fallbackPlayers = useMemo(
    () => [{ id: playerId ?? "fallback", displayName: fallbackPlayerName, ready: false, connected: true, joinedAt: "" }],
    [fallbackPlayerName, playerId],
  );
  const players = room?.players ?? fallbackPlayers;
  const currentPlayer = useMemo(() => players.find((player) => player.id === playerId) ?? players[0], [playerId, players]);
  const readyCount = players.filter((player) => player.ready).length;
  const readyPercent = players.length > 0 ? (readyCount / players.length) * 100 : 0;
  const isCreator = room?.isCreator ?? false;

  useEffect(() => {
    if (!clientId) return;
    const activeClientId = clientId;
    let active = true;

    async function loadRoom() {
      try {
        const response = await fetch(`/api/rooms/${code}?clientId=${encodeURIComponent(activeClientId)}`, { cache: "no-store" });
        const payload = (await response.json()) as { room?: LobbyRoom; error?: string };
        if (!active) return;
        if (!response.ok || !payload.room) {
          setError(payload.error ?? "Could not load room.");
          return;
        }
        setRoom(payload.room);
        setError("");
      } catch {
        if (active) setError("Could not sync room. Check your connection.");
      }
    }

    void loadRoom();
    const interval = window.setInterval(loadRoom, 2000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [clientId, code]);

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

  async function toggleReady() {
    if (!clientId || !currentPlayer) return;
    const nextReady = !currentPlayer.ready;
    setPendingReady(true);
    try {
      const response = await fetch(`/api/rooms/${code}/ready`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, ready: nextReady }),
      });
      const payload = (await response.json()) as { room?: LobbyRoom; error?: string };
      if (!response.ok || !payload.room) throw new Error(payload.error ?? "Could not update readiness.");
      setRoom(payload.room);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not update readiness.");
    } finally {
      setPendingReady(false);
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
          <div className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-black uppercase text-emerald-950">
            {room?.storage === "temporary" ? "Temp" : "Live"}
          </div>
        </header>

        <section className="mt-5 rounded-lg bg-white p-4 text-zinc-950">
          <p className="text-xs font-black uppercase text-zinc-500">You are</p>
          <h2 className="mt-1 text-3xl font-black">{currentPlayer?.displayName ?? fallbackPlayerName}</h2>
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

        {error ? <p className="mt-4 rounded-lg border border-red-400/40 bg-red-950/40 p-3 text-sm font-bold text-red-100">{error}</p> : null}
        {room?.storage === "temporary" ? (
          <p className="mt-4 rounded-lg border border-amber-300/40 bg-amber-950/30 p-3 text-sm font-bold text-amber-100">
            Temporary room storage is active. Add free Redis/KV env vars in Vercel for reliable friend invites.
          </p>
        ) : null}

        <section className="mt-4 grid gap-2">
          {players.map((player) => (
            <div key={player.id} className="flex min-h-14 items-center justify-between rounded-lg bg-white/10 px-3">
              <span className="font-black">{player.displayName}</span>
              <span className={player.ready ? "text-emerald-300" : "text-zinc-500"}>
                {player.ready ? "Ready" : "Waiting"}
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
              <div className="h-full bg-red-500" style={{ width: `${readyPercent}%` }} />
            </div>
          </div>

          <button
            className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-base font-black uppercase text-white disabled:opacity-60"
            disabled={pendingReady || !clientId}
            onClick={toggleReady}
          >
            <Check className="size-5" aria-hidden />
            {currentPlayer?.ready ? "Not Ready Yet" : "Ready"}
          </button>

          {isCreator ? (
            <Link
              className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-white px-5 text-base font-black uppercase text-zinc-950"
              href={`/demo/full-round?player=${encodeURIComponent(currentPlayer?.displayName ?? fallbackPlayerName)}`}
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
