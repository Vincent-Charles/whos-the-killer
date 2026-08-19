import Link from "next/link";
import { CreateGameForm } from "@/components/create-game-form";

export default function CreateGame() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-lg bg-white p-6 text-zinc-950 shadow-2xl">
        <p className="text-xs font-black uppercase text-zinc-500">Create Game</p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-none">Your name first</h1>
        <p className="mt-3 text-zinc-600">After this, the app creates the room and adds you as a normal player.</p>
        <div className="mt-6">
          <CreateGameForm />
        </div>
        <Link className="mt-4 block text-center text-sm font-bold text-zinc-600" href="/">
          Back
        </Link>
      </section>
    </main>
  );
}
