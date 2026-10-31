# YouTube publishing connection

Reviewed 31 October 2026. No upload watcher, scheduled importer or webhook listener is enabled. Publishing changes to the GitHub Pages main branch already rebuilds the website; this does not detect YouTube uploads.

## Verified source

- Channel: The Bible Playroom, https://www.youtube.com/@TheBiblePlayroom
- Channel ID observed in the embedded player channel link: UCBydJCxOziU6p6N5LVPKQ9w
- Episode 1: Choosing the Right Path, Psalm 1:1–2
- Watch URL: https://www.youtube.com/watch?v=cLXBJJ4xHZ4
- Embed: https://www.youtube-nocookie.com/embed/cLXBJJ4xHZ4
- Current episode data: episodeOne in app.js; homepage/library presentation: index.html. In the Sites checkout these files are under dist/.

## What automatic updates would require

YouTube supports server-to-server upload notifications through PubSubHubbub/WebSub. Notifications also arrive when a title or description changes. A receiver must validate subscription challenges, process the correct channel/video ID, deduplicate events, and renew subscriptions. GitHub Pages only serves static files, so it cannot itself run that receiver. A separate server/Worker could receive events and invoke an authenticated repository update.

An alternative is a GitHub Actions workflow that checks the official channel feed or uploads playlist on an agreed schedule, then prepares an update. Scheduled workflows can be delayed and are not an instant upload trigger. A Data API implementation would require an appropriate Google project/API credential stored in repository secrets, never in browser JavaScript. Channel-feed access should be tested from the intended runner before relying on it.

Feed topic documented by YouTube: https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCBydJCxOziU6p6N5LVPKQ9w

## Preserve approval

A new public YouTube upload is a discovery signal, not approval for new website teaching. Match it to an explicitly approved episode/lesson revision, approved title, passage, artwork, target ages, complete lessons and PDFs. Prepare a pull request or hold an incomplete package. Publish only the approved revision, verify the live website, and then record completion. Do not automatically turn upload descriptions into teaching materials.

The connected automation event sources checked here were Gmail and GitHub, with no direct YouTube or Google Docs event source. The user asked for a capabilities review, so no new schedule or listener was created.

## Current playback design

The local approved thumbnail loads with native lazy loading. The page makes no YouTube iframe/player request until the visitor taps Watch. One responsive player is shared by the homepage, library and lesson links. It uses playsinline=1, a 200 pixel minimum player height, fullscreen permission and a strict-origin-when-cross-origin referrer policy. A direct YouTube watch link remains available. Opening a lesson removes the player to stop background playback.

## References

- https://developers.google.com/youtube/data/guides/push_notifications
- https://developers.google.com/youtube/player_parameters
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
