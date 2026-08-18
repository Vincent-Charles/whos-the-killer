import { describe, expect, it } from "vitest";
import { createDemoRoom } from "@/game/demo";
import { resolveNight, resolveVote, submitNightAction, submitVote } from "@/game/engine";
import type { RoomState } from "@/game/types";

describe("documented acceptance scenario", () => {
  it("plays the required three-round story without non-killer role reveals", () => {
    let room: RoomState = { ...createDemoRoom(), phase: "killer_action" };
    room = submitNightAction(room, "p4", "kill", "p2");
    room = { ...room, phase: "doctor_action" };
    room = submitNightAction(room, "p3", "protect", "p2");
    room = { ...room, phase: "sheriff_action" };
    room = submitNightAction(room, "p1", "investigate", "p5");
    room = resolveNight({ ...room, phase: "night_resolution" });
    expect(room.nightVictimId).toBeNull();
    expect(room.sheriffResults.p1[0].isKiller).toBe(false);

    room = { ...room, phase: "voting" };
    for (const voter of ["p1", "p2", "p3", "p4"]) room = submitVote(room, voter, "p3");
    room = resolveVote({ ...room, phase: "vote_result" });
    expect(room.phase).toBe("round_transition");
    expect(room.eliminatedThisRound).toBe("p3");

    room = { ...room, round: 2, phase: "killer_action" };
    room = submitNightAction(room, "p4", "kill", "p6");
    room = { ...room, phase: "sheriff_action" };
    room = submitNightAction(room, "p1", "investigate", "p4");
    room = resolveNight({ ...room, phase: "night_resolution" });
    expect(room.nightVictimId).toBe("p6");
    expect(room.sheriffResults.p1[1].isKiller).toBe(true);

    room = { ...room, phase: "voting" };
    for (const voter of ["p1", "p2", "p4", "p5"]) room = submitVote(room, voter, "p2");
    room = resolveVote({ ...room, phase: "vote_result" });
    expect(room.phase).toBe("round_transition");
    expect(room.eliminatedThisRound).toBe("p2");

    room = { ...room, round: 3, phase: "voting" };
    for (const voter of ["p1", "p4", "p5"]) room = submitVote(room, voter, "p4");
    room = resolveVote({ ...room, phase: "vote_result" });
    expect(room.phase).toBe("game_over");
    expect(room.winner).toBe("village");
  });
});
