"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const demoCode = "K7R4Q";

export function CreateGameForm() {
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
    const params = new URLSearchParams({ player: playerName, creator: "1" });
    router.push(`/room/${demoCode}?${params.toString()}`);
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
      <button className="min-h-14 rounded-lg bg-red-600 px-5 text-base font-black uppercase text-white" type="submit">
        Create Room
      </button>
    </form>
  );
}
