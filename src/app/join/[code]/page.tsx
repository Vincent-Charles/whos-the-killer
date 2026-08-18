import Link from "next/link";

export default async function JoinByCode({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-lg bg-white p-6 text-zinc-950 shadow-2xl">
        <p className="text-xs font-black uppercase text-zinc-500">Join Game</p>
        <h1 className="mt-3 font-mono text-5xl font-black uppercase">{code}</h1>
        <label className="mt-6 block text-sm font-black uppercase" htmlFor="displayName">
          Display name
        </label>
        <input id="displayName" className="mt-2 h-14 w-full rounded-lg border border-zinc-300 px-4 text-lg focus:outline-none focus:ring-4 focus:ring-red-200" placeholder="Your name" />
        <button className="mt-4 min-h-14 w-full rounded-lg bg-red-600 px-5 font-black uppercase text-white">Join Room</button>
        <Link className="mt-4 block text-center text-sm font-bold text-zinc-600" href="/">
          Back
        </Link>
      </section>
    </main>
  );
}
