import { describe, expect, it } from "vitest";
import {
  assignRoles,
  publicProjection,
  resolveNight,
  resolveVote,
  submitDiscussionReady,
  submitNightAction,
  submitVote,
} from "@/game/engine";
import { seededRandom } from "@/game/random";
import { createDemoRoom } from "@/game/demo";
import type { RoomState } from "@/game/types";

describe("game engine", () => {
  it("assigns valid role counts deterministically", () => {
    const room = createDemoRoom();
    const assigned = assignRoles(
      room.players.map((player) => ({
        id: player.id,
        userId: player.userId,
        name: player.name,
        alive: player.alive,
        ready: player.ready,
        roleConfirmed: player.roleConfirmed,
        connected: player.connected,
      })),
      { killer: 1, doctor: 1, sheriff: 1 },
      seededRandom(7),
    );
    expect(assigned.filter((player) => player.role === "killer")).toHaveLength(1);
    expect(assigned.filter((player) => player.role === "doctor")).toHaveLength(1);
    expect(assigned.filter((player) => player.role === "sheriff")).toHaveLength(1);
    expect(assigned.filter((player) => player.role === "villager")).toHaveLength(3);
  });

  it("does not leak roles or private actions in public projection", () => {
    const publicRoom = publicProjection(createDemoRoom());
    expect("actions" in publicRoom).toBe(false);
    expect("sheriffResults" in publicRoom).toBe(false);
    expect(publicRoom.players.every((player) => !("role" in player))).toBe(true);
  });

  it("rejects invalid killer targets and duplicate actions", () => {
    let room: RoomState = { ...createDemoRoom(), phase: "killer_action" };
    expect(() => submitNightAction(room, "p4", "kill", "p4")).toThrow("Self target");
    room = submitNightAction(room, "p4", "kill", "p2");
    expect(() => submitNightAction(room, "p4", "kill", "p3")).toThrow("Duplicate action");
  });

  it("lets doctor saves prevent a kill", () => {
    let room: RoomState = { ...createDemoRoom(), phase: "killer_action" };
    room = submitNightAction(room, "p4", "kill", "p2");
    room = { ...room, phase: "doctor_action" };
    room = submitNightAction(room, "p3", "protect", "p2");
    const resolved = resolveNight({ ...room, phase: "night_resolution" });
    expect(resolved.nightVictimId).toBeNull();
    expect(resolved.players.find((player) => player.id === "p2")?.alive).toBe(true);
  });

  it("returns sheriff yes/no without exposing the target role", () => {
    let room: RoomState = { ...createDemoRoom(), phase: "sheriff_action" };
    room = submitNightAction(room, "p1", "investigate", "p4");
    expect(room.sheriffResults.p1[0]).toMatchObject({ isKiller: true, targetPlayerId: "p4" });
    expect(Object.keys(room.sheriffResults.p1[0])).not.toContain("role");
  });

  it("blocks dead doctor and sheriff while phases can still exist", () => {
    const deadDoctor: RoomState = {
      ...createDemoRoom(),
      phase: "doctor_action" as const,
      players: createDemoRoom().players.map((player) => (player.id === "p3" ? { ...player, alive: false } : player)),
    };
    expect(() => submitNightAction(deadDoctor, "p3", "protect", "p1")).toThrow("Dead players");
    const deadSheriff: RoomState = {
      ...createDemoRoom(),
      phase: "sheriff_action",
      players: createDemoRoom().players.map((player) => (player.id === "p1" ? { ...player, alive: false } : player)),
    };
    expect(deadSheriff.phase).toBe("sheriff_action");
    expect(() => submitNightAction(deadSheriff, "p1", "investigate", "p4")).toThrow("Dead players");
  });

  it("uses majority ready to move from discussion to voting", () => {
    let room: RoomState = { ...createDemoRoom(), phase: "discussion" };
    room = submitDiscussionReady(room, "p1", true);
    room = submitDiscussionReady(room, "p2", true);
    expect(room.phase).toBe("discussion");
    room = submitDiscussionReady(room, "p3", true);
    room = submitDiscussionReady(room, "p4", true);
    expect(room.phase).toBe("voting");
  });

  it("prevents dead players from voting and ends when killer is eliminated", () => {
    let room: RoomState = {
      ...createDemoRoom(),
      phase: "voting" as const,
      players: createDemoRoom().players.map((player) => (player.id === "p6" ? { ...player, alive: false } : player)),
    };
    expect(() => submitVote(room, "p6", "p4")).toThrow("Dead players");
    room = submitVote(room, "p1", "p4");
    room = submitVote(room, "p2", "p4");
    room = submitVote(room, "p3", "p4");
    const resolved = resolveVote({ ...room, phase: "vote_result" });
    expect(resolved.phase).toBe("game_over");
    expect(resolved.winner).toBe("village");
  });
});
