# Deployment Guide

## A. Create A Supabase Account

Go to `https://supabase.com`, create an account, and sign in.

## B. Create A Supabase Project

Create a new project. Choose a region near your players and save the database password securely.

## C. Enable Anonymous Authentication

Open Authentication, then Providers, then enable anonymous sign-ins.

## D. Apply Database Migrations

Open SQL Editor and run `supabase/migrations/0001_initial_schema.sql`.

## E. Configure Realtime

The migration creates a realtime publication for rooms, players, public events, and votes. Confirm Realtime is enabled in the Supabase project settings.

## F. Find Required Supabase Values

Open Project Settings, then API. Copy the Project URL, anon public key, and service_role key.

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

Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_DEMO_MODE=false`.

## N. Deploy

Click Deploy. Vercel will install dependencies and run the production build.

## O. Open Deployed URL

Open the Vercel URL on a phone.

## P. Create A Room

Use CREATE GAME once the full server-action slice is connected to Supabase.

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
- Auth fails: confirm anonymous auth is enabled.
- RLS blocks expected reads: confirm the player is joined with the current anonymous user id.
- Realtime is silent: confirm the publication exists and tables are enabled for Realtime.
