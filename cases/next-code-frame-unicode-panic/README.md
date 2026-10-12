# `next-code-frame` Unicode crash reproduction

This minimal app throws during a Server Component render while a nearby long
Persian source line is included in the development error code frame.

```bash
pnpm install
stty cols 80
pnpm dev
```

Open `http://localhost:3000`. The process aborts while trying to render the
code frame:

```text
thread '<unnamed>' panicked at crates/next-code-frame/src/highlight.rs:1021:45:
end byte index 74 is not a char boundary; it is inside 'ت' (bytes 73..75 of string)
fatal runtime error: failed to initiate panic, error 5, aborting
```

The same failure occurs with webpack, demonstrating that the bug is in the
shared error-reporting implementation rather than the Turbopack bundler:

```bash
stty cols 80
pnpm dev:webpack
```

For the smallest possible reproduction, invoke the native code-frame binding
directly. This exits with status 134:

```bash
pnpm repro:binding
```

Verified on October 12, 2026:

- Next.js 16.3.0: Turbopack and webpack both abort.
- Next.js 16.4.0: Turbopack and webpack both abort.
- Next.js 16.5.0-canary.8: the native binding still aborts.

Related upstream work:

- Issue: https://github.com/vercel/next.js/issues/92641
- Open fix PR: https://github.com/vercel/next.js/pull/92646


