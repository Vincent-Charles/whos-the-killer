# Deployment Guide

## A. Create Free Room Storage

Create a free Redis/KV-compatible REST store. Vercel KV or Upstash Redis are the intended fit for this app.

## B. Copy Storage Values

Copy the REST URL and REST token.

## C. Configure Vercel Environment Variables

Add one of these env var pairs in Vercel Project Settings:

```bash
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

or:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## G. Create Local `.env.local`

```bash
cp .env.example .env.local
```

## H. Run The Application Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## I. Create A GitHub Repository

Create an empty GitHub repository.

## J. Push The Project To GitHub

```bash
git add .
git commit -m "Initial Who's the Killer app"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

## K. Create A Vercel Project

Go to `https://vercel.com/new`.

## L. Import The GitHub Repository Into Vercel

Select the repository and choose the Next.js preset.

## M. Configure Environment Variables In Vercel

Add `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_DEMO_MODE=false`.

## N. Deploy

Click Deploy. Vercel will install dependencies and run the production build.

## O. Open Deployed URL

Open the Vercel URL on a phone.

## P. Create A Room

Use CREATE GAME, enter your name, then share the join link.

## Q. Join From A Second Device

Open `/join/ROOMCODE` or scan the QR code.

## R. Verify Realtime Synchronization

Change readiness on one device and confirm the lobby updates on another.

## S. Install On iPhone Home Screen

Open the deployed URL in Safari, tap Share, then Add to Home Screen.

## T. Install On Android Home Screen

Open the deployed URL in Chrome, tap the menu, then Install app or Add to Home screen.

## U. Deploy Future Updates

```bash
git add .
git commit -m "Describe the update"
git push
```

## V. View Logs

Open the Vercel project, then Logs. For database/auth issues, open Supabase Logs.

## W. Roll Back A Bad Deployment

Open Vercel Deployments, select a previous successful deployment, then Promote to Production.

## X. Troubleshoot Common Deployment Problems

- Build fails: run `npm run typecheck` and `npm run test` locally.
- Rooms show `TEMP`: Redis/KV env vars are missing or invalid.
- Friend cannot join: confirm the room code exists and the Redis/KV REST token is correct.
- Lobby is stale: refresh both phones; rooms expire automatically after a few hours.
