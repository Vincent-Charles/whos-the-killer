"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateClientId } from "@/lib/client-id";

export function JoinGameForm({ code }: { code: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const playerName = name.trim();
    if (!playerName) {
      setError("Enter your name first.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const clientId = getOrCreateClientId();
      const response = await fetch(`/api/rooms/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: playerName, clientId }),
      });
      const payload = (await response.json()) as { room?: { code: string; players: { id: string; displayName: string }[] }; error?: string };
      if (!response.ok || !payload.room) throw new Error(payload.error ?? "Could not join room.");
      const player = payload.room.players.find((candidate) => candidate.displayName === playerName) ?? payload.room.players.at(-1);
      if (!player) throw new Error("Could not find your player in the room.");
      const params = new URLSearchParams({ player: player.displayName, playerId: player.id, clientId });
      router.push(`/room/${payload.room.code}?${params.toString()}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not join room.");
      setPending(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-black uppercase" htmlFor="displayName">
        Display name
        <input
          id="displayName"
          className="h-14 rounded-lg border border-zinc-300 px-4 text-lg font-medium normal-case text-zinc-950 focus:outline-none focus:ring-4 focus:ring-red-200"
          placeholder="Your name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
        />
      </label>
      {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
      <button className="min-h-14 rounded-lg bg-red-600 px-5 font-black uppercase text-white disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Joining..." : "Join Room"}
      </button>
    </form>
  );
}
