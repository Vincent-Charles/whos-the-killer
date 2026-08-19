import { NextResponse } from "next/server";
import { cleanClientId, cleanDisplayName, joinLobbyRoom } from "@/lib/lobby-store";

type JoinRouteContext = {
  params: Promise<{ code: string }>;
};

export async function POST(request: Request, { params }: JoinRouteContext) {
  try {
    const { code } = await params;
    const body: unknown = await request.json();
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const displayName = cleanDisplayName(payload.displayName);
    const clientId = cleanClientId(payload.clientId);
    const room = await joinLobbyRoom(code.toUpperCase(), displayName, clientId);
    if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not join room." }, { status: 400 });
  }
}
