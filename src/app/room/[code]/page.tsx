import { RoomLobby } from "@/components/room-lobby";

type RoomPageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ clientId?: string; player?: string; playerId?: string }>;
};

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { code } = await params;
  const query = await searchParams;
  const playerName = query.player?.trim() || "Player";

  return <RoomLobby code={code.toUpperCase()} clientId={query.clientId} fallbackPlayerName={playerName} playerId={query.playerId} />;
}
