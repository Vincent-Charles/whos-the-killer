import { chromium } from "playwright";

async function main() {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const browser = await chromium.launch({ headless: true });
  const creatorContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const friendContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await creatorContext.newPage();
  const friendPage = await friendContext.newPage();
  const consoleErrors = [];
  const trackErrors = (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  };
  page.on("console", trackErrors);
  friendPage.on("console", trackErrors);

  const results = [];
  await page.goto(`${baseUrl}/`, { waitUntil: "load" });
  results.push({
    route: "/",
    title: await page.title(),
    hasTitle: await page.getByText("WHO'S THE KILLER?").isVisible(),
    hasJoin: await page.getByText("Join Game").isVisible(),
    hasCreate: await page.getByText("Create Game").isVisible(),
    leaksModerator: await page.getByText("Moderator").count(),
    leaksRoleBoard: await page.getByText("Raghav: Killer").count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByText("Create Game").click();
  await page.waitForURL("**/create");
  results.push({
    route: "/create",
    hasCreateRoom: await page.getByRole("button", { name: "Create Room" }).isVisible(),
    hasNameInput: await page.getByLabel("Your name").isVisible(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByRole("button", { name: "Create Room" }).click();
  results.push({
    route: "/create",
    emptyNameError: await page.getByText("Enter your name first.").isVisible(),
  });

  await page.getByLabel("Your name").fill("Vincent");
  await page.getByRole("button", { name: "Create Room" }).click();
  await page.waitForURL(/\/room\/[A-Z2-9]{5}\?.*playerId=.*clientId=.*/);
  const creatorRoomUrl = new URL(page.url());
  const roomCode = creatorRoomUrl.pathname.split("/").at(-1);
  if (!roomCode) throw new Error("Could not read created room code.");
  await page.getByText("Vincent").first().waitFor({ state: "visible", timeout: 5000 });
  await page.getByText("Start Game").waitFor({ state: "visible", timeout: 5000 });
  results.push({
    route: `/room/${roomCode} creator`,
    hasRoomCode: await page.getByRole("heading", { name: roomCode }).isVisible(),
    hasPlayerName: await page.getByText("Vincent").first().isVisible(),
    hasCopy: await page.getByRole("button", { name: /Copy|Copied/ }).isVisible(),
    hasShare: await page.getByRole("button", { name: "Share" }).isVisible(),
    hasReady: await page.getByRole("button", { name: "Ready" }).isVisible(),
    hasStartGame: await page.getByText("Start Game").isVisible(),
    hasOnlyCurrentPlayer: (await page.locator("section.mt-4.grid.gap-2 > div").count()) === 1,
    noDemoPlayers: (await page.getByText("Robert").count()) === 0 && (await page.getByText("Aman").count()) === 0,
    leaksModerator: await page.getByText("Moderator").count(),
    leaksRoleBoard: await page.getByText("Raghav: Killer").count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByRole("button", { name: /Copy|Copied/ }).click();
  await page.getByRole("button", { name: "Share" }).click();
  results.push({
    route: `/room/${roomCode} creator`,
    copyClicked: await page.getByRole("button", { name: "Copied" }).isVisible(),
    shareClickedWithoutBlocking: await page.getByRole("button", { name: "Share" }).isVisible(),
  });

  await page.getByRole("button", { name: "Ready" }).click();
  await page.getByRole("button", { name: "Not Ready Yet" }).waitFor({ state: "visible", timeout: 5000 });
  await page.getByText("1 / 1").waitFor({ state: "visible", timeout: 5000 });
  results.push({
    route: `/room/${roomCode} creator`,
    readyToggled: await page.getByRole("button", { name: "Not Ready Yet" }).isVisible(),
    readyCount: await page.getByText("1 / 1").isVisible(),
  });

  await page.getByText("Start Game").click();
  await page.waitForURL("**/demo/full-round?player=Vincent");
  results.push({
    route: "/demo/full-round?player=Vincent",
    playerNameCarried: await page.getByRole("heading", { name: "Vincent" }).isVisible(),
    appMessage: await page.getByText("App Message", { exact: true }).isVisible(),
  });

  await friendPage.goto(`${baseUrl}/join/${roomCode}`, { waitUntil: "load" });
  results.push({
    route: `/join/${roomCode}`,
    hasJoinRoom: await friendPage.getByRole("button", { name: "Join Room" }).isVisible(),
    hasNameInput: await friendPage.getByLabel("Display name").isVisible(),
    horizontalOverflow: await friendPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await friendPage.getByRole("button", { name: "Join Room" }).click();
  results.push({
    route: `/join/${roomCode}`,
    emptyNameError: await friendPage.getByText("Enter your name first.").isVisible(),
  });

  await friendPage.getByLabel("Display name").fill("Robert");
  await friendPage.getByRole("button", { name: "Join Room" }).click();
  await friendPage.waitForURL(/\/room\/[A-Z2-9]{5}\?.*playerId=.*clientId=.*/);
  await friendPage.getByText("Robert").first().waitFor({ state: "visible", timeout: 5000 });
  await page.goto(creatorRoomUrl.toString(), { waitUntil: "load" });
  await page.getByText("Robert").waitFor({ state: "visible", timeout: 5000 });
  results.push({
    route: `/room/${roomCode} creator after friend join`,
    creatorSeesFriend: await page.getByText("Robert").isVisible(),
    creatorSeesTwoPlayers: (await page.locator("section.mt-4.grid.gap-2 > div").count()) === 2,
    readyCount: await page.getByText("1 / 2").isVisible(),
  });

  results.push({
    route: `/room/${roomCode} joiner`,
    hasRoomCode: await friendPage.getByRole("heading", { name: roomCode }).isVisible(),
    hasPlayerName: await friendPage.getByText("Robert").first().isVisible(),
    hasReady: await friendPage.getByRole("button", { name: "Ready" }).isVisible(),
    noStartGameForJoiner: (await friendPage.getByText("Start Game").count()) === 0,
    appRunsGame: await friendPage.getByText("Waiting for the app to start the game.").isVisible(),
    friendSeesCreator: await friendPage.getByText("Vincent").isVisible(),
    noDemoPlayers: (await friendPage.getByText("Aman").count()) === 0,
    leaksModerator: await friendPage.getByText("Moderator").count(),
    leaksRoleBoard: await friendPage.getByText("Raghav: Killer").count(),
    horizontalOverflow: await friendPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await friendPage.getByRole("button", { name: "Ready" }).click();
  await page.goto(creatorRoomUrl.toString(), { waitUntil: "load" });
  await page.getByText("2 / 2").waitFor({ state: "visible", timeout: 5000 });
  results.push({
    route: `/room/${roomCode} both ready`,
    joinerReadyToggled: await friendPage.getByRole("button", { name: "Not Ready Yet" }).isVisible(),
    creatorSeesBothReady: await page.getByText("2 / 2").isVisible(),
  });

  await page.goto(`${baseUrl}/demo/full-round`, { waitUntil: "load" });
  results.push({
    route: "/demo/full-round",
    playerView: await page.getByText("Player View").isVisible(),
    appMessage: await page.getByText("App Message", { exact: true }).isVisible(),
    gotIt: await page.getByText("Got It").isVisible(),
    leaksModerator: await page.getByText("Moderator").count(),
    leaksRoleBoard: await page.getByText("Raghav: Killer").count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByText("Got It").click();
  await page.getByRole("button", { name: "Replay App Message" }).click();
  results.push({
    route: "/demo/full-round",
    replayMessageClicked: await page.getByText("App Message", { exact: true }).isVisible(),
  });

  await page.getByText("Got It").click();
  const phases = [];
  for (let index = 0; index < 12; index += 1) {
    const phase = await page.locator("section section span").first().innerText();
    const heading = await page.locator("section section h2").first().innerText();
    const body = await page.locator("section section p").nth(1).innerText();
    const actionText = await page.locator("section section button").first().innerText();
    phases.push({ phase, heading, body, actionText });
    await page.locator("section section button").first().click();
    const dialogHeading = await page.locator("dialog h3").innerText().catch(() => "");
    const dialogBody = await page.locator("dialog p").nth(1).innerText().catch(() => "");
    phases[phases.length - 1].nextDialog = dialogHeading ? { heading: dialogHeading, body: dialogBody } : null;
    await page.getByText("Got It").click().catch(() => {});
  }

  results.push({
    route: "/demo/full-round",
    clickedSteps: phases.length,
    phases,
    finalWinVisible: await page.getByText("Village wins").isVisible(),
    finalRevealVisible: await page.getByText("Raghav was the Killer").isVisible(),
    consoleErrors,
  });

  await browser.close();
  console.log(JSON.stringify(results, null, 2));

  const failures = [];
  function collectFailures(value, path) {
    const key = path.split(".").at(-1);
    if (value === false && key !== "horizontalOverflow") failures.push(path);
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) collectFailures(child, `${path}.${key}`);
    }
  }
  collectFailures(results, "results");
  if (failures.length > 0) {
    throw new Error(`Validation failed: ${failures.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
