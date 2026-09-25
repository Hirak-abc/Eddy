# AGENTS.md — Eddy

## Project Overview
Eddy is a SaaS platform for SMBs combining AI flyer generation, trend-based marketing, AI hashtags, Instagram/Facebook publishing and analytics, customer rewards/spin wheels, QR interactions, wallets/coins, flyer coupons, reviews, subscriptions, and owner analytics.

The project uses a **modular monolith**: frontend and backend are independently deployed, while backend business domains remain logically separated.

## Technology Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Backend: Express.js + TypeScript
- Authentication: Clerk
- Database: Convex
- AI flyer/hashtag generation: Grok / xAI API
- Social publishing/analytics: Meta Graph API
- Payments: Razorpay
- Image/flyer storage: Cloudflare R2
- QR: `qrcode` npm package
- Validation: Zod
- Product analytics: Google Analytics 4
- Frontend deployment: Vercel
- Backend deployment: Render / Railway
- Version control: Git + GitHub
- CI/CD: GitHub Actions
- E2E testing: Playwright

## Architecture Rules
1. Keep one Express.js modular-monolith backend.
2. React communicates with Express through REST APIs.
3. Keep business rules server-side. Never trust the client for wallet balances, rewards, coupon validity, QR limits, streaks, transactions, subscriptions, or authorization.
4. External providers must be behind internal service/integration abstractions. Do not scatter direct provider calls throughout modules.
5. Use background jobs for long-running work such as trend discovery, AI generation, scheduled/automatic publishing, analytics synchronization, subscription checks, and coupon expiration processing.
6. Do not introduce microservices without a measurable reason.

## Backend Layering
Prefer:
```text
Route -> Controller -> Service/Use Case -> Repository/Integration -> Database/External API
```
- Routes define HTTP endpoints and contain minimal logic.
- Controllers handle HTTP input/output and error mapping; keep business logic out.
- Services/use cases contain business rules and orchestration.
- Repositories handle database operations.
- Domain contains domain entities/value objects/rules.
- Infrastructure contains technical implementations and providers.
- Presentation contains HTTP-facing routes/controllers/schemas.

## Module Boundaries
Core modules include identity, business, flyer, social, analytics, rewards, wallet, coupon, QR, engagement, and subscription.

A module must not access another module's internal repository directly. Use public services/use cases/interfaces instead. Avoid circular dependencies.

## External Integrations
Use internal abstractions such as:
```text
FlyerService -> XAIService -> xAI API
SocialService -> MetaService -> Meta Graph API
PaymentService -> RazorpayService -> Razorpay
StorageService -> R2Service -> Cloudflare R2
```
The application should be able to replace a provider without rewriting business modules.

## AI Rules
AI functionality includes flyer and hashtag generation. The rest of the application must call an internal AI service rather than xAI directly.

## Security
- Clerk handles authentication; backend enforces authorization.
- Verify resource ownership on protected operations.
- Roles include OWNER, CUSTOMER, and ADMIN where applicable.
- Never expose or commit `CLERK_SECRET_KEY`, `XAI_API_KEY`, Meta access tokens, Razorpay secrets, or R2 secret credentials.
- Never trust frontend-calculated financial/reward state.
- Coupon redemption must verify existence, business ownership, expiry, usage status, and customer eligibility atomically.
- QR codes identify businesses but contain no sensitive credentials.

## Environment
Use `.env` for local development and `.env.example` for variable names without real credentials. Production secrets belong in deployment environment configuration. Never commit real secrets.

## Validation
Use Zod at API boundaries for request bodies, query parameters, route parameters, and useful external responses. Never trust unvalidated client input.

## API Response Format
Success:
```json
{"success":true,"data":{},"error":null}
```
Error:
```json
{"success":false,"data":null,"error":{"code":"COUPON_EXPIRED","message":"This coupon has expired."}}
```
Use meaningful error codes and appropriate HTTP status codes.

## Wallet, Rewards, QR and Coupon Rules
- Wallet/reward operations are server-controlled and auditable.
- Maintain immutable transaction records for financial/reward operations.
- Current customer wallet rules include 1 coin = ₹1, minimum redemption 50 coins, and maximum balance 100 coins.
- QR scan limit: 3 scans per customer per day; frontend may display remaining count, backend enforces it.
- Streaks are calculated server-side; current documented milestones are 10/20/30 days = +10 coins, with three consecutive inactive days resetting the streak.
- Flyer coupons are one-time; current documented validity is 96 hours.

## Payments
Razorpay is authoritative for payment verification. Do not activate subscriptions based only on a frontend success message. Verify payment/webhook server-side.

## Storage
Use Cloudflare R2 for large binary assets such as business images and flyers. Store metadata such as IDs, storage keys, status, and timestamps in Convex; do not store large flyer binaries in the database.

## Frontend Rules
- Responsive design is mandatory.
- Reusable components are mandatory where UI is shared.
- Keep Business Owner and Customer experiences clearly separated, including their layouts.
- Keep business logic out of React components when it belongs in backend services.
- Tailwind CSS is the styling system.

## AI-Agent Rules
When modifying the repository:
1. Inspect existing code and architecture before changing it.
2. Follow the existing architecture; do not invent a competing pattern.
3. Put new functionality in the appropriate existing module.
4. Do not unnecessarily rewrite existing code.
5. Preserve module boundaries.
6. Do not access another module's internal repository directly.
7. Use integration/service abstractions for external APIs.
8. Do not modify unrelated files.
9. Reuse existing utilities/components where appropriate.
10. Prefer small, focused changes.
11. Keep business rules server-side.
12. Validate API input with Zod.
13. Preserve API contracts unless a change is explicitly required.
14. Add/update tests for relevant behavior.
15. Run relevant checks after changes.
16. Update documentation for major feature/architecture changes.
17. Never expose secrets.
18. Do not add dependencies unless genuinely required.
19. Before creating a new module, check whether an existing module owns the responsibility.
20. When uncertain, inspect implementation and documentation rather than guessing.

## Git Branching
Use feature-wise branches from `main`:
```text
main
├── feature/<feature-name>
├── fix/<issue-name>
├── refactor/<area-name>
└── chore/<task-name>
```
- Do not normally develop directly on `main`.
- Keep each branch focused.
- Open a Pull Request for merge to `main`.
- Do not mix unrelated changes.

## Commit Convention
Use:
```text
feat: add flyer generation
fix: validate expired coupons
refactor: separate social integration
docs: update API documentation
chore: update dependencies
test: add wallet service tests
```
Keep commits short, specific, and meaningful.

## Pull Requests
Workflow:
```text
Feature Branch -> Code + Tests -> Pull Request -> CI -> Code Review -> Merge to main
```
PRs should describe what changed, why, testing performed, and important API/schema/config changes. Do not merge known failing CI.

## Testing
Use **Playwright** for end-to-end testing. Cover critical flows where practical, including authentication, onboarding, flyer generation/publishing, QR/rewards, coupon redemption, wallet redemption, subscription/payment flow, and owner/customer separation. Do not use real production secrets or production financial transactions in tests.

## CI/CD
GitHub Actions should run relevant checks on pushes/PRs. Recommended checks:
```text
npm install
npm run lint
npm run typecheck
npm test
npm run build
```
Include Playwright in CI where configured. Keep frontend/backend workflows separate when useful. Production deployment should be associated with protected `main`.

## Documentation
Maintain:
```text
README.md
docs/API.md
docs/ARCHITECTURE.md
AGENTS.md
```
- README: setup/getting started/development.
- API.md: endpoints, contracts, auth, behavior.
- ARCHITECTURE.md: architecture, modules, integrations, data/security/deployment flows.
- AGENTS.md: development and AI-agent rules.
Update relevant docs when major behavior or architecture changes.

## Code Quality
Prefer strong TypeScript types, small focused functions, clear module boundaries, explicit dependencies, reusable components, centralized errors, schema validation, and meaningful names.

Avoid `any` unless justified, huge controllers, business logic in routes/components, duplicate code, direct scattered provider calls, cross-module repository access, unnecessary abstractions/dependencies, and unrelated refactors.

## Change Management
Before a significant change:
1. Inspect the relevant module and dependencies.
2. Check architecture documentation.
3. Identify the correct layer/module.
4. Reuse existing abstractions.
5. Make the smallest coherent change.
6. Add/update tests.
7. Run relevant checks.
8. Update documentation if needed.

## Source of Truth
| Responsibility | Source |
|---|---|
| UI rendering | React |
| UI styling | Tailwind CSS |
| Authentication | Clerk |
| Authorization | Express/backend |
| Business logic | Backend services/use cases |
| Application state | Convex |
| Flyer/hashtag generation | xAI |
| Social publishing | Meta Graph API |
| Social metrics | Meta Graph API |
| Subscription payment | Razorpay |
| Binary assets | Cloudflare R2 |
| QR generation | `qrcode` |
| Request validation | Zod |
| Product usage analytics | Google Analytics 4 |

## Final Rule
**Understand the existing architecture first, make the smallest appropriate change, preserve module boundaries, keep business rules on the server, protect secrets, validate inputs, test the change, and update documentation when necessary.**
