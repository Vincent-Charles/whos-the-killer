import type { RoomState } from "./types";

export type PlayerStats = {
  playerId: string;
  votesCast: number;
  votesReceived: number;
  targetedByKiller: number;
  successfulSaves: number;
};

export type Award = {
  title: string;
  playerId: string;
  reason: string;
};

export function calculateStats(room: RoomState): PlayerStats[] {
  return room.players.map((player) => {
    const votesCast = room.votes.filter((vote) => vote.voterPlayerId === player.id).length;
    const votesReceived = room.votes.filter((vote) => vote.targetPlayerId === player.id).length;
    const targetedByKiller = room.actions.filter((action) => action.type === "kill" && action.targetPlayerId === player.id).length;
    const saves = room.actions.filter((action) => action.type === "protect" && action.targetPlayerId === player.id);
    const successfulSaves = saves.filter((save) =>
      room.actions.some((action) => action.round === save.round && action.type === "kill" && action.targetPlayerId === save.targetPlayerId),
    ).length;
    return { playerId: player.id, votesCast, votesReceived, targetedByKiller, successfulSaves };
  });
}

export function generateAwards(room: RoomState): Award[] {
  const stats = calculateStats(room);
  const awards: Award[] = [];
  const mostTargeted = [...stats].sort((a, b) => b.targetedByKiller - a.targetedByKiller)[0];
  const topVotes = [...stats].sort((a, b) => b.votesReceived - a.votesReceived)[0];
  const doctor = room.players.find((player) => player.role === "doctor");
  const killer = room.players.find((player) => player.role === "killer");
  if (killer) awards.push({ title: "Professional Liar", playerId: killer.id, reason: "Made everyone work for the truth." });
  if (doctor) awards.push({ title: "Doctor Of The Year", playerId: doctor.id, reason: "Owned the medical clipboard, real or imagined." });
  if (mostTargeted?.targetedByKiller) awards.push({ title: "Human Shield", playerId: mostTargeted.playerId, reason: "Targeted most often at night." });
  if (topVotes?.votesReceived) awards.push({ title: "Most Suspicious", playerId: topVotes.playerId, reason: "Collected the most votes." });
  return awards;
}
