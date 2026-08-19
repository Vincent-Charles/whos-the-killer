import { chromium } from "playwright";

async function main() {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

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
  await page.waitForURL("**/room/K7R4Q?player=Vincent&creator=1");
  results.push({
    route: "/room/K7R4Q creator",
    hasRoomCode: await page.getByRole("heading", { name: "K7R4Q" }).isVisible(),
    hasPlayerName: await page.getByText("Vincent").first().isVisible(),
    hasCopy: await page.getByRole("button", { name: /Copy|Copied/ }).isVisible(),
    hasShare: await page.getByRole("button", { name: "Share" }).isVisible(),
    hasReady: await page.getByRole("button", { name: "Ready" }).isVisible(),
    hasStartGame: await page.getByText("Start Game").isVisible(),
    leaksModerator: await page.getByText("Moderator").count(),
    leaksRoleBoard: await page.getByText("Raghav: Killer").count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByRole("button", { name: /Copy|Copied/ }).click();
  await page.getByRole("button", { name: "Share" }).click();
  results.push({
    route: "/room/K7R4Q creator",
    copyClicked: await page.getByRole("button", { name: "Copied" }).isVisible(),
    shareClickedWithoutBlocking: await page.getByRole("button", { name: "Share" }).isVisible(),
  });

  await page.getByRole("button", { name: "Ready" }).click();
  results.push({
    route: "/room/K7R4Q creator",
    readyToggled: await page.getByRole("button", { name: "Not Ready Yet" }).isVisible(),
    readyCount: await page.getByText("5 / 6").isVisible(),
  });

  await page.getByText("Start Game").click();
  await page.waitForURL("**/demo/full-round?player=Vincent");
  results.push({
    route: "/demo/full-round?player=Vincent",
    playerNameCarried: await page.getByRole("heading", { name: "Vincent" }).isVisible(),
    appMessage: await page.getByText("App Message", { exact: true }).isVisible(),
  });

  await page.goto(`${baseUrl}/join/K7R4Q`, { waitUntil: "load" });
  results.push({
    route: "/join/K7R4Q",
    hasJoinRoom: await page.getByRole("button", { name: "Join Room" }).isVisible(),
    hasNameInput: await page.getByLabel("Display name").isVisible(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByRole("button", { name: "Join Room" }).click();
  results.push({
    route: "/join/K7R4Q",
    emptyNameError: await page.getByText("Enter your name first.").isVisible(),
  });

  await page.getByLabel("Display name").fill("Robert");
  await page.getByRole("button", { name: "Join Room" }).click();
  await page.waitForURL("**/room/K7R4Q?player=Robert");
  results.push({
    route: "/room/K7R4Q joiner",
    hasRoomCode: await page.getByRole("heading", { name: "K7R4Q" }).isVisible(),
    hasPlayerName: await page.getByText("Robert").first().isVisible(),
    hasReady: await page.getByRole("button", { name: "Ready" }).isVisible(),
    noStartGameForJoiner: (await page.getByText("Start Game").count()) === 0,
    appRunsGame: await page.getByText("Waiting for the app to start the game.").isVisible(),
    leaksModerator: await page.getByText("Moderator").count(),
    leaksRoleBoard: await page.getByText("Raghav: Killer").count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  });

  await page.getByRole("button", { name: "Ready" }).click();
  results.push({
    route: "/room/K7R4Q joiner",
    readyToggled: await page.getByRole("button", { name: "Not Ready Yet" }).isVisible(),
    readyCount: await page.getByText("5 / 6").isVisible(),
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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
