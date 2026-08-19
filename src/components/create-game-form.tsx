"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateClientId } from "@/lib/client-id";

export function CreateGameForm() {
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
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: playerName, clientId }),
      });
      const payload = (await response.json()) as { room?: { code: string; players: { id: string }[] }; error?: string };
      if (!response.ok || !payload.room) throw new Error(payload.error ?? "Could not create room.");
      const player = payload.room.players[0];
      const params = new URLSearchParams({ player: playerName, playerId: player.id, clientId });
      router.push(`/room/${payload.room.code}?${params.toString()}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create room.");
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-black uppercase" htmlFor="creatorName">
        Your name
        <input
          id="creatorName"
          className="h-14 rounded-lg border border-zinc-300 px-4 text-lg font-medium normal-case text-zinc-950 focus:outline-none focus:ring-4 focus:ring-red-200"
          placeholder="Vincent"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
        />
      </label>
      {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
      <button className="min-h-14 rounded-lg bg-red-600 px-5 text-base font-black uppercase text-white disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Creating..." : "Create Room"}
      </button>
    </form>
  );
}
