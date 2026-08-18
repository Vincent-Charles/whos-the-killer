import { seededRandom } from "./random";
import { assignRoles, submitNightAction, resolveNight, submitVote, resolveVote } from "./engine";
import type { Player, RoomState } from "./types";

const basePlayers: Omit<Player, "role">[] = ["Vincent", "Robert", "Aman", "Raghav", "Suzil", "John"].map((name, index) => ({
  id: `p${index + 1}`,
  userId: `u${index + 1}`,
  name,
  alive: true,
  ready: false,
  roleConfirmed: index !== 4,
  connected: index !== 5,
}));

export function createDemoRoom(): RoomState {
  const assigned = assignRoles(basePlayers, { killer: 1, doctor: 1, sheriff: 1 }, seededRandom(42));
  const fixed = assigned.map((player) => {
    const role = player.name === "Raghav" ? "killer" : player.name === "Aman" ? "doctor" : player.name === "Vincent" ? "sheriff" : "villager";
    return { ...player, role } as Player;
  });
  return {
    id: "demo-room",
    code: "K7R4Q",
    phase: "discussion",
    round: 1,
    settings: { doctorCanSelfSave: true, nightActionSeconds: 30, discussionMode: "majority_ready" },
    players: fixed,
    actions: [],
    votes: [],
    sheriffResults: {},
    nightVictimId: null,
  };
}

export function createResolvedDemoRoom(): RoomState {
  let room: RoomState = { ...createDemoRoom(), phase: "killer_action" };
  room = submitNightAction(room, "p4", "kill", "p2");
  room = { ...room, phase: "doctor_action" };
  room = submitNightAction(room, "p3", "protect", "p2");
  room = { ...room, phase: "sheriff_action" };
  room = submitNightAction(room, "p1", "investigate", "p5");
  room = resolveNight({ ...room, phase: "night_resolution" });
  room = submitVote({ ...room, phase: "voting" }, "p1", "p3");
  room = submitVote(room, "p2", "p3");
  room = submitVote(room, "p3", "p4");
  room = submitVote(room, "p4", "p3");
  return resolveVote({ ...room, phase: "vote_result" });
}
