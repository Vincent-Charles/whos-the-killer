import { RoomLobby } from "@/components/room-lobby";

type RoomPageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ player?: string; creator?: string }>;
};

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { code } = await params;
  const query = await searchParams;
  const playerName = query.player?.trim() || "Player";
  const isCreator = query.creator === "1";

  return <RoomLobby code={code.toUpperCase()} playerName={playerName} isCreator={isCreator} />;
}
