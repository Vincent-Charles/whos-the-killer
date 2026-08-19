import Link from "next/link";
import { JoinGameForm } from "@/components/join-game-form";

export default async function JoinByCode({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-lg bg-white p-6 text-zinc-950 shadow-2xl">
        <p className="text-xs font-black uppercase text-zinc-500">Join Game</p>
        <h1 className="mt-3 font-mono text-5xl font-black uppercase">{code}</h1>
        <JoinGameForm code={code} />
        <Link className="mt-4 block text-center text-sm font-bold text-zinc-600" href="/">
          Back
        </Link>
      </section>
    </main>
  );
}
