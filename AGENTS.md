# AGENTS.md

## Purpose

Build and maintain `WHO'S THE KILLER?`, a no-host multiplayer social deduction party game. The app is the Game Master; every player, including the room creator, becomes an ordinary player after the game starts.

## Critical Rules

- No human host during gameplay.
- Backend authority owns phase transitions, role assignment, action validation, night resolution, vote resolution, and win detection.
- Never send all roles, night actions, or sheriff results to every client.
- A player may read only their own role.
- Sheriff receives only YES or NO.
- Doctor never learns the Killer target.
- Dead Doctor and Sheriff phases still appear and should use safe timing.
- Non-killer eliminated roles remain secret.
- Discussion is a real-world pause; majority READY TO VOTE starts voting by default.
- Dead players cannot act, vote, or ready for voting.
- All roles reveal only after game over.

## Important Files

- `src/config/game.ts`: central product configuration.
- `src/game/types.ts`: shared domain types.
- `src/game/engine.ts`: state machine and authoritative rule helpers.
- `src/game/roles.ts`: role definitions and extensibility point.
- `src/game/narrator.ts`: narrator message selection.
- `src/game/statistics.ts`: statistics and awards.
- `supabase/migrations/0001_initial_schema.sql`: database, RLS, and realtime publication.
- `tests/`: unit and acceptance coverage.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Database

Apply migrations in Supabase SQL Editor or with the Supabase CLI. Anonymous auth must be enabled. Browser clients use the anon key only. The service role key belongs only in server-side environments.

## Coding Standards

- Keep game rules in testable TypeScript modules.
- Keep UI components small and mobile-first.
- Avoid `any`.
- Add runtime validation for external input.
- Do not add secret data to public realtime payloads.
- Do not log roles, private sheriff results, auth tokens, or sensitive night action payloads.

## Do Not Change Casually

- RLS policies around `player_roles`, `night_actions`, and `sheriff_results`.
- The state machine phase order.
- The dead Doctor/Sheriff illusion.
- Sheriff result semantics.
- Role reveal timing and privacy boundaries.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
