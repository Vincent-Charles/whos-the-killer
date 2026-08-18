import { gameConfig } from "@/config/game";
import { roleDefinitions } from "./roles";
import { shuffle, type RandomSource } from "./random";
import type { NightAction, NightActionType, Phase, Player, PublicRoomState, RoleId, RoomState, Vote } from "./types";

const phaseOrder: Phase[] = [
  "lobby",
  "role_reveal",
  "night_intro",
  "killer_action",
  "doctor_action",
  "sheriff_action",
  "night_resolution",
  "morning_result",
  "discussion",
  "voting",
  "vote_result",
  "round_transition",
  "game_over",
];

export function createRoomCode(random: RandomSource = Math.random, size = 5): string {
  let code = "";
  for (let index = 0; index < size; index += 1) {
    code += "23456789ABCDEFGHJKMNPQRSTUVWXYZ"[Math.floor(random() * 32)];
  }
  return code;
}

export function validateTransition(from: Phase, to: Phase): boolean {
  if (from === "game_over") return false;
  if (from === "round_transition" && to === "night_intro") return true;
  return phaseOrder[phaseOrder.indexOf(from) + 1] === to;
}

export function assignRoles(
  players: Omit<Player, "role">[],
  counts: Partial<Record<RoleId, number>>,
  random: RandomSource = Math.random,
): Player[] {
  const killerCount = counts.killer ?? gameConfig.defaultRoleCounts.killer;
  const doctorCount = counts.doctor ?? gameConfig.defaultRoleCounts.doctor;
  const sheriffCount = counts.sheriff ?? gameConfig.defaultRoleCounts.sheriff;
  const villagerCount = players.length - killerCount - doctorCount - sheriffCount;
  if (players.length < gameConfig.minPlayers) throw new Error("Minimum player count not met.");
  if (killerCount < 1 || doctorCount < 0 || sheriffCount < 0 || villagerCount < 0) {
    throw new Error("Invalid role configuration.");
  }
  const roles: RoleId[] = [
    ...Array.from({ length: killerCount }, () => "killer" as const),
    ...Array.from({ length: doctorCount }, () => "doctor" as const),
    ...Array.from({ length: sheriffCount }, () => "sheriff" as const),
    ...Array.from({ length: villagerCount }, () => "villager" as const),
  ];
  return shuffle(roles, random).map((role, index) => ({ ...players[index], role }));
}

export function publicProjection(room: RoomState): PublicRoomState {
  const living = room.players.filter((player) => player.alive);
  const safePlayers = room.players.map((player) => ({
    id: player.id,
    name: player.name,
    alive: player.alive,
    ready: player.ready,
    roleConfirmed: player.roleConfirmed,
    connected: player.connected,
  }));
  return {
    id: room.id,
    code: room.code,
    phase: room.phase,
    round: room.round,
    settings: room.settings,
    players: safePlayers,
    eliminatedThisRound: room.eliminatedThisRound,
    nightVictimId: room.nightVictimId,
    winner: room.winner,
    livingCount: living.length,
    readyToVoteCount: living.filter((player) => player.ready).length,
  };
}

export function getPrivateRole(room: RoomState, playerId: string): RoleId | null {
  return room.players.find((player) => player.id === playerId)?.role ?? null;
}

export function submitNightAction(
  room: RoomState,
  actorPlayerId: string,
  type: NightActionType,
  targetPlayerId: string,
): RoomState {
  const actor = room.players.find((player) => player.id === actorPlayerId);
  const target = room.players.find((player) => player.id === targetPlayerId);
  const requiredPhase: Record<NightActionType, Phase> = {
    kill: "killer_action",
    protect: "doctor_action",
    investigate: "sheriff_action",
  };
  const requiredRole: Record<NightActionType, RoleId> = {
    kill: "killer",
    protect: "doctor",
    investigate: "sheriff",
  };
  if (!actor || !target) throw new Error("Unknown player.");
  if (room.phase !== requiredPhase[type]) throw new Error("Wrong phase.");
  if (!actor.alive) throw new Error("Dead players cannot act.");
  if (actor.role !== requiredRole[type]) throw new Error("Unauthorized action.");
  if (!target.alive) throw new Error("Target must be alive.");
  const definition = roleDefinitions[actor.role];
  if (!definition.selfTarget && actor.id === target.id) throw new Error("Self target is not allowed.");
  if (type === "protect" && !room.settings.doctorCanSelfSave && actor.id === target.id) {
    throw new Error("Doctor self save is disabled.");
  }
  if (room.actions.some((action) => action.round === room.round && action.actorPlayerId === actor.id && action.type === type)) {
    throw new Error("Duplicate action.");
  }
  const action: NightAction = {
    id: `${room.round}-${actor.id}-${type}`,
    round: room.round,
    actorPlayerId: actor.id,
    type,
    targetPlayerId: target.id,
  };
  const nextRoom = { ...room, actions: [...room.actions, action] };
  if (type === "investigate") {
    const history = nextRoom.sheriffResults[actor.id] ?? [];
    nextRoom.sheriffResults = {
      ...nextRoom.sheriffResults,
      [actor.id]: [...history, { round: room.round, targetPlayerId, isKiller: target.role === "killer" }],
    };
  }
  return nextRoom;
}

export function resolveNight(room: RoomState): RoomState {
  if (room.phase !== "night_resolution") throw new Error("Wrong phase.");
  const kill = room.actions.find((action) => action.round === room.round && action.type === "kill");
  const protect = room.actions.find((action) => action.round === room.round && action.type === "protect");
  const victimId = kill && kill.targetPlayerId !== protect?.targetPlayerId ? kill.targetPlayerId : null;
  return {
    ...room,
    nightVictimId: victimId,
    players: room.players.map((player) => (player.id === victimId ? { ...player, alive: false } : player)),
  };
}

export function submitDiscussionReady(room: RoomState, playerId: string, ready: boolean): RoomState {
  const player = room.players.find((candidate) => candidate.id === playerId);
  if (room.phase !== "discussion") throw new Error("Wrong phase.");
  if (!player?.alive) throw new Error("Only living players can ready.");
  const players = room.players.map((candidate) => (candidate.id === playerId ? { ...candidate, ready } : candidate));
  const living = players.filter((candidate) => candidate.alive);
  const readyCount = living.filter((candidate) => candidate.ready).length;
  const threshold = room.settings.discussionMode === "everyone_ready" ? living.length : Math.floor(living.length / 2) + 1;
  return { ...room, players, phase: readyCount >= threshold ? "voting" : room.phase };
}

export function submitVote(room: RoomState, voterPlayerId: string, targetPlayerId: string | null): RoomState {
  const voter = room.players.find((player) => player.id === voterPlayerId);
  const target = targetPlayerId ? room.players.find((player) => player.id === targetPlayerId) : null;
  if (room.phase !== "voting") throw new Error("Wrong phase.");
  if (!voter?.alive) throw new Error("Dead players cannot vote.");
  if (targetPlayerId && !target?.alive) throw new Error("Target must be a living player.");
  if (room.votes.some((vote) => vote.round === room.round && vote.voterPlayerId === voterPlayerId)) {
    throw new Error("Duplicate vote.");
  }
  const vote: Vote = { round: room.round, voterPlayerId, targetPlayerId };
  return { ...room, votes: [...room.votes, vote] };
}

export function resolveVote(room: RoomState): RoomState {
  if (room.phase !== "vote_result") throw new Error("Wrong phase.");
  const counts = new Map<string, number>();
  room.votes
    .filter((vote) => vote.round === room.round && vote.targetPlayerId)
    .forEach((vote) => counts.set(vote.targetPlayerId as string, (counts.get(vote.targetPlayerId as string) ?? 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const eliminatedId = sorted.length > 0 && sorted[0][1] !== sorted[1]?.[1] ? sorted[0][0] : undefined;
  const eliminated = room.players.find((player) => player.id === eliminatedId);
  const winner = eliminated?.role === "killer" ? "village" : undefined;
  return {
    ...room,
    eliminatedThisRound: eliminatedId,
    winner,
    phase: winner ? "game_over" : "round_transition",
    players: room.players.map((player) => (player.id === eliminatedId ? { ...player, alive: false } : { ...player, ready: false })),
  };
}

export function nextRound(room: RoomState): RoomState {
  if (room.phase !== "round_transition") throw new Error("Wrong phase.");
  return {
    ...room,
    round: room.round + 1,
    phase: "night_intro",
    eliminatedThisRound: undefined,
    nightVictimId: undefined,
  };
}
