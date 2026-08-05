# Profile Header Revalidation Repro

Minimal reproduction for a social-feed cache shape where a repost mutation updates the profile feed, but not the profile header.

## Run

```bash
pnpm --dir repros/profile-header-revalidation dev
```

Open <http://localhost:4322>.

## Flow

1. Click `Ada profile`.
2. Note the `Header component renders` and `User data recomputes` counters.
3. Go back home.
4. Click `Repost` on the home feed.
5. Click `Ada profile` again.

## What To Look For

- `Profile feed recomputes` should increase, because `toggleAdaRepost()` calls `updateTag('user-drops-ada')`.
- `User data recomputes` should not increase, because the action never updates `user-ada` or `users`.
- If `Header component renders` increases while `User data recomputes` does not, the client/router/RSC payload was refreshed but the header's tagged data cache was not revalidated.
- If `User data recomputes` increases, the unrelated repost tags are invalidating the header data cache.

The counters are intentionally rendered in the UI so this can be tested manually or scripted without reading server logs.
