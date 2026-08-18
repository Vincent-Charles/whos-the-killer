# WHO'S THE KILLER?

A no-host multiplayer social deduction party game inspired by Mafia. The application acts as the Game Master: it creates rooms, assigns roles, runs night phases, resolves actions, pauses for real-world discussion, counts votes, and reveals roles only when the game ends.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase Auth, Postgres, Row Level Security, Realtime
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

## Supabase Setup

1. Create a Supabase project.
2. Open Authentication, then Providers.
3. Enable anonymous sign-ins.
4. Open SQL Editor.
5. Run `supabase/migrations/0001_initial_schema.sql`.
6. Copy the project URL, anon key, and service role key.
7. Create `.env.local` from `.env.example`.

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

Deploy the Next.js app to Vercel and the database/auth layer to Supabase. See `DEPLOYMENT.md` for exact steps.

## Current Limitations

- The first implementation contains the secure domain engine, schema, RLS, PWA shell, demo flow, and tests.
- Full Supabase server actions/RPC functions for every room operation are still the next implementation slice.
- Manual browser security testing requires a live Supabase project and deployed or local environment.
