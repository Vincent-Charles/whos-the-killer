import { PlayerRoundDemo } from "@/components/player-round-demo";

export default async function FullRoundDemo({ searchParams }: { searchParams: Promise<{ player?: string }> }) {
  const query = await searchParams;
  return <PlayerRoundDemo playerName={query.player?.trim() || "Vincent"} />;
}
