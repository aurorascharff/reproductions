# mounting-call-site-not-in-stack

Repro for the **"the mount site isn't named in the stack"** complaint in
blocking-prerender errors. Building this repro showed the complaint as stated
is **not accurate** for the current canary (`16.3.0-canary.59`) — the mount
site IS in the stack. What's actually missing is more subtle.

## The shape

```
app/layout.tsx
  └── <AppSideBar />            ← app/_components/app-sidebar.tsx
        └── <DynamicBreadcrumb /> ← MOUNTED HERE — the line we care about
              └── await cookies()  ← app/_components/dynamic-breadcrumb.tsx — THROW SITE
```

- **Throw site:** `app/_components/dynamic-breadcrumb.tsx` line 11 (the `await cookies()` call)
- **Mount site:** `app/_components/app-sidebar.tsx` line 16 (the `<DynamicBreadcrumb />` JSX)
- **Fix site:** the mount site — wrap `<DynamicBreadcrumb />` in `<Suspense>` inside `AppSideBar`

## What's actually in the stack (verified Jun 22)

`next dev` (CLI + MCP `get_errors`) and `next build --debug-prerender` both
return all three frames:

```
at DynamicBreadcrumb (app/_components/dynamic-breadcrumb.tsx:11:36)  ← throw site
at AppSideBar       (app/_components/app-sidebar.tsx:16:7)            ← MOUNT SITE
at RootLayout       (app/layout.tsx:11:9)
```

The framework already names `app-sidebar.tsx:16:7` — the exact line where
`<DynamicBreadcrumb />` is mounted and where the `<Suspense>` edit goes.

## What's actually missing

Two real gaps surfaced while building this repro:

### 1. Default `next build` (no `--debug-prerender`) has no file paths at all

Without `--debug-prerender`, the build stack is anonymous component names only:

```
at aside (<anonymous>)
at body  (<anonymous>)
at html  (<anonymous>)
```

No `DynamicBreadcrumb`, no `AppSideBar`, no `cookies()` call line, no files.
The build output does tell you to rerun with `--debug-prerender`, but the
default-mode message is unactionable on its own — the first thing a dev hits
when they enable Cache Components and run a build is this stripped stack.

### 2. The frames are there, but nothing labels them as "throw" vs "mount"

A reader has to know that:

- The first frame is where the throw happened (you can't wrap THIS in
  `<Suspense>` — Suspense has to be above it)
- The second frame is the parent that mounted the suspending component (this
  IS where the `<Suspense>` goes, in most shell-level cases)

Today both frames look identical in the overlay (same font, same indent, same
file/line shape). An agent following "wrap the data access in `<Suspense>`"
literally is likely to edit the first file in the stack, not the second.

A small framing change in the overlay (label one frame "Suspending
component" and the next "Mounted by") would close this without any new data
collection.

## Setup

```bash
cd cases/mounting-call-site-not-in-stack
pnpm install
pnpm dev       # open http://localhost:3000 — dev overlay shows the error
# OR
pnpm build                          # default — anonymous stack, no files
pnpm next build --debug-prerender   # full stack with files + code frame
```

## Action items

- [ ] **Default `next build` stack should include user file paths** for
      blocking-prerender errors, not just anonymous component names. Today
      the dev overlay and `--debug-prerender` already have the data; the
      default build output strips it.
- [ ] **Label "throw site" vs "mount site"** in the dev-overlay frame UI so
      it's obvious which one the `<Suspense>` edit goes around. (Cheap,
      doesn't need new framework data.)
- [ ] Re-validate the original friction-log claim — was it about a
      different case (Client Components? a specific scenario where the mount
      frame gets dropped?), or just out-of-date?
