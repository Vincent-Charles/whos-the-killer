export const gameConfig = {
  title: "WHO'S THE KILLER?",
  minPlayers: 5,
  maxPlayers: 20,
  defaultRoleCounts: {
    killer: 1,
    doctor: 1,
    sheriff: 1,
  },
  defaultNightActionSeconds: 30,
  voteSeconds: 30,
  discussionMode: "majority_ready",
  doctorCanSelfSave: true,
  tieBehavior: "single_runoff_then_no_elimination",
  phaseMinimumMs: {
    killer_action: 12000,
    doctor_action: 12000,
    sheriff_action: 12000,
  },
  humorLevel: "medium",
  soundDefault: false,
  hapticsDefault: true,
} as const;

export const confusingRoomCodeCharacters = new Set(["0", "O", "1", "I", "L"]);
export const roomCodeAlphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
