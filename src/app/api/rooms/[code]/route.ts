import { NextResponse } from "next/server";
import { cleanClientId, getLobbyRoom } from "@/lib/lobby-store";

type RoomRouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, { params }: RoomRouteContext) {
  try {
    const { code } = await params;
    const url = new URL(request.url);
    const clientId = cleanClientId(url.searchParams.get("clientId"));
    const room = await getLobbyRoom(code.toUpperCase(), clientId);
    if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load room." }, { status: 400 });
  }
}
