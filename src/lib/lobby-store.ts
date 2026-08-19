import { gameConfig, roomCodeAlphabet } from "@/config/game";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

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
  phase: string;
  isCreator: boolean;
  storage: "supabase" | "temporary";
  players: LobbyPlayer[];
};

type RoomRow = {
  id: string;
  code: string;
  phase: string;
  creator_user_id: string;
};

type PlayerRow = {
  id: string;
  display_name: string;
  ready: boolean;
  connected: boolean;
  joined_at: string;
};

type MemoryRoom = RoomRow & {
  players: Map<string, LobbyPlayer & { userId: string }>;
};

const memoryStore = globalThis as typeof globalThis & {
  whoIsTheKillerRooms?: Map<string, MemoryRoom>;
};

function getMemoryRooms() {
  memoryStore.whoIsTheKillerRooms ??= new Map();
  return memoryStore.whoIsTheKillerRooms;
}

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
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

function formatRoom(room: RoomRow, players: PlayerRow[], clientId: string, storage: LobbyRoom["storage"]): LobbyRoom {
  return {
    id: room.id,
    code: room.code,
    phase: room.phase,
    isCreator: room.creator_user_id === clientId,
    storage,
    players: players.map((player) => ({
      id: player.id,
      displayName: player.display_name,
      ready: player.ready,
      connected: player.connected,
      joinedAt: player.joined_at,
    })),
  };
}

async function getSupabaseRoom(code: string, clientId: string) {
  const supabase = createServiceSupabaseClient();
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, phase, creator_user_id")
    .eq("code", code)
    .maybeSingle<RoomRow>();

  if (roomError) throw new Error(roomError.message);
  if (!room) return null;

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, display_name, ready, connected, joined_at")
    .eq("room_id", room.id)
    .order("joined_at", { ascending: true })
    .returns<PlayerRow[]>();

  if (playersError) throw new Error(playersError.message);
  return formatRoom(room, players ?? [], clientId, "supabase");
}

function getTemporaryRoom(code: string, clientId: string) {
  const room = getMemoryRooms().get(code);
  if (!room) return null;
  const players = Array.from(room.players.values()).map((player) => ({
    id: player.id,
    display_name: player.displayName,
    ready: player.ready,
    connected: player.connected,
    joined_at: player.joinedAt,
  }));
  return formatRoom(room, players, clientId, "temporary");
}

export async function getLobbyRoom(code: string, clientId: string) {
  if (hasSupabaseConfig()) return getSupabaseRoom(code, clientId);
  return getTemporaryRoom(code, clientId);
}

export async function createLobbyRoom(displayName: string, clientId: string) {
  if (!hasSupabaseConfig()) {
    const code = generateRoomCode();
    const room: MemoryRoom = {
      id: crypto.randomUUID(),
      code,
      phase: "lobby",
      creator_user_id: clientId,
      players: new Map(),
    };
    room.players.set(clientId, {
      id: crypto.randomUUID(),
      userId: clientId,
      displayName,
      ready: false,
      connected: true,
      joinedAt: new Date().toISOString(),
    });
    getMemoryRooms().set(code, room);
    return getTemporaryRoom(code, clientId);
  }

  const supabase = createServiceSupabaseClient();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateRoomCode();
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ code, creator_user_id: clientId, settings: { maxPlayers: gameConfig.maxPlayers } })
      .select("id, code, phase, creator_user_id")
      .single<RoomRow>();

    if (roomError) {
      if (roomError.code === "23505") continue;
      throw new Error(roomError.message);
    }

    const { error: playerError } = await supabase.from("players").insert({
      room_id: room.id,
      user_id: clientId,
      display_name: displayName,
    });

    if (playerError) throw new Error(playerError.message);
    return getSupabaseRoom(code, clientId);
  }

  throw new Error("Could not create a room code. Try again.");
}

export async function joinLobbyRoom(code: string, displayName: string, clientId: string) {
  if (!hasSupabaseConfig()) {
    const room = getMemoryRooms().get(code);
    if (!room) return null;
    const taken = Array.from(room.players.values()).some(
      (player) => player.userId !== clientId && player.displayName.toLowerCase() === displayName.toLowerCase(),
    );
    if (taken) throw new Error("That name is already in this room.");
    room.players.set(clientId, {
      id: room.players.get(clientId)?.id ?? crypto.randomUUID(),
      userId: clientId,
      displayName,
      ready: room.players.get(clientId)?.ready ?? false,
      connected: true,
      joinedAt: room.players.get(clientId)?.joinedAt ?? new Date().toISOString(),
    });
    return getTemporaryRoom(code, clientId);
  }

  const supabase = createServiceSupabaseClient();
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, phase, creator_user_id")
    .eq("code", code)
    .maybeSingle<RoomRow>();

  if (roomError) throw new Error(roomError.message);
  if (!room) return null;

  const { error: playerError } = await supabase.from("players").upsert(
    {
      room_id: room.id,
      user_id: clientId,
      display_name: displayName,
      connected: true,
    },
    { onConflict: "room_id,user_id" },
  );

  if (playerError) {
    if (playerError.code === "23505") throw new Error("That name is already in this room.");
    throw new Error(playerError.message);
  }

  return getSupabaseRoom(code, clientId);
}

export async function setLobbyReady(code: string, clientId: string, ready: boolean) {
  if (!hasSupabaseConfig()) {
    const room = getMemoryRooms().get(code);
    const player = room?.players.get(clientId);
    if (!room || !player) return null;
    player.ready = ready;
    return getTemporaryRoom(code, clientId);
  }

  const supabase = createServiceSupabaseClient();
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, phase, creator_user_id")
    .eq("code", code)
    .maybeSingle<RoomRow>();

  if (roomError) throw new Error(roomError.message);
  if (!room) return null;

  const { error: playerError } = await supabase
    .from("players")
    .update({ ready })
    .eq("room_id", room.id)
    .eq("user_id", clientId);

  if (playerError) throw new Error(playerError.message);
  return getSupabaseRoom(code, clientId);
}
