---
name: auth-rebuild
description: Professional auth rebuild completed: Google OAuth email dropdown, direct dashboard navigation, email verification redirect, backend /me role normalization.
metadata:
  type: project
---

Complete auth flow rebuilt:
- `/google/select` — dropdown for selecting Google email account before `/me` call.
- `AuthCompletePage` — waits for Clerk session (`isSignedIn`) then fetches `/me` and navigates directly to `/owner/dashboard` or `/customer/home`.
- `AuthForm` verification submit — navigates to `getPostAuthPath(role)` instead of `/sign-in`.
- `AuthCallbackPage` — uses `afterSignUpUrl="/auth/sso-callback"` + `AuthCompletePage` to avoid redirect loops.
- Backend `identity.controller.ts` — `Array.isArray(rawRole) ? rawRole[0] : rawRole` fixes 400 from Express query array parsing.
- `docs/API.md` — `/api/me` contract documented.

**Why:** User requested full professional auth rebuild with direct dashboard routing, role selection, and no redirect loops.
**How to apply:** Preserve server-side authorization (`/me` authoritative), keep sessionStorage role hint only for new-user creation, never expose secrets.

[[auth-callback-fix]]
