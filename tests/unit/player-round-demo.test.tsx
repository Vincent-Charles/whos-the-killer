import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerRoundDemo } from "@/components/player-round-demo";

describe("player round demo", () => {
  it("starts as a minimal player screen with an app dialog", () => {
    render(<PlayerRoundDemo />);

    expect(screen.getByText("Player View")).toBeTruthy();
    expect(screen.getByText("App Message")).toBeTruthy();
    expect(screen.getByText("Got It")).toBeTruthy();
    expect(screen.queryByText("Moderator")).toBeNull();
    expect(screen.queryByText("Raghav: Killer")).toBeNull();
    expect(screen.queryByText("Aman: Doctor")).toBeNull();
  });
});
