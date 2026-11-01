# Episode 1 compact learning release

Release authorized by Mcloyd in Codex on 1 November 2026: check the updated Command Centre, update GitHub and publish the website. This supersedes the earlier instruction to hold publication for review. The Command Centre still labels its copied sections draft; this release records the explicit owner authorization separately and does not change that document.

Recovered baseline: Sites saved version 8, source a36de132ede9f1d4634f0b5e514300ec4c53b9d6. GitHub base: 060036a4cfc5fcab56e953d21411ba36211622df. The repository root remains the Pages publishing directory. No Sites hosting configuration or private source credentials are included.

The existing website now presents the authored explanations, four discussion questions per age, optional answer hints, colouring downloads, lesson reminders and prayers. Little Wonders retains Kind Choice Pop. Curious Explorers adds Path Picker; Deep Thinkers adds The Choice Challenge. The six older-age scenarios use the exact Command Centre prompts, choices, outcomes and Psalm connections. Both B and C are acceptable in each Choice Challenge scene. Each scene earns at most one reward; exploration and retries do not remove earned rewards. No private reflection text is collected.

Existing branding, CSS, approved cast assets, fonts, audio, video controls, saved favourites, matching, drawing and original printable files are retained. Progress for the new curriculum is separate from legacy history. New rewards are scoped to age and curriculum revision, saved only in the visitor's browser. Existing success chime and Abigail reassurance audio are retained; no new voice recording was generated.

## Checks

Run `node tests/episode-1.cjs` and `node --check` on the five application scripts. The test exercises all 15 authored responses, accepted alternatives, retries, distinct rewards, completion, legacy storage preservation, asset paths and loading order. During preparation, 52 game-copy fields were checked verbatim against the current Command Centre snapshot. All three recovered lesson texts, hints, reminders and prayers were previously matched against that same source.

The local browser preview was unavailable because loopback connections timed out. Hosted browser checks must follow Pages deployment. Physical Android and iPhone testing and uninterrupted YouTube streaming are not claimed from desktop browser checks.

## Delivery and rollback

Changes are prepared on `codex/episode-1-recovery`, reviewed in a pull request and merged under the owner's publication instruction. Pages rebuilds from `main` at `/`. Confirm the resulting Actions run succeeds and inspect the deployed lesson/game paths and downloads. Revert the release PR to restore the previous root website if a material regression is found. GitHub Pages publication does not change the separate ChatGPT Sites copy.
