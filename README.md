# WHO'S THE KILLER?

A no-host multiplayer social deduction party game inspired by Mafia. The application acts as the Game Master: it creates rooms, assigns roles, runs night phases, resolves actions, pauses for real-world discussion, counts votes, and reveals roles only when the game ends.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Anonymous short-lived room storage with Redis/KV-compatible REST
- Vitest and Testing Library for automated tests
- Vercel for deployment

## Rules In Version 1

- Roles: Killer, Doctor, Sheriff, Villager
- Sheriff receives only YES or NO
- Doctor never sees the Killer target
- Non-killer eliminations do not reveal roles
- Dead Doctor and Sheriff phases still run to preserve uncertainty
- Discussion has no timer by default; majority READY TO VOTE starts voting
- Eliminating the Killer ends the game and reveals every role

## Install

Install Node.js 24 LTS or newer from `https://nodejs.org/`.

```bash
npm install
```

## Shared Room Storage

Players do not need accounts. The app creates anonymous room codes and stores lobby state for a few hours.

Use a free Redis/KV-compatible REST store such as Vercel KV or Upstash Redis, then add these env vars:

```bash
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

The app also accepts Upstash's native names:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

For local development without env vars, the app uses temporary in-memory rooms. That is fine for one-machine testing, but not reliable for friends joining from phones.

```bash
cp .env.example .env.local
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Mode

The home page currently includes a deterministic six-player demo based on the acceptance scenario:

- Vincent: Sheriff
- Robert: Villager
- Aman: Doctor
- Raghav: Killer
- Suzil: Villager
- John: Villager

## Verify

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

Deploy the Next.js app to Vercel and add Redis/KV REST env vars for reliable shared rooms.

## Current Limitations

- The first implementation contains the secure domain engine, schema, RLS, PWA shell, demo flow, and tests.
- The lobby is anonymous and short-lived; there are no player accounts or saved stats.
- Full gameplay persistence beyond the lobby is still the next implementation slice.
