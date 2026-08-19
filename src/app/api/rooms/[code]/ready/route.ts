import { NextResponse } from "next/server";
import { cleanClientId, setLobbyReady } from "@/lib/lobby-store";

type ReadyRouteContext = {
  params: Promise<{ code: string }>;
};

export async function PATCH(request: Request, { params }: ReadyRouteContext) {
  try {
    const { code } = await params;
    const body: unknown = await request.json();
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const clientId = cleanClientId(payload.clientId);
    const ready = payload.ready === true;
    const room = await setLobbyReady(code.toUpperCase(), clientId, ready);
    if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update readiness." }, { status: 400 });
  }
}
