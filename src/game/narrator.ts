const lines = {
  night: [
    "The village is sleeping. Trust levels are already questionable.",
    "Night falls. Everyone suddenly remembers they have secrets.",
    "The room gets quiet. That is rarely a good sign.",
  ],
  safeMorning: [
    "Somebody tried something. Everybody is still here.",
    "Good morning. The Doctor may or may not be feeling smug.",
    "Nobody died. Somehow this makes everyone more suspicious.",
  ],
  deathMorning: [
    "Everyone wake up. One chair feels very empty.",
    "Morning arrives with bad news and worse theories.",
    "The village survived the night. Not everyone did.",
  ],
  discussion: [
    "Put the phones down. Accuse freely.",
    "This is where eye contact becomes evidence.",
    "Trust nobody. Especially the confident people.",
  ],
};

export type NarratorCategory = keyof typeof lines;
export type ModeratorMood = "hilarious" | "dark" | "snarky" | "mean" | "rude" | "chaotic";

const moodLines: Record<ModeratorMood, string[]> = {
  hilarious: [
    "The moderator would like to remind everyone that confidence is not the same thing as evidence.",
    "A bold accusation has entered the room wearing shoes it cannot afford.",
    "Someone is lying. Statistically, several of you are doing it badly.",
  ],
  dark: [
    "The room feels smaller after the vote. Funny how silence can take up space.",
    "Night does not care who had a good argument. It only keeps receipts.",
    "A name is spoken, and the table gets colder.",
  ],
  snarky: [
    "Excellent theory. It has almost met a fact.",
    "The moderator appreciates the passion and regrets the reasoning.",
    "That defense was brave in the way expired milk is brave.",
  ],
  mean: [
    "That accusation was so thin it needs a jacket.",
    "The village has formed a plan, which is adorable and concerning.",
    "If being wrong were a strategy, this table would be unstoppable.",
  ],
  rude: [
    "Please continue. The truth is clearly terrified of joining this conversation.",
    "The moderator has heard stronger alibis from a locked door.",
    "That vote was legal. Emotionally, it was a mess.",
  ],
  chaotic: [
    "Three people are talking, nobody is listening, and somehow this counts as democracy.",
    "The table has chosen volume as a research method.",
    "The moderator has lost the thread, which means the game is working.",
  ],
};

export function narratorLine(category: NarratorCategory, previous?: string): string {
  const options = lines[category];
  return options.find((line) => line !== previous) ?? options[0];
}

export function moderatorLine(mood: ModeratorMood, step: number): string {
  const options = moodLines[mood];
  return options[step % options.length];
}
