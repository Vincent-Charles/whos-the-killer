import { describe, expect, it } from "vitest";
import { buildFullRoundScript, moodSampler } from "@/game/fullRoundScript";

describe("full round bluff simulator", () => {
  it("covers the requested moderator moods", () => {
    const moods = new Set(moodSampler().map((sample) => sample.mood));
    expect(moods).toEqual(new Set(["hilarious", "dark", "snarky", "mean", "rude", "chaotic"]));
  });

  it("plays through the acceptance story with private action boundaries", () => {
    const script = buildFullRoundScript();
    const speakers = new Set(script.filter((beat) => beat.type === "player").map((beat) => beat.speaker));
    expect(script.some((beat) => beat.text.includes("Raghav was the Killer"))).toBe(true);
    expect(script.some((beat) => beat.text.includes("His role is not revealed"))).toBe(true);
    expect(script.filter((beat) => beat.type === "private").every((beat) => beat.privateFor)).toBe(true);
    expect(speakers).toEqual(new Set(["Aman", "John", "Raghav", "Robert", "Suzil", "Vincent"]));
  });
});
