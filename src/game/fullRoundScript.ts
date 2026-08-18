import { moderatorLine, type ModeratorMood } from "./narrator";

export type ScriptBeatType = "moderator" | "private" | "player" | "system" | "vote";

export type ScriptBeat = {
  type: ScriptBeatType;
  speaker: string;
  text: string;
  mood?: ModeratorMood;
  privateFor?: string;
};

const moods: ModeratorMood[] = ["hilarious", "dark", "snarky", "mean", "rude", "chaotic"];

export function buildFullRoundScript(): ScriptBeat[] {
  const beats: ScriptBeat[] = [
    { type: "moderator", speaker: "Moderator", mood: "dark", text: "Night 1. Everybody pretend this is normal." },
    { type: "private", speaker: "Raghav", privateFor: "Killer", text: "Private action: Raghav targets Robert. He then practices looking innocent, with mixed results." },
    { type: "private", speaker: "Aman", privateFor: "Doctor", text: "Private action: Aman protects Robert. No one else learns this." },
    { type: "private", speaker: "Vincent", privateFor: "Sheriff", text: "Private result: Suzil is the Killer? NO. The app reveals no role name." },
    { type: "moderator", speaker: "Moderator", mood: "hilarious", text: "Good morning. Somebody tried something. Robert remains inconveniently alive." },
    { type: "player", speaker: "Robert", text: "I survived, so either I am trusted, protected, or too annoying to finish. I accept all three theories." },
    { type: "player", speaker: "Raghav", text: "Robert saying that is exactly what a Killer would say after fake-surviving. Very suspicious. Very Robert." },
    { type: "player", speaker: "Vincent", text: "I have information, but I am not saying how much. Suzil feels clean-ish. That is all you get." },
    { type: "player", speaker: "Suzil", text: "Clean-ish is rude, but I will take it. Aman is being quiet in a very medical way." },
    { type: "player", speaker: "Aman", text: "I am quiet because everyone here is allergic to logic." },
    { type: "player", speaker: "John", text: "I have contributed nothing suspicious except this sentence, which I admit is not helping." },
    { type: "moderator", speaker: "Moderator", mood: "snarky", text: "Excellent. The village has discovered tone of voice and mistaken it for science." },
    { type: "vote", speaker: "Vote", text: "Majority is ready. Aman receives the most votes and is eliminated. His role is not revealed." },
    { type: "moderator", speaker: "Moderator", mood: "mean", text: "Aman leaves with dignity. The rest of you remain unsupervised." },
    { type: "system", speaker: "System", text: "Round 2 begins. Doctor phase still appears to everyone to preserve the illusion." },
    { type: "private", speaker: "Raghav", privateFor: "Killer", text: "Private action: Raghav targets John." },
    { type: "private", speaker: "Vincent", privateFor: "Sheriff", text: "Private result: Raghav is the Killer? YES." },
    { type: "moderator", speaker: "Moderator", mood: "dark", text: "Good morning. John did not survive the night. His role remains secret." },
    { type: "player", speaker: "Vincent", text: "I am voting Raghav. I will not explain yet, because drama deserves structure." },
    { type: "player", speaker: "Raghav", text: "That is a desperate Sheriff claim from someone who probably panicked. I respect the performance." },
    { type: "player", speaker: "Robert", text: "If Vincent is bluffing, it is weirdly specific. If Raghav is bluffing, it is annoyingly smooth." },
    { type: "player", speaker: "Suzil", text: "I hate that both of those sentences helped zero percent." },
    { type: "moderator", speaker: "Moderator", mood: "rude", text: "The debate has reached peak confidence and minimum nutrition." },
    { type: "vote", speaker: "Vote", text: "Robert is eliminated instead. His role is not revealed. The Killer is still alive, so the game continues." },
    { type: "system", speaker: "System", text: "Round 3 begins. Fake Doctor phase continues. Sheriff phase continues because Vincent is alive." },
    { type: "player", speaker: "Vincent", text: "Last chance: vote Raghav. If I am wrong, I will accept being mocked in the credits." },
    { type: "player", speaker: "Raghav", text: "Vincent has built an entire courtroom out of vibes." },
    { type: "player", speaker: "Suzil", text: "I am voting Raghav because the vibes have exhibits now." },
    { type: "moderator", speaker: "Moderator", mood: "chaotic", text: "Democracy has found the gas pedal." },
    { type: "vote", speaker: "Vote", text: "Raghav is eliminated by vote." },
    { type: "moderator", speaker: "Moderator", mood: "hilarious", text: "Suspense reveal: Raghav was the Killer. The village wins. Please act surprised responsibly." },
  ];

  return beats.map((beat, index) =>
    beat.type === "moderator" && beat.mood
      ? { ...beat, text: `${beat.text} ${moderatorLine(beat.mood, index)}` }
      : beat,
  );
}

export function moodSampler(): { mood: ModeratorMood; line: string }[] {
  return moods.flatMap((mood) => [0, 1, 2].map((step) => ({ mood, line: moderatorLine(mood, step) })));
}
