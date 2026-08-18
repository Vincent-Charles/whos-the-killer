create extension if not exists pgcrypto;

create type public.game_phase as enum (
  'lobby',
  'role_reveal',
  'night_intro',
  'killer_action',
  'doctor_action',
  'sheriff_action',
  'night_resolution',
  'morning_result',
  'discussion',
  'voting',
  'vote_result',
  'round_transition',
  'game_over'
);

create type public.role_id as enum ('killer', 'doctor', 'sheriff', 'villager');
create type public.night_action_type as enum ('kill', 'protect', 'investigate');

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z2-9]{5,6}$'),
  creator_user_id uuid not null,
  phase public.game_phase not null default 'lobby',
  round integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  winner text check (winner in ('killer', 'village')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days'
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null,
  display_name text not null check (char_length(display_name) between 1 and 32),
  alive boolean not null default true,
  ready boolean not null default false,
  role_confirmed boolean not null default false,
  connected boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create unique index players_room_display_name_lower_idx on public.players (room_id, lower(display_name));

create table public.player_roles (
  player_id uuid primary key references public.players(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  role public.role_id not null,
  assigned_at timestamptz not null default now()
);

create table public.night_actions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round integer not null,
  actor_player_id uuid not null references public.players(id) on delete cascade,
  action_type public.night_action_type not null,
  target_player_id uuid not null references public.players(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (room_id, round, actor_player_id, action_type)
);

create table public.sheriff_results (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round integer not null,
  sheriff_player_id uuid not null references public.players(id) on delete cascade,
  target_player_id uuid not null references public.players(id) on delete cascade,
  is_killer boolean not null,
  created_at timestamptz not null default now(),
  unique (room_id, round, sheriff_player_id, target_player_id)
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round integer not null,
  voter_player_id uuid not null references public.players(id) on delete cascade,
  target_player_id uuid references public.players(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (room_id, round, voter_player_id)
);

create table public.game_events (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round integer not null,
  event_type text not null,
  public_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.player_roles enable row level security;
alter table public.night_actions enable row level security;
alter table public.sheriff_results enable row level security;
alter table public.votes enable row level security;
alter table public.game_events enable row level security;

create policy "room members can read room" on public.rooms
  for select using (
    exists (select 1 from public.players p where p.room_id = rooms.id and p.user_id = auth.uid())
  );

create policy "room members can read public players" on public.players
  for select using (
    exists (select 1 from public.players member where member.room_id = players.room_id and member.user_id = auth.uid())
  );

create policy "players can update their own presence and readiness" on public.players
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "players can read only their own role" on public.player_roles
  for select using (
    exists (
      select 1 from public.players p
      where p.id = player_roles.player_id and p.user_id = auth.uid()
    )
  );

create policy "players can read only their own sheriff result" on public.sheriff_results
  for select using (
    exists (
      select 1 from public.players p
      where p.id = sheriff_results.sheriff_player_id and p.user_id = auth.uid()
    )
  );

create policy "room members can read public events" on public.game_events
  for select using (
    exists (select 1 from public.players p where p.room_id = game_events.room_id and p.user_id = auth.uid())
  );

create policy "players can insert their own votes" on public.votes
  for insert with check (
    exists (
      select 1 from public.players p
      where p.id = votes.voter_player_id
        and p.user_id = auth.uid()
        and p.alive = true
    )
  );

-- night_actions are intentionally not selectable by browser clients.
-- Inserts should be performed through trusted server-side RPC/functions after validating phase, role, liveness, target, and timeout.

create publication supabase_realtime for table public.rooms, public.players, public.game_events, public.votes;
