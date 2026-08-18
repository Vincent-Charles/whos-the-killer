# WHO'S THE KILLER?
## Master Product, Engineering, UX, Security, Testing, and Deployment Specification for Codex

## 1. Codex Mission

You are the primary engineering agent responsible for building this project from start to finish.

Treat this file as the source of truth for the product.

Your job is to design, implement, test, document, and prepare for deployment a complete multiplayer social deduction party game.

Do not stop at mockups, wireframes, sample code, isolated components, or architecture suggestions.

Create a working application that a real group of friends can use together from their phones.

When a minor implementation detail is unspecified, make a sensible engineering decision, document it, and continue.

Do not repeatedly ask the user for implementation choices that can reasonably be decided by you.

When a decision materially changes the game rules, privacy model, deployment model, or user experience, document the assumption clearly.

Before using framework specific or service specific APIs, verify current official documentation where necessary.

Use current stable compatible package versions.

Do not use deprecated APIs.

The final output should include:

1. A complete working application
2. Database migrations
3. Secure authentication and authorization
4. Realtime multiplayer synchronization
5. Automated game progression
6. Mobile first user interface
7. Progressive Web App support
8. Procedural narrator engine
9. Automated tests
10. Local development instructions
11. Deployment instructions
12. Architecture documentation
13. An `AGENTS.md` file for future coding agents
14. A production readiness checklist
15. A clear list of any remaining limitations

The project working name is:

# WHO'S THE KILLER?

Make the title easy to change from a central configuration file.

---

# 2. Product Vision

This is a multiplayer social deduction party game inspired by Mafia and similar games.

The key difference is that the application itself becomes the Game Master.

There is no human host during gameplay.

Every person in the room should be able to participate as a normal player.

The application handles:

1. Room creation
2. Player joining
3. Role assignment
4. Secret role reveal
5. Night progression
6. Killer action
7. Doctor action
8. Sheriff investigation
9. Secret result delivery
10. Night resolution
11. Morning announcements
12. Discussion pause
13. Voting
14. Vote counting
15. Elimination
16. Round progression
17. Win detection
18. Final role reveal
19. Statistics
20. Funny awards
21. Narration
22. Realtime synchronization
23. Reconnection
24. Game recovery

The application should feel like an invisible Game Master sitting with the group.

The phones should only handle information that must remain private.

The social experience should remain face to face.

The argument, bluffing, accusing, defending, lying, and deduction happen between the actual people in the room.

The application must not replace this social interaction.

---

# 3. Target Usage

The main use case is a group of friends physically sitting together.

Typical group size:

5 to 15 players.

The architecture should reasonably support up to approximately 20 players.

Primary device:

Mobile phone in portrait orientation.

Secondary devices:

Tablet
Laptop
Desktop browser

No native iOS or Android application is required for Version 1.

Build a responsive Progressive Web App.

Players should be able to:

1. Open a shared HTTPS link
2. Play directly in a modern browser
3. Add the game to their home screen
4. Use it in a near app like experience

The initial deployment should be suitable for private use by friends and family.

---

# 4. Preferred Technology Stack

Use this stack unless a strong technical reason requires a change.

Frontend and application framework:

Next.js using the current stable App Router architecture

React

TypeScript

Tailwind CSS

Backend and data:

Supabase

Supabase Postgres

Supabase Authentication

Supabase anonymous authentication

Supabase Realtime

Deployment:

Vercel

Source control:

GitHub

Testing:

Use a modern testing stack compatible with current Next.js and TypeScript.

For example:

Vitest or Jest for unit tests

React Testing Library for component tests

Playwright for browser level flows where valuable

Choose the final tools based on compatibility with current stable versions.

Avoid unnecessary dependencies.

---

# 5. Core Design Principle

This rule overrides any conflicting implementation idea:

# NO HUMAN HOST DURING GAMEPLAY

The application is the Game Master.

The backend is authoritative.

All phones are clients.

The person who creates the room is only the room creator during setup.

After the game starts, the creator becomes an ordinary player.

The room creator must not receive privileged gameplay information.

The room creator must not be required for the game to continue.

If the room creator:

1. Dies in the game
2. Disconnects
3. Closes the browser
4. Loses internet connectivity

the game must continue.

Do not make one browser the source of truth.

The backend controls state progression.

---

# 6. Initial Roles

Version 1 includes:

## Killer

Goal:

Avoid being identified and eliminated.

Night power:

Choose one living player to kill.

## Doctor

Goal:

Help the village survive.

Night power:

Choose one living player to protect.

The Doctor may protect themselves by default.

Make this configurable before the game.

## Sheriff

Goal:

Identify the Killer.

Night power:

Investigate one living player.

The Sheriff receives only:

YES

or

NO

YES means the selected player is the Killer.

NO means the selected player is not the Killer.

The Sheriff must not receive the actual role name of a non Killer.

## Villager

No night power.

Participates in discussion and voting.

---

# 7. Future Role Extensibility

Do not implement all future roles now.

However, architect the role system so these can be added later without rebuilding the core engine:

Traitor

Jester

Bodyguard

Seer

Witch

Bomber

Additional Killer

Custom roles

A role abstraction should be capable of describing:

1. Role identifier
2. Display name
3. Team
4. Icon
5. Description
6. Night action capability
7. Allowed targets
8. Self target permission
9. Private result behavior
10. Public result behavior
11. Alive or dead action behavior
12. Win condition contribution
13. Order in the night sequence

Do not hardcode the entire game engine around exactly four role names.

---

# 8. Victory Condition

For the first version, use this simple primary victory condition:

If the Killer is eliminated by the village vote, the village wins and the game ends.

If a non Killer is eliminated, the Killer remains alive and another round begins.

Build the win condition system in a way that future alternate rules can be added later.

---

# 9. Room Creation

Landing page should contain two very prominent actions:

CREATE GAME

JOIN GAME

When CREATE GAME is selected:

1. Ensure an anonymous authenticated session exists
2. Ask the creator for a display name
3. Create a new room on the trusted backend
4. Create a short human friendly room code
5. Automatically add the creator as a player
6. Generate a shareable join URL
7. Generate a QR code for that URL
8. Enter the waiting room

Room code should preferably be 5 or 6 uppercase characters.

Avoid characters that are easy to confuse where practical.

Example:

K7R4Q

M8TX2

---

# 10. Joining a Room

A player can join through:

1. Room code
2. Shared link
3. QR code

Require only:

Display name

Do not require:

Email
Password
Phone number
Google sign in
Apple sign in
Permanent account creation

Behind the scenes use anonymous authentication so every device receives a secure unique user identity.

Player names must be unique within an active room.

Handle duplicate names gracefully.

If a room URL already contains the room code, prefill it automatically.

Example conceptual URL:

`https://example.com/join/K7R4Q`

---

# 11. Waiting Room

The lobby should feel like a polished party game lobby.

Show:

1. Room code
2. QR code
3. Copy link action
4. Native share action where available
5. Player list
6. Player count
7. Player ready state
8. Connection indicator
9. Game settings
10. Role configuration
11. Start Game button for the room creator during setup only

Each player can press READY.

The game should only start when:

1. Minimum player count is satisfied
2. Role configuration is valid
3. Required players are ready according to the chosen lobby rule

The creator may remove a player only before the game begins.

After START GAME, creator privileges end.

---

# 12. Default Role Configuration

Suggested default:

1 Killer

1 Doctor

1 Sheriff

Remaining players are Villagers

Use large touch friendly controls for role counts.

Example:

Killer

Minus

1

Plus

Doctor

Minus

1

Plus

Sheriff

Minus

1

Plus

Villagers should automatically fill remaining slots unless a later game mode requires something else.

Validate:

1. Total assigned roles must equal total players
2. At least one Killer must exist
3. Role counts cannot be negative
4. Invalid configurations cannot start

For Version 1, default to one Killer.

Architect for more than one Killer later.

---

# 13. Role Assignment Security

Role assignment must happen on trusted backend logic.

Do not assign roles only in browser JavaScript.

Do not send all roles to all browsers and merely hide them in the interface.

Each player should only be able to retrieve their own authorized role information.

A player must not be able to discover other roles by:

1. Viewing page source
2. Inspecting React state
3. Inspecting browser local storage
4. Inspecting network calls
5. Calling Supabase directly
6. Modifying client code
7. Manipulating URLs
8. Subscribing to Realtime channels
9. Guessing database identifiers

Use Row Level Security and trusted server side validation.

Sensitive role information must be isolated from public game data.

---

# 14. Role Reveal UX

The role reveal should be dramatic but simple.

Initial screen:

YOUR ROLE IS READY

Large action:

HOLD TO REVEAL

The player presses and holds.

While held:

Show the role prominently.

When released:

Hide the role again.

Then show:

I KNOW MY ROLE

Once confirmed, continue.

Role screens should have visually distinct styling.

Suggested tone examples:

## Killer

KILLER

Smile normally.

Trust nobody.

Choose carefully.

## Doctor

DOCTOR

Apparently you are qualified.

Try to keep someone alive.

## Sheriff

SHERIFF

Everyone looks suspicious.

Investigate wisely.

## Villager

VILLAGER

No special powers.

Just logic, lies, and questionable friends.

Create many randomized role introduction lines.

Never expose the role in:

1. Page title
2. URL
3. Browser notification
4. Lock screen notification
5. Public Realtime payload
6. Public logs
7. Shared screen metadata

---

# 15. Core Game State Machine

Implement a strongly controlled state machine.

Suggested states:

LOBBY

ROLE_REVEAL

NIGHT_INTRO

KILLER_ACTION

DOCTOR_ACTION

SHERIFF_ACTION

NIGHT_RESOLUTION

MORNING_RESULT

DISCUSSION

VOTING

VOTE_RESULT

ROUND_TRANSITION

GAME_OVER

Do not manage progression through scattered unrelated Boolean flags.

Every state transition must be validated.

Invalid transitions must fail.

The backend owns the authoritative current phase.

---

# 16. Night Introduction

After all required players confirm their role:

Transition to NIGHT_INTRO.

Use a cinematic dark screen.

Example:

NIGHT 1

The village is sleeping.

Trust levels are already questionable.

Use subtle animation.

The application removes the need for everyone to physically close their eyes.

Everyone can look at their own phone.

Players without a secret action should see neutral atmospheric waiting content.

They should not learn which role is currently alive or acting.

---

# 17. Killer Action

During KILLER_ACTION:

Only a living Killer gets the actionable Killer interface.

Show all valid living targets except the Killer themselves.

Use large player cards.

The Killer selects one target.

Require confirmation.

Example:

CHOOSE YOUR VICTIM

Selected:

Robert

CONFIRM TARGET

CHANGE TARGET

After submission:

Lock the action.

Show:

TARGET LOCKED

Act normal.

The target must remain secret.

No other player should receive the target.

Server validation must confirm:

1. User belongs to room
2. Game is active
3. Current phase is KILLER_ACTION
4. User is alive
5. User is Killer
6. Target is alive
7. Target is valid
8. User has not already submitted an action

---

# 18. Doctor Action

During DOCTOR_ACTION:

If Doctor is alive:

Show valid living players.

Allow self protection by default.

Require one selection and confirmation.

Do not tell Doctor who the Killer selected.

Do not show the Doctor target publicly.

Server validation must confirm:

1. User is Doctor
2. User is alive
3. Current phase is correct
4. Target is valid
5. Action has not already been submitted

If Doctor is dead:

Do not expose this.

See the Dead Role Illusion section.

---

# 19. Sheriff Action

During SHERIFF_ACTION:

If Sheriff is alive:

Allow Sheriff to choose one eligible living player.

Prefer preventing Sheriff from investigating themselves unless future rules allow it.

After selection and confirmation, server checks only:

Is selected player the Killer?

Return privately:

YES

or

NO

Do not return:

Villager

Doctor

Sheriff

Any other role

Only the Sheriff sees this result.

The result should be visually obvious but private.

Example:

IS RAGHAV THE KILLER?

YES

or

IS RAGHAV THE KILLER?

NO

Optionally keep a private investigation history for the living Sheriff.

If implemented, it must be accessible only to that Sheriff.

---

# 20. Dead Role Illusion

This rule is critical.

If Doctor or Sheriff is eliminated, the rest of the village must not learn that the role is gone.

The game should preserve the illusion that Doctor and Sheriff may still be alive.

Therefore every night always contains:

Killer phase

Doctor phase

Sheriff phase

even if Doctor or Sheriff has already died.

## If Doctor is dead

Still run a public Doctor phase.

No real Doctor action is recorded.

Use believable timing.

Do not instantly skip.

Do not display:

Doctor is dead

Doctor skipped

No Doctor available

## If Sheriff is dead

Still run a public Sheriff phase.

No real Sheriff investigation occurs.

Use believable timing.

Do not instantly skip.

Do not display:

Sheriff is dead

No Sheriff available

## Timing secrecy

Timing itself must not leak role survival.

For example:

If Doctor was alive yesterday and the phase took 12 seconds, then after Doctor dies the phase must not suddenly take 1 second.

Use a safe timing strategy with:

1. Minimum visible duration
2. Maximum action window
3. Controlled random delay
4. Generic waiting screen
5. Server controlled transition

The app must not let players reverse engineer whether a hidden role is alive from phase duration.

---

# 21. Night Action Timeouts

Because there is no human host, every secret action needs automatic timeout behavior.

Suggested default:

30 seconds per secret action.

Make this configurable before game start.

If Killer does not act before timeout:

No kill occurs that night.

If Doctor does not act:

No protection occurs.

If Sheriff does not act:

No investigation occurs.

The active role may see a private countdown.

Other players should see only generic night content.

Do not expose which role did or did not respond.

---

# 22. Night Resolution

Resolve night outcome only on the trusted backend.

Basic rule:

If Killer target equals Doctor protected target:

Nobody dies.

Otherwise:

Killer target dies.

If Killer timed out:

Nobody dies from Killer action.

Do not resolve authoritative outcomes on the client.

Do not allow duplicate night resolution.

Persist enough data to recover from reconnects.

---

# 23. Morning Experience

Morning should feel like a major game moment.

Transition from dark night visuals to warm morning visuals.

Use:

1. Animation
2. Optional short sound
3. Optional vibration
4. Contextual narrator message
5. Dramatic pause

If someone died:

Reveal only the victim name.

Do not reveal their role.

Example:

GOOD MORNING

Everyone wake up.

Except Robert.

Robert did not survive the night.

If nobody died:

Announce survival.

Example:

GOOD MORNING

Somebody tried something.

Everybody is still here.

The narrator may joke that the Doctor did a good job, but must never reveal who the Doctor is.

---

# 24. Role Privacy After Elimination

When a non Killer player is eliminated, do not reveal whether they were:

Doctor

Sheriff

Villager

Any future non Killer role

Example:

Vincent has been eliminated.

Do not say:

Vincent was innocent.

Do not say:

Vincent was the Doctor.

Do not say:

Vincent was the Sheriff.

Do not even confirm that the village made a wrong decision before the Killer check completes.

The uncertainty is intentional.

The game continues until the Killer is caught.

---

# 25. Discussion Phase

This is one of the most important parts of the entire product.

After MORNING_RESULT:

Enter DISCUSSION.

The application deliberately pauses.

There is no automatic countdown by default.

The players are physically sitting together.

They should now:

1. Put down or ignore their phones
2. Look at each other
3. Argue
4. Accuse
5. Defend themselves
6. Bluff
7. Lie
8. Share partial information
9. Claim roles if they want
10. Mislead others if they want
11. Try to identify the Killer

The app should not interfere.

All living player screens should show a simple discussion screen.

Example:

DISCUSSION TIME

Put the phones down.

Trust nobody.

Accuse freely.

Defend yourself.

Lie carefully.

Find the Killer.

Because there is no human host, progression to voting must happen democratically.

---

# 26. Ready To Vote Mechanism

During DISCUSSION, every living player gets a large button:

READY TO VOTE

Default progression rule:

More than 50 percent of living players must press READY TO VOTE.

Examples:

5 living players requires 3 ready

6 living players requires 4 ready

7 living players requires 4 ready

8 living players requires 5 ready

Show public progress such as:

4 of 7 ready to vote

Do not necessarily reveal exactly who is ready.

Before the threshold is reached, a player may cancel readiness.

Example button:

NOT READY YET

This allows someone to continue the argument if they suddenly realize something.

Once the threshold is reached:

Lock discussion readiness.

Transition all living players to VOTING.

Optional pregame setting:

Voting trigger mode

MAJORITY READY

EVERYONE READY

DISCUSSION TIMER

Default:

MAJORITY READY

---

# 27. Optional Discussion Timer

Discussion timer should be OFF by default.

If enabled before the game, support sensible choices:

60 seconds

90 seconds

2 minutes

3 minutes

5 minutes

When timer expires:

Automatically start voting.

Optionally allow majority readiness to start voting early.

Never force a timer in the default game mode.

The social argument should be allowed to continue naturally.

---

# 28. Voting

When VOTING begins:

Every living player receives a private voting interface.

Show all valid living candidates according to game rules.

Each living player gets exactly one vote.

Killer votes.

Doctor votes.

Sheriff votes.

Villagers vote.

Dead players cannot vote.

Use large touch friendly candidate cards.

Require confirmation.

After confirmation:

Lock the ballot.

Show:

VOTE LOCKED

Waiting for the village.

Publicly show progress:

5 of 7 votes submitted

Do not reveal individual ballots while voting is active.

---

# 29. Voting Timeout

Because there is no host, prevent voting from becoming permanently stuck.

Suggested default voting timeout:

60 seconds.

Make configurable if useful.

If a living player does not vote before timeout:

Treat that ballot as an abstention.

Example public result:

Voting closed.

6 votes submitted.

1 abstention.

Do not allow a late ballot after closure.

---

# 30. Tie Handling

Handle ties automatically.

Default rule:

If multiple players have the highest equal vote count:

Run a runoff vote.

Only tied players are candidates.

All eligible living voters may vote.

If runoff ties again:

No player is eliminated.

Proceed to next night.

Narrator can joke about the indecision.

Examples:

The village has achieved absolutely nothing.

The Killer appreciates your teamwork.

Democracy has requested another attempt.

Make tie behavior configurable later, but implement the above as the default.

---

# 31. Vote Result Experience

Vote result should be dramatic.

Reveal total votes by candidate.

Do not reveal individual ballots unless a future setting enables it.

Example:

Raghav 4

Vincent 2

Robert 1

Then:

RAGHAV HAS BEEN ELIMINATED

Do not immediately reveal whether Raghav was the Killer.

Create suspense.

Example:

WAS RAGHAV THE KILLER?

3

2

1

Then server returns final result.

---

# 32. Non Killer Elimination

If eliminated player is not the Killer:

Show something like:

THE KILLER IS STILL OUT THERE

Do not reveal the eliminated player's true role.

After a dramatic pause:

Automatically transition to next night.

Example:

Night 4 begins in

3

2

1

No one should need to press NEXT ROUND.

---

# 33. Killer Eliminated

If the eliminated player is the Killer:

End the game.

Show:

KILLER CAUGHT

Use:

1. Strong animation
2. Confetti
3. Optional sound
4. Optional vibration
5. Funny narrator line
6. Final role reveal
7. Statistics
8. Awards

Example narrator tone:

Against all statistical probability, you figured it out.

Apparently the village had a functioning brain after all.

Trust remaining: approximately zero.

---

# 34. Dead Player Experience

Dead players remain connected as spectators.

They should continue seeing public game progression.

They cannot:

1. Vote
2. Kill
3. Protect
4. Investigate
5. Use READY TO VOTE
6. Access hidden role information
7. Access secret night actions
8. Access Sheriff results
9. Access Doctor target
10. Access Killer target

Do not reveal all roles to a dead player while the game is active.

Their spectator screen should be funny.

Examples:

YOU ARE DEAD

Please avoid influencing the living.

GHOST MODE UNLOCKED

Judge everyone silently.

Your voting privileges have expired.

---

# 35. Automatic Game Progression

The application controls all progression.

No human host buttons during gameplay.

Example:

LOBBY

ROLE_REVEAL

NIGHT_INTRO

KILLER_ACTION

DOCTOR_ACTION

SHERIFF_ACTION

NIGHT_RESOLUTION

MORNING_RESULT

DISCUSSION

VOTING

VOTE_RESULT

ROUND_TRANSITION

Then either:

Next NIGHT_INTRO

or

GAME_OVER

State transitions must be synchronized across all devices.

---

# 36. Narrator Engine

This is a major product feature.

The game should have personality.

Avoid repeating generic messages such as:

Morning has arrived.

Build a procedural narrator engine that can create thousands of combinations without requiring thousands of manually written complete sentences.

Use structured fragments and context.

Possible inputs:

1. Current round
2. Phase
3. Victim
4. Doctor save
5. Doctor self save
6. Repeated Doctor self save
7. Killer success
8. Killer failure
9. Killer timeout
10. Sheriff investigation
11. Voting landslide
12. Close vote
13. Tie
14. Repeated accusations
15. Repeated Killer target
16. Player surviving multiple votes
17. Few remaining players
18. Game end
19. Number of rounds
20. Previous narrator lines

Combine:

Opening fragments

Core event fragments

Player name fragments

Round fragments

History fragments

Closing punchlines

Tone fragments

Keep a recent message history so exact jokes do not repeat in the same game.

---

# 37. Narrator Personalities

Support these narrator modes:

Random

Funny

Savage

Dramatic

Dark Comedy

Absurd

Mysterious

Default:

Random

Also support humor intensity:

FAMILY

NORMAL

SAVAGE

Default:

NORMAL

Savage can be sharper and meaner in a playful way.

Never use:

1. Hate speech
2. Slurs
3. Protected class insults
4. Sexual harassment
5. Extreme abuse
6. Threatening real world language
7. Highly disturbing content

Profanity should be off by default.

If profanity support is added later, make it explicitly opt in.

---

# 38. Narrator Message Categories

Create curated message banks and procedural combinations for at least these events:

Night starts

Killer choosing

Doctor phase

Sheriff phase

Waiting

Morning starts

Someone died

Nobody died

Doctor save

Doctor self save

Repeated Doctor self save

Killer failed attack

Killer successful attack

Killer repeated target

Discussion begins

Voting begins

Vote waiting

Vote timeout

Vote tie

Runoff vote

Player eliminated

Killer not caught

Killer caught

Dead player spectator

Reconnect

Late game

Final reveal

Statistics

Awards

---

# 39. Narrator Examples

These are examples of tone only.

Do not limit the engine to these exact lines.

## Morning

Another beautiful morning ruined by homicide.

The sun is up. The trust issues remain.

Grab your coffee and begin accusing your friends.

Somehow, some of you are still alive.

## Doctor save

Killer had one job.

Doctor 1. Killer 0.

Your scheduled murder could not be completed.

Death has been postponed due to technical difficulties.

Someone tried to delete Robert. Doctor pressed Undo.

## Doctor self save

Healthcare was extremely personalised tonight.

Doctor reviewed the village and selected their favourite patient.

Themselves.

Doctor said good luck everybody else.

## Repeated Doctor self save

For the third time, Doctor has chosen their favourite patient.

Themselves.

Medical ethics remain under review.

## Successful kill

Good morning everyone.

Except Robert.

Robert has unlocked Ghost Mode.

Robert is no longer accepting calls.

Robert has been promoted to spectator.

## Discussion

Phones down.

Trust nobody.

Somebody here is lying.

Statistically, probably more than one of you.

## Voting

The village has spoken.

Whether intelligence was involved remains unclear.

Democracy has occurred.

Confidence: high.

Accuracy: unknown.

## Tie

The village has achieved absolutely nothing.

The Killer appreciates your indecision.

## Killer caught

Against all statistical probability, you figured it out.

Apparently the village had a functioning brain after all.

Trust remaining: approximately zero.

---

# 40. Contextual Running Jokes

The narrator should remember game history.

Examples:

If Aman is repeatedly accused:

Aman has now survived enough accusations to qualify for permanent suspicion.

If Doctor repeatedly saves themselves:

Doctor has once again provided premium healthcare to Doctor.

If Killer repeatedly targets Vincent:

The Killer appears to have a deeply personal issue with Vincent.

If Robert consistently voted for the eventual Killer:

End game message:

Robert knew it all along and nobody listened.

If a player repeatedly changes targets:

Trust Issues Award candidate detected.

Do not reveal hidden truth before the game rules permit it.

For example, do not call someone innocent during active play if their role is still secret.

---

# 41. No Runtime AI Requirement

The narrator must work without a paid AI API.

Build a deterministic procedural message engine using templates, fragments, structured context, and game history.

The app should remain cheap or free to operate for a small private group.

Architect the narrator engine so an optional AI powered narrator could be added later.

Do not make an external AI API necessary for Version 1.

---

# 42. Visual Design Direction

This should look like a polished party game.

Do not make it look like a business dashboard.

Visual direction:

Dark cinematic base

Deep black and charcoal surfaces

Strong readable typography

Large touch controls

Rounded cards

Subtle gradients

Atmospheric lighting

Smooth transitions

Night visuals

Warm morning visuals

Distinct role accents

Red for Killer

Medical visual accent for Doctor

Sheriff themed accent for Sheriff

Neutral village styling for Villager

Use color carefully.

Do not rely on color alone.

Use icons, text, layout, and labels.

---

# 43. Mobile UX Principles

Primary target is mobile portrait.

Design for one hand use where practical.

Critical actions should be easy to reach.

Minimum common phone widths should not horizontally scroll.

Use:

1. Large buttons
2. Large tap areas
3. Clear selected states
4. Minimal typing
5. Short action flows
6. Immediate feedback
7. Loading indicators
8. Disabled duplicate submissions

Night actions should usually require:

One selection

One confirmation

Voting should usually require:

One selection

One confirmation

The game should minimize time spent operating the phone.

---

# 44. Animations

Use tasteful animation for:

Role reveal

Night transition

Morning transition

Vote submission

Vote results

Elimination

Killer suspense reveal

Victory

Confetti

Connection recovery

Do not overload every screen.

Respect operating system reduced motion preferences.

---

# 45. Audio

Support optional sound effects.

Potential events:

Night ambience

Heartbeat

Morning cue

Vote lock

Reveal

Elimination

Victory

Audio should be short and tasteful.

Provide a visible sound toggle.

Do not depend on autoplay behavior that mobile browsers may block.

Use legally reusable or self created assets.

Document asset sources and licenses.

---

# 46. Haptics

Use browser vibration where available.

Potential events:

Role reveal

Vote confirmed

Death reveal

Killer caught

Gracefully do nothing where unsupported.

Do not make vibration essential to gameplay.

---

# 47. PWA Requirements

Configure the project as an installable Progressive Web App.

Include:

1. Web app manifest
2. Application icons
3. Theme metadata
4. Standalone display behavior
5. Home screen support
6. Mobile metadata
7. Sensible static asset caching
8. Safe update behavior

Do not allow offline state to create conflicting multiplayer game state.

If the user is offline during an active game:

Show:

CONNECTION LOST

RECONNECTING

Do not allow authoritative actions while disconnected.

When connection returns:

Restore authoritative current state.

---

# 48. Realtime Synchronization

Use Supabase Realtime where appropriate.

Players should receive updates for:

Room membership

Ready status

Game start

Phase changes

Public morning result

Discussion readiness count

Voting start

Voting progress

Vote result

Elimination

Round start

Game end

Connection presence

Do not publish private role data through public realtime channels.

Use separate secure paths for private information.

---

# 49. Reconnection

Mobile browsers may sleep, refresh, or briefly disconnect.

Handle this carefully.

If a player refreshes:

Restore anonymous authentication session where available.

Restore room membership.

Restore player identity.

Restore alive status.

Restore own role.

Restore current phase.

Restore whether their private action was already submitted.

Restore whether their vote was already submitted.

Do not create a duplicate player because of refresh.

If session recovery genuinely fails, provide a secure recovery mechanism.

A possible future friendly mechanism:

Temporary reconnect code issued by the backend.

Do not create insecure identity takeover.

---

# 50. Connection Presence

Show connection state discreetly.

Possible states:

Connected

Reconnecting

Disconnected

Do not automatically kill or eliminate a player because they lost connection.

Action timeout rules still apply.

---

# 51. Database Design

Create a clean normalized schema.

Possible entities:

rooms

room_members

game_sessions

role_assignments

rounds

night_actions

sheriff_investigations

votes

eliminations

game_events

game_settings

discussion_readiness

Do not feel forced to use exactly these names.

Choose the structure that best supports:

Security

Realtime

Recovery

Statistics

Narration

Testing

Use:

Primary keys

Foreign keys

Indexes

Timestamps

Constraints

Enums or constrained values where appropriate

Create migrations.

Do not rely on undocumented manual dashboard creation.

---

# 52. Suggested Visibility Model

Game data should have explicit visibility categories.

PUBLIC

PLAYER_PRIVATE

SYSTEM_SECRET

Examples:

Room player names:

PUBLIC

Current public phase:

PUBLIC

Morning victim:

PUBLIC

Individual role:

PLAYER_PRIVATE

Sheriff investigation result:

PLAYER_PRIVATE

Doctor target:

SYSTEM_SECRET

Killer target:

SYSTEM_SECRET

Full role mapping:

SYSTEM_SECRET during active game

Full role mapping becomes public only after GAME_OVER.

Use this concept in architecture and authorization.

---

# 53. Row Level Security

Enable Row Level Security wherever applicable.

Security requirements:

A player can read public room information for their room.

A player can read their own private information.

A player cannot read another player's role.

A player cannot read another player's private Sheriff result.

A player cannot insert actions for another player.

A dead player cannot submit active actions.

A player cannot submit an action in the wrong phase.

A player cannot submit multiple actions for the same phase.

A player cannot change their own role.

A player cannot manipulate alive state.

A player cannot manually change the phase.

A room creator loses gameplay privileges after start.

Use trusted server logic for any operation that requires access to secret data.

Never expose the privileged Supabase service key to the browser.

---

# 54. Environment Variables

Create `.env.example`.

Use current recommended naming conventions.

Document every variable.

Clearly mark:

Browser safe public values

Server only values

Never commit real credentials.

Never print secrets in logs.

Never embed secrets in source code.

---

# 55. Game Event Log

Maintain an event log suitable for:

1. Recovery
2. Debugging
3. Statistics
4. Narrator context
5. End game awards
6. Audit of state transitions

Events should have visibility.

Examples:

PUBLIC

PLAYER_PRIVATE

SYSTEM_SECRET

Do not expose secret events during active play.

---

# 56. Statistics

Track enough game history to produce entertaining final statistics.

Potential metrics:

Rounds played

Successful Killer attacks

Failed Killer attacks

Killer timeouts

Doctor saves

Doctor self saves

Sheriff investigations

Correct Sheriff investigations

Votes received per player

Votes cast per player

Votes against eventual Killer

Times targeted by Killer

Number of accusations approximated through vote history

Number of different voting targets

First eliminated

Longest survivor

Most targeted

Most voted

Closest vote

Largest landslide

Number of ties

Game duration

Do not calculate statistics that require unsupported assumptions.

---

# 57. Funny Awards

Generate awards from actual data.

Examples:

SHERLOCK HOLMES

Most consistently voted against the Killer

PROFESSIONAL LIAR

Killer performance award

MAIN CHARACTER SYNDROME

Doctor repeatedly saved themselves

HUMAN SHIELD

Targeted most often by Killer

TRUST ISSUES AWARD

Voted for the widest variety of players

MOST SUSPICIOUS INNOCENT

Non Killer who received the most votes

GHOST SPEEDRUN

First eliminated player

FORTUNE TELLER

Player who voted for the Killer early and consistently

DOCTOR OF THE YEAR

Most successful saves

Generate only awards that make sense for that game.

Awards can reveal true roles only after GAME_OVER.

---

# 58. Final Role Reveal

After Killer is caught:

Reveal all roles.

Use animated cards.

Example:

Raghav

Killer

Vincent

Sheriff

Aman

Doctor

Robert

Villager

Suzil

Villager

Then show statistics and awards.

Allow:

PLAY AGAIN

NEW GAME

SAME PLAYERS

NEW ROOM

For SAME PLAYERS:

Create a fresh game session.

Randomize roles again.

Do not reuse secret assignments.

---

# 59. Loading and Submission States

Every asynchronous operation needs clear feedback.

Examples:

Creating room

Joining room

Starting game

Revealing role

Submitting night action

Submitting vote

Waiting for others

Resolving round

Reconnecting

Prevent repeated taps from causing duplicate requests.

Use idempotent backend behavior where appropriate.

---

# 60. Error Handling

Create friendly states for:

Invalid room code

Expired room

Game already started

Duplicate name

Connection lost

Session expired

Action timeout

Invalid action

Room full

Unexpected server error

Game already ended

Do not expose stack traces or internal identifiers to normal users.

Log enough information on the server for debugging.

---

# 61. Accessibility

Requirements:

Good contrast

Large touch targets

Readable font sizes

Keyboard support on desktop where reasonable

Accessible labels

Focus states

Do not depend only on color

Respect reduced motion

Avoid rapidly flashing effects

Narrator messages should remain readable with screen readers where possible without accidentally exposing hidden role information

---

# 62. Component Architecture

Create reusable components.

Examples:

PrimaryButton

SecondaryButton

PlayerCard

PlayerAvatar

RoleCard

PhaseHeader

NarratorMessage

RoomCodeCard

QRCodeCard

ConnectionIndicator

ReadyProgress

VoteCard

VoteProgress

Countdown

HoldToReveal

ResultReveal

GameModal

Toast

SoundToggle

HapticsToggle

Do not create one giant component containing the entire game.

Separate concerns cleanly.

---

# 63. Code Architecture

Separate:

UI

Game engine

State machine

Database access

Authentication

Authorization

Server actions

Realtime subscriptions

Narrator engine

Statistics engine

Validation

Types

Constants

Configuration

Utilities

Use TypeScript strongly.

Avoid `any` unless justified.

Use runtime validation for external input.

Use clear names.

Keep game logic testable without rendering the UI.

---

# 64. Configuration

Centralize configurable values.

Examples:

Game title

Minimum players

Maximum players

Default role counts

Night action timeout

Vote timeout

Discussion mode

Narrator personality

Humor level

Doctor self save setting

Sound default

Haptics default

Tie behavior

Phase minimum durations

Do not scatter magic values throughout the codebase.

---

# 65. Local Demo Mode

Create a developer friendly way to experience the application without gathering many people.

Possible solutions:

1. Local bot simulation
2. Multiple simulated players
3. Development control panel
4. Seeded demo game

This must be clearly development only.

Do not expose debugging controls in production.

A developer should be able to simulate a 6 player game on one machine.

---

# 66. Deterministic Testing Support

Where practical, support deterministic random seeds in development and tests.

Use this to reproduce:

Role assignment

Narrator selection

Game outcomes

Do not expose deterministic debug controls to normal production users.

---

# 67. Core Automated Tests

At minimum test:

Role assignment produces valid counts

Role assignment is randomizable

Role privacy

Killer cannot target self

Killer cannot target dead player

Doctor can protect valid player

Doctor self save setting works

Doctor successful save prevents death

Killer successful attack causes death

Sheriff investigation returns YES for Killer

Sheriff investigation returns NO for non Killer

Sheriff does not receive actual non Killer role

Dead Doctor cannot act

Dead Doctor phase illusion still progresses

Dead Sheriff cannot act

Dead Sheriff phase illusion still progresses

Timing logic does not trivially reveal dead role

Dead player cannot vote

Dead player cannot use discussion readiness

Duplicate night action is rejected

Duplicate vote is rejected

Wrong phase action is rejected

Unauthorized action is rejected

Vote counting works

Abstention on timeout works

Tie runoff works

Second tie produces no elimination

Non Killer elimination continues game

Killer elimination ends game

Role reveal remains hidden until game end

Realtime public state does not contain secret role data

Reconnect restores player state

Narrator avoids immediate repetition

Narrator contextual categories work

Statistics are calculated correctly

Awards are based on valid data

---

# 68. Integration Acceptance Scenario

Build an automated integration test or documented repeatable manual test for this exact scenario.

Players:

Vincent

Robert

Aman

Raghav

Suzil

John

Roles for deterministic test:

Raghav is Killer

Aman is Doctor

Vincent is Sheriff

Robert is Villager

Suzil is Villager

John is Villager

## Round 1

Raghav targets Robert.

Aman protects Robert.

Vincent investigates Suzil.

Expected:

Robert survives.

Vincent privately receives NO.

Nobody else sees the Sheriff result.

Nobody sees Doctor target.

Nobody sees Killer target.

Morning reports that nobody died.

Discussion begins.

Phones pause for discussion.

Majority selects READY TO VOTE.

Voting begins.

Aman is eliminated.

Expected:

Aman's role is NOT revealed.

Game continues.

## Round 2

Doctor phase still appears.

No real Doctor action exists because Aman is dead.

Timing must not reveal that.

Raghav targets John.

Vincent investigates Raghav.

Expected:

John dies.

John's role is not revealed.

Vincent privately receives YES.

Discussion begins.

Robert is eliminated by vote.

Expected:

Robert's role is not revealed.

Killer remains alive.

Game continues.

## Round 3

Fake Doctor phase still occurs.

Sheriff phase occurs because Vincent is alive.

Discussion begins.

Raghav is eliminated by vote.

Expected:

Suspense reveal occurs.

Raghav is confirmed as Killer.

Village wins.

Game ends.

All roles are revealed.

Statistics appear.

Awards appear.

---

# 69. Security Acceptance Testing

Actively attempt to break role privacy.

Use browser developer tools.

Inspect:

Network requests

Client state

Browser storage

Realtime subscriptions

Database requests

Attempt:

Read another player's role

Read Sheriff result as another player

Read Killer target as another player

Read Doctor target as another player

Submit action as another role

Vote after death

Act after timeout

Act during wrong phase

Change game phase

Change alive status

Change role

All attempts should fail.

Fix security weaknesses before calling the project complete.

---

# 70. Mobile Acceptance Testing

Test representative mobile widths.

Verify:

No horizontal overflow

Large buttons

Readable role reveal

Readable room code

Vote cards fit

Discussion screen fits

Night screen fits

Morning screen fits

Dialogs fit

Loading overlays fit

QR code remains usable

One hand interaction is practical

Test at least:

Small mobile portrait

Modern large mobile portrait

Tablet

Desktop browser

---

# 71. Performance

Keep the app lightweight.

Avoid unnecessary large dependencies.

Avoid reloading full game history on every state update.

Use efficient realtime subscriptions.

Clean up subscriptions.

Avoid memory leaks.

Keep public payloads small.

Cache static assets sensibly.

Optimize initial mobile load.

---

# 72. Data Cleanup

This is a private party game.

Store minimal personal information.

Display name is enough.

Create a reasonable room expiration model.

For example:

Inactive pregame rooms expire after a defined duration.

Completed games can be deleted after a retention period.

Document cleanup strategy.

Do not collect unnecessary personal data.

---

# 73. Repository Structure

Create a clean repository structure matching current Next.js conventions.

Include:

Application source

Components

Game engine

State machine

Narrator engine

Statistics engine

Supabase utilities

Database migrations

Tests

Public assets

PWA assets

Configuration

Documentation

`.env.example`

`README.md`

`DEPLOYMENT.md`

`ARCHITECTURE.md`

`AGENTS.md`

Add any additional documentation that materially improves maintainability.

---

# 74. README Requirements

Write a beginner friendly `README.md`.

Explain:

1. What the game is
2. Core rules
3. Technology stack
4. Project architecture
5. Prerequisites
6. How to install Node.js if required
7. How to install dependencies
8. How to create a Supabase project
9. How to enable anonymous authentication
10. How to configure environment variables
11. How to apply migrations
12. How to run locally
13. How to run tests
14. How to build
15. How to use demo mode
16. How to troubleshoot common issues
17. How to deploy

Use exact commands.

Assume the project owner is comfortable following technical instructions but may not be an experienced web engineer.

---

# 75. AGENTS.md Requirements

Create an `AGENTS.md` file for future coding agents.

Include:

Project purpose

Core architecture

Critical rules

No human host rule

Backend authority rule

Role privacy rule

Dead Doctor illusion rule

Dead Sheriff illusion rule

Discussion pause rule

Sheriff YES or NO rule

No role reveal on non Killer elimination

How to run locally

How to run tests

How to lint

How to apply database migrations

How deployment works

Important files

Coding standards

Security rules

Areas that should not be changed casually

---

# 76. Architecture Documentation

Create `ARCHITECTURE.md`.

Explain:

Frontend architecture

Backend architecture

Authentication model

Authorization model

Database model

Realtime model

State machine

Secret data boundaries

Game progression

Dead role illusion

Narrator engine

Statistics engine

PWA behavior

Reconnect strategy

Failure modes

Security assumptions

Use diagrams in Mermaid where useful.

---

# 77. Deployment Target

Preferred production deployment:

Application and Next.js server logic:

Vercel

Database, authentication, and realtime:

Supabase

Source repository:

GitHub

The final result should be available through one HTTPS URL.

Example only:

`https://whosthekiller.vercel.app`

Do not assume that exact URL is available.

---

# 78. DEPLOYMENT.md

Create `DEPLOYMENT.md`.

Make it extremely beginner friendly.

Include exact current steps.

## Section A

Create a Supabase account.

## Section B

Create a Supabase project.

## Section C

Enable anonymous authentication.

## Section D

Apply database migrations.

## Section E

Configure Realtime requirements.

## Section F

Find required Supabase project values.

## Section G

Create local `.env.local`.

## Section H

Run the application locally.

## Section I

Create a GitHub repository.

## Section J

Push the project to GitHub.

## Section K

Create a Vercel project.

## Section L

Import the GitHub repository into Vercel.

## Section M

Configure environment variables in Vercel.

## Section N

Deploy.

## Section O

Open deployed URL.

## Section P

Create a room.

## Section Q

Join from a second device.

## Section R

Verify realtime synchronization.

## Section S

Install on iPhone home screen.

Explain Safari steps.

## Section T

Install on Android home screen.

Explain Chrome steps.

## Section U

Deploy future updates.

## Section V

View logs.

## Section W

Roll back a bad deployment.

## Section X

Troubleshoot common deployment problems.

If any platform process has changed, verify current official documentation before writing final instructions.

---

# 79. Cost Goal

Design Version 1 to run comfortably on free service tiers for a small private friend group wherever current service limits permit.

Do not add paid services unless required.

Do not require an AI API.

Document any free tier limitations that could matter.

---

# 80. Production Logging

Add safe logging for important server events.

Examples:

Room creation

Join failure

State transition failure

Action validation failure

Reconnect failure

Game resolution failure

Do not log:

Secret role mappings in ordinary production logs unless absolutely required and safely protected

Authentication tokens

Privileged keys

Private Sheriff results

Sensitive action payloads unnecessarily

Provide enough context to debug without leaking game secrets.

---

# 81. Quality Gate

Before declaring the project complete:

1. Install dependencies successfully
2. Run lint
3. Run type check
4. Run unit tests
5. Run integration tests
6. Run production build
7. Fix all blocking failures
8. Manually test at least one multiplayer flow
9. Verify no secret role leakage
10. Verify discussion phase works without a host
11. Verify dead Doctor illusion
12. Verify dead Sheriff illusion
13. Verify Killer win detection
14. Verify final reveal
15. Verify mobile layout
16. Verify reconnect behavior
17. Verify PWA manifest and installability
18. Verify deployment documentation
19. Verify README commands
20. Verify `.env.example`
21. Verify no real secrets are committed

Do not call the project complete while required functionality is still represented by placeholder TODOs.

---

# 82. Implementation Sequence

Use this sequence unless a better dependency order is clearly justified.

## Phase 1

Initialize repository.

Configure Next.js.

Configure TypeScript.

Configure Tailwind.

Create base design system.

Create configuration module.

## Phase 2

Design database schema.

Create migrations.

Configure anonymous authentication.

Configure Row Level Security.

Create server side authorization helpers.

## Phase 3

Implement room creation.

Implement joining.

Implement lobby.

Implement player readiness.

Implement role configuration.

## Phase 4

Implement role assignment.

Implement private role retrieval.

Implement hold to reveal UX.

Test privacy.

## Phase 5

Implement state machine.

Implement automatic server controlled transitions.

Implement night phases.

## Phase 6

Implement Killer action.

Implement Doctor action.

Implement Sheriff action.

Implement night resolution.

Implement dead role illusion.

## Phase 7

Implement morning.

Implement discussion pause.

Implement READY TO VOTE majority progression.

Implement voting.

Implement timeout.

Implement tie runoff.

Implement elimination.

Implement win detection.

## Phase 8

Implement dead spectator mode.

Implement automatic next round.

Implement final role reveal.

## Phase 9

Implement narrator engine.

Add narrator personalities.

Add contextual history.

Add repeat prevention.

## Phase 10

Implement statistics.

Implement awards.

## Phase 11

Implement Realtime polish.

Implement reconnect recovery.

Implement connection presence.

## Phase 12

Implement PWA.

Add audio.

Add haptics.

Add animations.

## Phase 13

Add test coverage.

Add demo mode.

Run security tests.

## Phase 14

Create documentation.

Create deployment guide.

Run production build.

Fix remaining issues.

---

# 83. Codex Working Behavior

Work autonomously.

Do not merely explain what you would do.

Actually create and modify project files.

Run commands.

Run tests.

Inspect failures.

Fix failures.

Continue until the application is in a usable state.

When you encounter a technical blocker:

1. Diagnose it
2. Try a reasonable alternative
3. Document the reason
4. Continue where possible

Do not abandon the entire task because one optional feature is difficult.

Prioritize a secure functioning multiplayer core over decorative polish.

If a feature must be deferred, clearly record it in a limitations section.

Do not silently omit required core rules.

---

# 84. Non Negotiable Rules

These are absolute product rules for Version 1.

1. No human host during gameplay
2. Backend is the Game Master
3. Everyone is a normal player after game start
4. Killer secretly chooses a victim
5. Doctor secretly protects one player
6. Sheriff investigates one player
7. Sheriff receives only YES or NO
8. Sheriff result is private
9. Doctor never knows Killer target
10. Non acting players receive no secret information
11. Dead Doctor status remains hidden
12. Dead Sheriff status remains hidden
13. Doctor phase continues after Doctor death
14. Sheriff phase continues after Sheriff death
15. Timing must not obviously reveal role death
16. Non Killer eliminated roles remain secret
17. The game continues across multiple rounds
18. Discussion is a real world pause
19. Discussion has no timer by default
20. Majority READY TO VOTE starts voting by default
21. Dead players cannot vote or act
22. Killer caught by vote ends the game
23. All roles reveal only after game end
24. Phones should minimize interaction and maximize face to face play
25. Secret role data must not leak to unauthorized clients

---

# 85. Final Product Feel

The finished experience should feel like this:

A group opens one link.

One person creates a room.

Everyone scans the QR code.

Everyone joins.

Everyone marks ready.

The game starts.

Everyone privately learns their role.

The application runs the night.

The Killer chooses.

The Doctor protects.

The Sheriff investigates.

The application resolves the night.

Morning appears with a funny message.

Everyone puts their phones down.

The group argues loudly.

People accuse each other.

People lie.

People bluff.

People defend themselves.

When enough people are ready, the phones move into voting.

Everyone votes privately.

The application counts the votes.

Someone is eliminated.

Their role stays secret.

If the Killer survives, the next night begins automatically.

The cycle continues.

When the Killer is finally voted out, the application performs a dramatic reveal.

All roles are shown.

Statistics appear.

Funny awards appear.

Everyone laughs.

Then they press PLAY AGAIN.

That is the product to build.
