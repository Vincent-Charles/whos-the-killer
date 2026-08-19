"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function JoinGameForm({ code }: { code: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const playerName = name.trim();
    if (!playerName) {
      setError("Enter your name first.");
      return;
    }
    const params = new URLSearchParams({ player: playerName });
    router.push(`/room/${code}?${params.toString()}`);
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
      <button className="min-h-14 rounded-lg bg-red-600 px-5 font-black uppercase text-white" type="submit">
        Join Room
      </button>
    </form>
  );
}
