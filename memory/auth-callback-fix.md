---
name: auth-callback-fix
description: AuthCallbackPage uses afterSignUpUrl=/auth/sso-callback and renders AuthCompletePage; AuthCompletePage waits for isSignedIn before calling /me.
metadata:
  type: reference
---

Fixed: `AuthenticateWithRedirectCallback` redirect URLs set to `/auth/sso-callback`, and `AuthCompletePage` runs alongside it. Once `isSignedIn` is true, `/me` is called. No redirect loop.
