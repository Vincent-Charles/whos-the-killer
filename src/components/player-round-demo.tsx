"use client";

import { useMemo, useState } from "react";
import { Check, Eye, Moon, Shield, Skull, Sun, Vote } from "lucide-react";
import { buildFullRoundScript } from "@/game/fullRoundScript";

type DemoStep = {
  phase: string;
  title: string;
  body: string;
  mood: "night" | "morning" | "discussion" | "vote" | "private" | "gameover";
  action?: string;
  privateNote?: string;
};

const steps: DemoStep[] = [
  {
    phase: "Role Reveal",
    title: "Your role is ready",
    body: "Hold to reveal. Release to hide. No one else gets this screen.",
    mood: "private",
    action: "Hold To Reveal",
    privateNote: "Vincent only sees: Sheriff",
  },
  {
    phase: "Night 1",
    title: "The village is sleeping",
    body: "The app is collecting secret actions in the background.",
    mood: "night",
  },
  {
    phase: "Sheriff Action",
    title: "Choose one player",
    body: "You investigate Suzil. The answer is private.",
    mood: "private",
    action: "Confirm Suzil",
    privateNote: "Suzil is the Killer? NO",
  },
  {
    phase: "Morning",
    title: "Good morning",
    body: "Somebody tried something. Everybody is still here.",
    mood: "morning",
  },
  {
    phase: "Discussion",
    title: "Phones down",
    body: "Robert claims survival makes him trustworthy. Raghav calls that suspicious. Vincent keeps his result vague.",
    mood: "discussion",
    action: "Ready To Vote",
  },
  {
    phase: "Voting",
    title: "Vote privately",
    body: "Aman is eliminated. His role is not revealed.",
    mood: "vote",
    action: "Vote Aman",
  },
  {
    phase: "Night 2",
    title: "Night falls again",
    body: "Doctor phase still appears. The app does not reveal whether the Doctor is alive.",
    mood: "night",
  },
  {
    phase: "Sheriff Action",
    title: "Choose one player",
    body: "You investigate Raghav. The answer is private.",
    mood: "private",
    action: "Confirm Raghav",
    privateNote: "Raghav is the Killer? YES",
  },
  {
    phase: "Morning",
    title: "Good morning",
    body: "John did not survive the night. His role is not revealed.",
    mood: "morning",
  },
  {
    phase: "Discussion",
    title: "Phones down",
    body: "Vincent pushes Raghav. Raghav says Vincent built a courtroom out of vibes. Suzil hates that both arguments make sense.",
    mood: "discussion",
    action: "Ready To Vote",
  },
  {
    phase: "Voting",
    title: "Vote privately",
    body: "Robert is eliminated instead. His role is not revealed. The game continues.",
    mood: "vote",
    action: "Vote Robert",
  },
  {
    phase: "Final Vote",
    title: "One last vote",
    body: "The table finally votes for Raghav.",
    mood: "vote",
    action: "Vote Raghav",
  },
  {
    phase: "Game Over",
    title: "Village wins",
    body: "Raghav was the Killer. All roles are revealed now, and only now.",
    mood: "gameover",
    action: "Play Again",
  },
];

const moodClass: Record<DemoStep["mood"], string> = {
  night: "bg-zinc-950 text-white",
  morning: "bg-amber-50 text-zinc-950",
  discussion: "bg-white text-zinc-950",
  vote: "bg-red-50 text-zinc-950",
  private: "bg-zinc-900 text-white",
  gameover: "bg-emerald-950 text-white",
};

function PhaseIcon({ mood }: { mood: DemoStep["mood"] }) {
  const iconClass = "size-6";
  if (mood === "night") return <Moon className={iconClass} aria-hidden />;
  if (mood === "morning") return <Sun className={iconClass} aria-hidden />;
  if (mood === "vote") return <Vote className={iconClass} aria-hidden />;
  if (mood === "private") return <Shield className={iconClass} aria-hidden />;
  if (mood === "gameover") return <Skull className={iconClass} aria-hidden />;
  return <Eye className={iconClass} aria-hidden />;
}

export function PlayerRoundDemo({ playerName = "Vincent" }: { playerName?: string }) {
  const [step, setStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(true);
  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const scriptedTone = useMemo(() => buildFullRoundScript().filter((beat) => beat.type === "player").slice(0, 6), []);

  function nextStep() {
    setStep((value) => Math.min(value + 1, steps.length - 1));
    setDialogOpen(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-4 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-zinc-400">Player View</p>
            <h1 className="text-xl font-black uppercase">{playerName}</h1>
          </div>
          <div className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-black uppercase text-emerald-950">Synced</div>
        </header>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-red-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <section className={`mt-4 flex flex-1 flex-col justify-between rounded-lg p-5 shadow-2xl ${moodClass[current.mood]}`}>
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-black/10 px-3 py-2 text-xs font-black uppercase">{current.phase}</span>
              <PhaseIcon mood={current.mood} />
            </div>
            <h2 className="mt-8 text-4xl font-black uppercase leading-none tracking-normal">{current.title}</h2>
            <p className="mt-5 text-lg leading-8 opacity-85">{current.body}</p>
            {current.privateNote ? (
              <div className="mt-5 rounded-lg border border-white/15 bg-black/20 p-4">
                <p className="text-xs font-black uppercase opacity-70">Private</p>
                <p className="mt-2 text-2xl font-black uppercase">{current.privateNote}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-8 grid gap-3">
            <button
              className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-base font-black uppercase text-white shadow-lg shadow-red-950/20"
              onClick={nextStep}
            >
              <Check className="size-5" aria-hidden />
              {current.action ?? "Continue"}
            </button>
            <button className="min-h-12 rounded-lg border border-current px-4 text-sm font-black uppercase opacity-70" onClick={() => setDialogOpen(true)}>
              Replay App Message
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-black uppercase text-zinc-400">Table Talk</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{scriptedTone[step % scriptedTone.length]?.text}</p>
        </section>

        {dialogOpen ? (
          <div className="fixed inset-0 z-20 grid place-items-center bg-black/70 px-4">
            <dialog open className="w-full max-w-sm rounded-lg bg-white p-5 text-zinc-950 shadow-2xl">
              <p className="text-xs font-black uppercase text-red-700">App Message</p>
              <h3 className="mt-3 text-3xl font-black uppercase leading-none">{current.title}</h3>
              <p className="mt-4 text-base leading-7 text-zinc-700">{current.body}</p>
              <button
                className="mt-5 flex min-h-14 w-full items-center justify-center rounded-lg bg-zinc-950 px-5 text-base font-black uppercase text-white"
                onClick={() => setDialogOpen(false)}
              >
                Got It
              </button>
            </dialog>
          </div>
        ) : null}
      </section>
    </main>
  );
}
