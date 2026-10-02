# Eddy — API Documentation

## Authentication

### `GET /api/me`
- Description: Get or create the current application user.
- Auth: Bearer token (Clerk JWT required).
- Query params: `?role=` (optional, `OWNER` or `CUSTOMER`). Only used for new user creation; ignored for existing users.
- Response:
```json
{"success":true,"data":{"clerkId":"...","role":"OWNER","displayName":"..."},"error":null}
```
- Errors: `UNAUTHORIZED`, `VALIDATION_ERROR` (invalid role string).

### `PATCH /api/me`
- Description: Update current user profile.
- Auth: Bearer token.
- Body (optional fields): `displayName`, `bio`, etc. (per `patchMeSchema`)
- Response: Same shape as `GET /api/me`.

## Auth Flow
1. User selects `OWNER` / `CUSTOMER` on sign-up.
2. Google OAuth: redirect to `/auth/sso-callback` → `AuthenticateWithRedirectCallback` activates session, then `AuthCompletePage` calls `/me` (with role from sessionStorage) and navigates to `/owner/dashboard` or `/customer/home`.
3. Email/Password: after verification submit, direct navigate to dashboard based on role.
4. Email dropdown (`/google/select`): user selects Google email account → `/me` call → direct dashboard.
