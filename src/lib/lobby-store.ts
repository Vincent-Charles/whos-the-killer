import { gameConfig, roomCodeAlphabet } from "@/config/game";

const roomTtlSeconds = 60 * 60 * 6;

export type LobbyPlayer = {
  id: string;
  displayName: string;
  ready: boolean;
  connected: boolean;
  joinedAt: string;
};

export type LobbyRoom = {
  id: string;
  code: string;
  phase: "lobby";
  isCreator: boolean;
  storage: "redis" | "temporary";
  players: LobbyPlayer[];
};

type StoredPlayer = LobbyPlayer & {
  clientId: string;
};

type StoredRoom = {
  id: string;
  code: string;
  phase: "lobby";
  creatorClientId: string;
  players: StoredPlayer[];
  createdAt: string;
  updatedAt: string;
};

const memoryStore = globalThis as typeof globalThis & {
  whoIsTheKillerRooms?: Map<string, StoredRoom>;
};

function getMemoryRooms() {
  memoryStore.whoIsTheKillerRooms ??= new Map();
  return memoryStore.whoIsTheKillerRooms;
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { token, url };
}

function roomKey(code: string) {
  return `whos-the-killer:room:${code}`;
}

function generateRoomCode() {
  let code = "";
  for (let index = 0; index < 5; index += 1) {
    code += roomCodeAlphabet[Math.floor(Math.random() * roomCodeAlphabet.length)];
  }
  return code;
}

export function cleanDisplayName(value: unknown) {
  if (typeof value !== "string") throw new Error("Name is required.");
  const name = value.trim().replace(/\s+/g, " ").slice(0, 32);
  if (!name) throw new Error("Name is required.");
  return name;
}

export function cleanClientId(value: unknown) {
  if (typeof value !== "string" || !/^[0-9a-f-]{36}$/i.test(value)) {
    throw new Error("Player session is missing.");
  }
  return value;
}

function publicRoom(room: StoredRoom, clientId: string, storage: LobbyRoom["storage"]): LobbyRoom {
  return {
    id: room.id,
    code: room.code,
    phase: room.phase,
    isCreator: room.creatorClientId === clientId,
    storage,
    players: room.players.map((player) => ({
      id: player.id,
      displayName: player.displayName,
      ready: player.ready,
      connected: player.connected,
      joinedAt: player.joinedAt,
    })),
  };
}

async function redisCommand<T>(command: unknown[]) {
  const config = getRedisConfig();
  if (!config) throw new Error("Redis storage is not configured.");

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const payload = (await response.json()) as { result?: T; error?: string };
  if (!response.ok || payload.error) throw new Error(payload.error ?? "Redis request failed.");
  return payload.result;
}

async function getRedisStoredRoom(code: string) {
  const value = await redisCommand<string | null>(["GET", roomKey(code)]);
  if (!value) return null;
  return JSON.parse(value) as StoredRoom;
}

async function saveRedisStoredRoom(room: StoredRoom) {
  await redisCommand<"OK">(["SET", roomKey(room.code), JSON.stringify(room), "EX", roomTtlSeconds]);
}

function getMemoryStoredRoom(code: string) {
  return getMemoryRooms().get(code) ?? null;
}

function saveMemoryStoredRoom(room: StoredRoom) {
  getMemoryRooms().set(room.code, room);
}

async function getStoredRoom(code: string) {
  if (getRedisConfig()) return { room: await getRedisStoredRoom(code), storage: "redis" as const };
  return { room: getMemoryStoredRoom(code), storage: "temporary" as const };
}

async function saveStoredRoom(room: StoredRoom) {
  if (getRedisConfig()) {
    await saveRedisStoredRoom(room);
    return "redis" as const;
  }
  saveMemoryStoredRoom(room);
  return "temporary" as const;
}

function createStoredRoom(code: string, displayName: string, clientId: string): StoredRoom {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    code,
    phase: "lobby",
    creatorClientId: clientId,
    createdAt: now,
    updatedAt: now,
    players: [
      {
        id: crypto.randomUUID(),
        clientId,
        displayName,
        ready: false,
        connected: true,
        joinedAt: now,
      },
    ],
  };
}

function upsertPlayer(room: StoredRoom, displayName: string, clientId: string) {
  const taken = room.players.some((player) => player.clientId !== clientId && player.displayName.toLowerCase() === displayName.toLowerCase());
  if (taken) throw new Error("That name is already in this room.");

  const existing = room.players.find((player) => player.clientId === clientId);
  if (existing) {
    existing.displayName = displayName;
    existing.connected = true;
    room.updatedAt = new Date().toISOString();
    return existing;
  }

  if (room.players.length >= gameConfig.maxPlayers) throw new Error("This room is full.");
  const player = {
    id: crypto.randomUUID(),
    clientId,
    displayName,
    ready: false,
    connected: true,
    joinedAt: new Date().toISOString(),
  };
  room.players.push(player);
  room.updatedAt = new Date().toISOString();
  return player;
}

export async function getLobbyRoom(code: string, clientId: string) {
  const { room, storage } = await getStoredRoom(code);
  if (!room) return null;
  return publicRoom(room, clientId, storage);
}

export async function createLobbyRoom(displayName: string, clientId: string) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateRoomCode();
    const existing = await getStoredRoom(code);
    if (existing.room) continue;
    const room = createStoredRoom(code, displayName, clientId);
    const storage = await saveStoredRoom(room);
    return publicRoom(room, clientId, storage);
  }

  throw new Error("Could not create a room code. Try again.");
}

export async function joinLobbyRoom(code: string, displayName: string, clientId: string) {
  const { room, storage } = await getStoredRoom(code);
  if (!room) return null;
  upsertPlayer(room, displayName, clientId);
  await saveStoredRoom(room);
  return publicRoom(room, clientId, storage);
}

export async function setLobbyReady(code: string, clientId: string, ready: boolean) {
  const { room, storage } = await getStoredRoom(code);
  const player = room?.players.find((candidate) => candidate.clientId === clientId);
  if (!room || !player) return null;
  player.ready = ready;
  room.updatedAt = new Date().toISOString();
  await saveStoredRoom(room);
  return publicRoom(room, clientId, storage);
}
