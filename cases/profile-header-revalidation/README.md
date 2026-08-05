# Profile Header Revalidation Repro

This case reproduces the cache shape from the social media app around a profile page:

- The public profile header is cached by user tags.
- The home feed, profile feed, and Ada's drop interaction state are cached separately.
- A repost updates feed/interaction tags, but intentionally does **not** update the profile header tags.
- Each cache miss has an artificial delay so the Suspense loading states are visible.

The deployed version is at <https://profile-header-revalidation.vercel.app>.

## Run

```bash
pnpm --dir cases/profile-header-revalidation install
pnpm --dir cases/profile-header-revalidation dev
```

Open <http://localhost:4322>.

## Cache Model

| UI | Function | Directive | Tags | Artificial delay |
| --- | --- | --- | --- | --- |
| Ada profile header | `getUserHeader('ada')` | `'use cache'` | `users`, `user-ada` | 900ms on cache miss |
| Home feed | `getHomeFeed()` | `'use cache: private'` | `feed`, `drop-interactions:ada` | 1200ms on cache miss |
| Home repost button state | `getAdaRepostState()` | `'use cache: private'` | `drop-interactions:ada` | 650ms on cache miss |
| Ada profile feed | `getProfileFeed('ada')` | `'use cache: private'` | `user-drops-ada` | 1500ms on cache miss |

The mutable repost state is stored in cookies, not process memory, so the deployed Vercel repro behaves like a per-browser user session. The render counters are still process-local diagnostics, so the more important values are the rendered `cache filled` timestamps.

## Reproduction Flow

1. Open `/`.
2. Wait for the home feed skeleton to resolve.
3. Click `Ada profile`.
4. Wait for the profile header and profile feed skeletons to resolve.
5. Note these profile header values:
   - `cache filled`
   - `component renders`
   - `user data recomputes`
6. Click `Home`.
7. Click `Repost`.
8. Click `Ada profile` again.

## Expected Behavior

After the repost:

- The home feed should refetch because `toggleAdaRepost()` calls `updateTag('feed')`.
- Ada's profile feed should refetch because the action calls `updateTag('user-drops-ada')`.
- Ada's repost button state should refetch because the action calls `updateTag('drop-interactions:ada')`.
- Ada's profile header data should **not** refetch because the action does not update `users` or `user-ada`.

The easiest signal is the profile header `cache filled` timestamp. It should stay the same across the home -> repost -> profile flow. The profile feed `cache filled` timestamp should change.

## Interpreting The Counters

- If `user data recomputes` increases after repost, the repost tags are incorrectly invalidating the profile-header data cache.
- If `component renders` increases but `user data recomputes` and `cache filled` stay the same, the route/RSC payload rerendered but the tagged header data cache was not revalidated.
- If the profile feed timestamp does not change after repost, the `user-drops-ada` invalidation did not take effect.
- Use `Reset repro state` when you want to clear the cookies and explicitly invalidate all of the case's tags, including the header tags.

## Why The Delays Exist

The delays are intentional. This app should make the static shell, Suspense fallbacks, cache misses, and subsequent cache hits observable by eye:

- First visit to a section shows a skeleton while the cache is filled.
- Revisiting without invalidation should skip the delayed cache miss.
- Reposting should make only the invalidated feed/interaction sections slow again.
- The profile header should remain warm unless `Reset repro state` is used.
