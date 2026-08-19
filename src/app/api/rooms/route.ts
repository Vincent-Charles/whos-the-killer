import { NextResponse } from "next/server";
import { cleanClientId, cleanDisplayName, createLobbyRoom } from "@/lib/lobby-store";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const displayName = cleanDisplayName(payload.displayName);
    const clientId = cleanClientId(payload.clientId);
    const room = await createLobbyRoom(displayName, clientId);
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create room." }, { status: 400 });
  }
}
