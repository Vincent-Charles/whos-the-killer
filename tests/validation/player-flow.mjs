import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const results = [];
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
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

  await page.goto("http://localhost:3000/demo/full-round", { waitUntil: "load" });
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
  const phases = [];
  for (let index = 0; index < 12; index += 1) {
    const phase = await page.locator("section section span").first().innerText();
    const actionText = await page.locator("section section button").first().innerText();
    phases.push({ phase, actionText });
    await page.locator("section section button").first().click();
    await page.getByText("Got It").click().catch(() => {});
  }

  results.push({
    route: "/demo/full-round",
    clickedSteps: phases.length,
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
