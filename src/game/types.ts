export type RoleId = "killer" | "doctor" | "sheriff" | "villager";
export type Team = "killer" | "village";

export type Phase =
  | "lobby"
  | "role_reveal"
  | "night_intro"
  | "killer_action"
  | "doctor_action"
  | "sheriff_action"
  | "night_resolution"
  | "morning_result"
  | "discussion"
  | "voting"
  | "vote_result"
  | "round_transition"
  | "game_over";

export type NightActionType = "kill" | "protect" | "investigate";

export type RoleDefinition = {
  id: RoleId;
  displayName: string;
  team: Team;
  icon: string;
  description: string;
  nightAction?: NightActionType;
  selfTarget: boolean;
  order: number;
  privateResult: "none" | "sheriff_yes_no";
  publicResult: "none" | "victim_only";
  actsWhileDead: false;
  countsForWin: boolean;
};

export type Player = {
  id: string;
  userId: string;
  name: string;
  role: RoleId;
  alive: boolean;
  ready: boolean;
  roleConfirmed: boolean;
  connected: boolean;
};

export type PublicPlayer = Omit<Player, "role" | "userId">;

export type NightAction = {
  id: string;
  round: number;
  actorPlayerId: string;
  type: NightActionType;
  targetPlayerId: string;
};

export type SheriffResult = {
  round: number;
  targetPlayerId: string;
  isKiller: boolean;
};

export type Vote = {
  round: number;
  voterPlayerId: string;
  targetPlayerId: string | null;
};

export type GameSettings = {
  doctorCanSelfSave: boolean;
  nightActionSeconds: number;
  discussionMode: "majority_ready" | "everyone_ready" | "discussion_timer";
};

export type RoomState = {
  id: string;
  code: string;
  phase: Phase;
  round: number;
  settings: GameSettings;
  players: Player[];
  actions: NightAction[];
  votes: Vote[];
  sheriffResults: Record<string, SheriffResult[]>;
  eliminatedThisRound?: string;
  nightVictimId?: string | null;
  winner?: Team;
};

export type PublicRoomState = Omit<
  RoomState,
  "players" | "actions" | "votes" | "sheriffResults"
> & {
  players: PublicPlayer[];
  livingCount: number;
  readyToVoteCount: number;
};
