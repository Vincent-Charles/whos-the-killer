import { gameConfig } from "@/config/game";
import { createDemoRoom, createResolvedDemoRoom } from "@/game/demo";
import { publicProjection } from "@/game/engine";
import { narratorLine } from "@/game/narrator";
import { roleDefinitions, roleIntroLines } from "@/game/roles";
import { generateAwards } from "@/game/statistics";
import { ConnectionIndicator, IconAction, PrimaryButton, SecondaryButton, StatPill } from "@/components/ui";

export default function Home() {
  const room = createDemoRoom();
  const publicRoom = publicProjection(room);
  const finished = createResolvedDemoRoom();
  const awards = generateAwards(finished);
  const vincent = room.players.find((player) => player.name === "Vincent");
  const role = vincent ? roleDefinitions[vincent.role] : roleDefinitions.villager;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-between rounded-lg bg-[linear-gradient(145deg,#18181b,#3f1518_55%,#111827)] p-5 shadow-2xl sm:p-8">
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase text-zinc-950">No host needed</span>
              <ConnectionIndicator />
            </div>
            <h1 className="max-w-xl text-5xl font-black uppercase leading-none tracking-normal sm:text-7xl">{gameConfig.title}</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-100">
              A mobile-first social deduction game where the backend is the Game Master, secrets stay private, and the room does the arguing.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <PrimaryButton>Create Game</PrimaryButton>
            <SecondaryButton>Join Game</SecondaryButton>
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-lg bg-white p-4 text-zinc-950 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-zinc-500">Room Code</p>
                <div className="mt-1 font-mono text-4xl font-black tracking-normal">{publicRoom.code}</div>
              </div>
              <div className="flex gap-2">
                <IconAction kind="copy" label="Copy join link" />
                <IconAction kind="share" label="Share join link" />
                <IconAction kind="qr" label="Show QR code" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatPill label="Players" value={`${publicRoom.players.length}/${gameConfig.maxPlayers}`} />
              <StatPill label="Ready" value="5/6" />
            </div>
          </section>

          <section className="rounded-lg bg-zinc-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase">Lobby</h2>
              <span className="text-sm font-bold text-zinc-300">Creator control ends after start</span>
            </div>
            <div className="grid gap-2">
              {publicRoom.players.map((player) => (
                <div key={player.id} className="flex min-h-14 items-center justify-between rounded-lg bg-white/10 px-3">
                  <div>
                    <div className="font-black">{player.name}</div>
                    <div className="text-xs font-bold uppercase text-zinc-400">{player.connected ? "Connected" : "Reconnecting"}</div>
                  </div>
                  <span className={player.ready ? "text-emerald-300" : "text-zinc-500"}>{player.ready ? "Ready" : "Waiting"}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="bg-zinc-100 px-4 py-10 text-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          <div className="rounded-lg bg-zinc-950 p-5 text-white">
            <p className="text-xs font-black uppercase text-red-300">Private Phone Screen</p>
            <h2 className="mt-3 text-3xl font-black uppercase">Your Role Is Ready</h2>
            <div className="mt-5 rounded-lg border border-red-400/40 bg-red-950/50 p-5 text-center">
              <p className="text-sm font-black uppercase text-red-200">Hold To Reveal</p>
              <p className="mt-4 text-4xl font-black uppercase">{role.displayName}</p>
              <p className="mt-3 text-zinc-200">{roleIntroLines[role.id][0]}</p>
            </div>
            <PrimaryButton className="mt-5 w-full">I Know My Role</PrimaryButton>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-xs font-black uppercase text-zinc-500">Night Engine</p>
            <h2 className="mt-3 text-3xl font-black uppercase">Night 1</h2>
            <p className="mt-3 text-zinc-700">{narratorLine("night")}</p>
            <div className="mt-5 grid gap-2">
              {["Killer action", "Doctor action", "Sheriff action"].map((phase) => (
                <div key={phase} className="flex min-h-12 items-center justify-between rounded-lg border border-zinc-200 px-3">
                  <span className="font-bold">{phase}</span>
                  <span className="text-sm text-zinc-500">Server timed</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 p-5 shadow">
            <p className="text-xs font-black uppercase text-amber-700">Discussion Pause</p>
            <h2 className="mt-3 text-3xl font-black uppercase">Phones Down</h2>
            <p className="mt-3 text-zinc-800">{narratorLine("discussion")}</p>
            <div className="mt-5 rounded-lg bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-black">Ready to vote</span>
                <span className="font-mono font-black">4 / 6</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full w-2/3 bg-red-600" />
              </div>
            </div>
            <PrimaryButton className="mt-5 w-full">Ready To Vote</PrimaryButton>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 text-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black uppercase">Endgame Reveal</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">Roles stay secret until the Killer is voted out. Awards are generated only from real game data.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {finished.players.map((player) => (
              <div key={player.id} className="rounded-lg border border-zinc-200 p-4">
                <div className="text-xl font-black">{player.name}</div>
                <div className="mt-1 text-sm font-black uppercase text-red-700">{roleDefinitions[player.role].displayName}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((award) => {
              const player = finished.players.find((candidate) => candidate.id === award.playerId);
              return (
                <div key={`${award.title}-${award.playerId}`} className="rounded-lg bg-zinc-950 p-4 text-white">
                  <div className="text-sm font-black uppercase text-amber-300">{award.title}</div>
                  <div className="mt-2 text-xl font-black">{player?.name}</div>
                  <p className="mt-2 text-sm text-zinc-300">{award.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
