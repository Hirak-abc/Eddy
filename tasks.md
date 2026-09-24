# Eddy — Development Tasks

> **Project:** Eddy — SMB Flyer & Customer Rewards Platform  
> **Architecture:** Modular monolith  
> **Frontend:** React + TypeScript + Tailwind CSS  
> **Backend:** Express.js + TypeScript  
> **Database:** Convex  
> **Authentication:** Clerk  
> **AI:** Grok / xAI API  
> **Social:** Meta Graph API / Blotato AI API  
> **Payments:** Razorpay  
> **Storage:** Cloudflare R2  
> **Validation:** Zod  
> **Hosting:** Vercel + Render/Railway  
> **CI/CD:** GitHub Actions
>
> **Priority:** P0 = MVP/core, P1 = next after design partners, P2 = later.  
> **Status:** `[ ]` Todo · `[-]` In Progress · `[x]` Done  
> **Owner:** TBD unless explicitly assigned by the team.

---

## 0. Project Setup & Team Workflow

### Repository
- [ ] Create the Eddy repository structure.
- [ ] Create `client/` React + TypeScript application.
- [ ] Create `server/` Express + TypeScript application.
- [ ] Create `convex/` database directory.
- [ ] Create `docs/` directory.
- [ ] Add root `package.json`.
- [ ] Add `.gitignore`.
- [ ] Add `.env.example`.
- [ ] Add `README.md`.
- [ ] Add `ARCHITECTURE.md`.
- [ ] Add `tasks.md`.

### Git & Collaboration
- [ ] Protect `main` branch.
- [ ] Define feature branch naming convention.
- [ ] Require pull-request review before merging.
- [ ] Require CI checks before merging.
- [ ] Connect production deployment to protected `main`.
- [ ] Define team ownership for frontend, backend, integrations, and QA.
- [ ] Define issue/PR template.

---

# Phase 1 — Foundation

## 1. Frontend Foundation [P0]

- [ ] Configure React + TypeScript.
- [ ] Configure Tailwind CSS.
- [ ] Configure application routing.
- [ ] Create shared UI components.
- [ ] Create layout components.
- [ ] Create reusable form components.
- [ ] Create loading/error/empty states.
- [ ] Create API service layer.
- [ ] Create shared TypeScript types.
- [ ] Create protected-route handling.
- [ ] Create owner application shell.
- [ ] Create customer application shell.

### Owner Pages
- [ ] Owner onboarding.
- [ ] Owner dashboard.
- [ ] Trend flyers.
- [ ] Create flyer.
- [ ] Scheduled flyers.
- [ ] Published flyers.
- [ ] Coupon management.
- [ ] Customer reviews.
- [ ] Wallet.
- [ ] QR code.
- [ ] Social media.
- [ ] Analytics.
- [ ] Business profile.
- [ ] Subscription/account settings.

### Customer Pages
- [ ] Customer home.
- [ ] Shop discovery.
- [ ] Shop environment.
- [ ] QR/reward screen.
- [ ] Spin wheel.
- [ ] Wallet.
- [ ] Rewards history.
- [ ] Coupon codes.
- [ ] Following.
- [ ] Streak.
- [ ] Transaction history.
- [ ] Review/rating flow.

---

## 2. Backend Foundation [P0]

- [ ] Configure Express application.
- [ ] Configure TypeScript.
- [ ] Create `app.ts`.
- [ ] Create `server.ts`.
- [ ] Add environment configuration.
- [ ] Add application constants.
- [ ] Add request logging.
- [ ] Add global error middleware.
- [ ] Add authentication middleware.
- [ ] Add authorization middleware.
- [ ] Add Zod validation middleware.
- [ ] Add rate-limit middleware.
- [ ] Define `/api` base route.
- [ ] Create controller/service/repository module pattern.
- [ ] Enforce module dependency boundaries.
- [ ] Keep business logic in services.
- [ ] Keep database access inside repositories/Convex functions.

---

## 3. Authentication & Identity [P0]

- [ ] Configure Clerk.
- [ ] Implement owner signup/login.
- [ ] Implement customer signup/login.
- [ ] Implement session handling.
- [ ] Map Clerk users to application users.
- [ ] Store application-specific user data in Convex.
- [ ] Implement `OWNER`, `CUSTOMER`, and `ADMIN` roles.
- [ ] Implement backend authorization checks.
- [ ] Implement account status handling.
- [ ] Add `GET /api/me`.
- [ ] Add `PATCH /api/me`.
- [ ] Test owner/customer endpoint isolation.

---

# Phase 2 — Business Owner Core

## 4. Business Module [P0]

- [ ] Create business schema.
- [ ] Create business repository.
- [ ] Create business service.
- [ ] Create business controller/routes.
- [ ] Implement business registration.
- [ ] Store business name.
- [ ] Store business category/type.
- [ ] Store business location.
- [ ] Store contact information.
- [ ] Store verification information/status.
- [ ] Store owner settings.
- [ ] Store automatic publishing preference.
- [ ] Implement business profile editing.
- [ ] Implement business image management.
- [ ] Implement `POST /api/businesses`.
- [ ] Implement `GET /api/businesses/:id`.
- [ ] Implement `PATCH /api/businesses/:id`.

### Business Images
- [ ] Support the three primary business images:
  - [ ] Shop/business image.
  - [ ] Main product image.
  - [ ] Specific product/item image.
- [ ] Allow image replacement.
- [ ] Store image metadata in Convex.
- [ ] Store image binaries in R2.

---

## 5. Subscription & Payment [P0]

- [ ] Configure Razorpay.
- [ ] Create subscription/payment flow.
- [ ] Implement owner checkout.
- [ ] Implement payment creation.
- [ ] Implement Razorpay webhook endpoint.
- [ ] Verify webhook/payment status server-side.
- [ ] Store payment records in Convex.
- [ ] Activate owner account only after verified payment.
- [ ] Handle failed payments.
- [ ] Handle duplicate webhook events safely.
- [ ] Implement subscription/account status.
- [ ] Display subscription status in owner settings.
- [ ] Record payment history.

> Current workflow uses ₹299 as the activation price. Phase 1 identifies ₹299–₹349/month as the working pricing hypothesis; exact pricing remains to be validated with design partners.

---

## 6. QR Code Module [P0]

- [ ] Create QR code schema.
- [ ] Generate one unique QR per business.
- [ ] Encode only the business identifier.
- [ ] Use the shop URL format `/shop/{businessId}`.
- [ ] Create QR generation service.
- [ ] Use the `qrcode` npm package.
- [ ] Allow owner to view QR.
- [ ] Allow owner to download/print QR.
- [ ] Implement customer QR routing.
- [ ] Prevent sensitive information from being embedded in QR.

---

# Phase 3 — AI Flyer System

## 7. Trend Discovery [P0]

- [ ] Create xAI integration layer.
- [ ] Add secure xAI API configuration.
- [ ] Create `AIService`.
- [ ] Implement trend discovery using Grok/X API.
- [ ] Fetch recent/relevant trends.
- [ ] Normalize trend data.
- [ ] Store required trend context.
- [ ] Handle API failures.
- [ ] Handle rate limits.
- [ ] Keep xAI calls behind the internal AI service.
- [ ] Do not call xAI directly from controllers/frontend.

---

## 8. Trend Analysis & Business Matching [P0]

- [ ] Build trend-analysis service.
- [ ] Pass business type to trend analysis.
- [ ] Pass business location to trend analysis.
- [ ] Pass business/product context to trend analysis.
- [ ] Determine whether a trend is relevant to a business.
- [ ] Generate a business-specific trend context.
- [ ] Handle unsuitable trends.

---

## 9. Automatic Flyer Generation [P0]

- [ ] Create flyer module.
- [ ] Create flyer schema.
- [ ] Create flyer repository.
- [ ] Create flyer service.
- [ ] Create flyer controller/routes.
- [ ] Select one of the owner's three uploaded images.
- [ ] Generate two flyer options.
- [ ] Generate flyer content using trend + business + image context.
- [ ] Generate hashtags/tags.
- [ ] Generate hidden coupon code.
- [ ] Set coupon validity to 96 hours.
- [ ] Save generated flyers as drafts.
- [ ] Store flyer metadata in Convex.
- [ ] Store generated flyer files in R2.
- [ ] Implement flyer status lifecycle:
  - [ ] `DRAFT`
  - [ ] `GENERATING`
  - [ ] `READY`
  - [ ] `SCHEDULED`
  - [ ] `PUBLISHING`
  - [ ] `PUBLISHED`
  - [ ] `FAILED`
  - [ ] `EXPIRED`

### Hashtag Generation
- [ ] Generate hashtags from business type.
- [ ] Generate hashtags from business location.
- [ ] Include flyer topic.
- [ ] Include trend context.
- [ ] Attach generated tags to the social post.

---

## 10. Automatic Flyer Background Job [P0]

- [ ] Create trend job.
- [ ] Create flyer job.
- [ ] Create scheduler/job runner.
- [ ] Run trend discovery asynchronously.
- [ ] Select relevant trend.
- [ ] Select business image.
- [ ] Generate two flyers.
- [ ] Generate hashtags.
- [ ] Generate coupon.
- [ ] Save result to Convex.
- [ ] Show generated flyers in owner dashboard.
- [ ] Prevent long-running AI work from blocking HTTP requests.

---

## 11. Owner Flyer Review & Publishing [P0]

- [ ] Show both generated flyer options.
- [ ] Show generated hashtags.
- [ ] Show coupon information/status.
- [ ] Allow owner to select one flyer.
- [ ] Publish selected flyer.
- [ ] Support automatic publishing setting.
- [ ] Start 48-hour owner decision window.
- [ ] If owner selects within 48 hours, publish selected flyer.
- [ ] If owner does not select within 48 hours and auto-publish is ON, select one flyer and publish.
- [ ] If auto-publish is OFF, do not publish automatically.
- [ ] Allow owner to disable automatic publishing.

---

## 12. Manual Flyer Creation [P1]

- [ ] Add `+ Create Flyer` flow.
- [ ] Add flyer categories:
  - [ ] Festival.
  - [ ] Discount.
  - [ ] Hiring.
  - [ ] New Product.
  - [ ] Announcement.
  - [ ] Custom.
- [ ] Collect category-specific inputs.
- [ ] Generate manual flyer using AI.
- [ ] Generate hashtags.
- [ ] Preview flyer and tags.
- [ ] Support Publish Now.
- [ ] Support Schedule.
- [ ] Enforce configured manual flyer limit.

---

# Phase 4 — Social Publishing & Analytics

## 13. Social Account Module [P0]

- [ ] Configure Meta integration.
- [ ] Implement Instagram connection.
- [ ] Implement Facebook connection.
- [ ] Store social account metadata.
- [ ] Secure access-token handling.
- [ ] Store platform account IDs.
- [ ] Implement connection status.
- [ ] Handle expired/invalid credentials.
- [ ] Handle social API errors.

---

## 14. Social Publishing [P0]

- [ ] Create social publishing service.
- [ ] Publish approved flyer image.
- [ ] Publish generated hashtags/tags.
- [ ] Store social post ID.
- [ ] Store publishing status.
- [ ] Handle failed publishing.
- [ ] Support scheduled publishing.
- [ ] Create publishing background job.
- [ ] Check scheduled time before publishing.
- [ ] Update flyer/social post status after publishing.
- [ ] Evaluate Meta API vs Blotato API for supported publishing workflows.

---

## 15. Social Analytics [P0]

- [ ] Create analytics module.
- [ ] Create analytics schema.
- [ ] Create analytics repository/service.
- [ ] Create analytics synchronization job.
- [ ] Fetch available metrics from connected social platforms.
- [ ] Store reach.
- [ ] Store reactions/engagement.
- [ ] Store comments.
- [ ] Store flyer-level performance.
- [ ] Store performance over time.
- [ ] Build owner analytics dashboard.
- [ ] Show total reach.
- [ ] Show reach per flyer.
- [ ] Show engagement per flyer.
- [ ] Show comments per flyer.
- [ ] Show best-performing flyers.
- [ ] Clearly handle metrics unavailable through platform APIs.

---

# Phase 5 — Customer Rewards

## 16. Customer Shop Environment [P0]

- [ ] Create `/shop/:businessId` experience.
- [ ] Show business information.
- [ ] Show applicable flyers/offers.
- [ ] Show spin wheel.
- [ ] Show available coupons.
- [ ] Show customer reward information.
- [ ] Ensure QR is the primary entry point for rewards.
- [ ] Keep shop discovery optional.

---

## 17. QR Scan Tracking & Limits [P0]

- [ ] Create QR scan schema.
- [ ] Record customer ID.
- [ ] Record business ID.
- [ ] Record scan timestamp.
- [ ] Authenticate customer where required.
- [ ] Check daily scan count server-side.
- [ ] Enforce maximum 3 scans/customer/day.
- [ ] Return remaining daily scan count.
- [ ] Reject scans after the daily limit.
- [ ] Prevent frontend-only enforcement.

---

## 18. Spin Wheel & Reward Engine [P0]

- [ ] Create rewards module.
- [ ] Create reward configuration schema.
- [ ] Create reward claim schema.
- [ ] Implement spin endpoint.
- [ ] Enforce one valid reward result per spin.
- [ ] Support configured coin rewards.
- [ ] Support configured discount rewards.
- [ ] Support configured free-item/other rewards.
- [ ] Record every reward claim server-side.
- [ ] Prevent reward manipulation from the frontend.
- [ ] Add reward history.

---

## 19. Customer Wallet [P0]

- [ ] Create customer wallet schema.
- [ ] Create owner wallet schema.
- [ ] Create wallet service.
- [ ] Implement coin balance.
- [ ] Enforce `1 coin = ₹1`.
- [ ] Enforce minimum redemption of 50 coins.
- [ ] Enforce maximum customer balance of 100 coins.
- [ ] Deduct redeemed coins server-side.
- [ ] Display wallet balance.
- [ ] Display transaction history.
- [ ] Prevent negative balances.
- [ ] Prevent balance manipulation from the frontend.

---

## 20. Wallet Transaction Ledger [P0]

- [ ] Create immutable wallet transaction records.
- [ ] Store transaction ID.
- [ ] Store transaction type.
- [ ] Store customer ID.
- [ ] Store business ID.
- [ ] Store amount.
- [ ] Store coin amount.
- [ ] Store transaction status.
- [ ] Store timestamps.
- [ ] Store approval timestamp where applicable.
- [ ] Store transaction metadata.
- [ ] Support:
  - [ ] `COIN_REWARD`
  - [ ] `COIN_REDEMPTION`
  - [ ] `DISCOUNT_REDEMPTION`
  - [ ] `STREAK_BONUS`
  - [ ] `FOLLOW_REWARD`
  - [ ] `COUPON_REDEMPTION`

---

## 21. Coin Redemption [P0]

- [ ] Create pending redemption request.
- [ ] Show customer username and requested amount to owner.
- [ ] Allow owner to Approve.
- [ ] Allow owner to Reject.
- [ ] Reject without changing wallet balances.
- [ ] On approval, deduct customer coins.
- [ ] On approval, credit equivalent rupee value to owner wallet.
- [ ] Mark transaction completed.
- [ ] Send confirmation to customer.
- [ ] Record transaction permanently.
- [ ] Ensure approval operation is atomic/idempotent.

---

## 22. Discount Redemption [P0]

- [ ] Allow owner to enter/send product price.
- [ ] Calculate configured discount.
- [ ] Show original price.
- [ ] Show discount amount.
- [ ] Show final price.
- [ ] Require customer confirmation.
- [ ] Record discount amount in owner wallet.
- [ ] Record discount transaction.
- [ ] Prevent duplicate discount redemption.

---

## 23. Flyer Coupons [P0]

- [ ] Create coupon schema.
- [ ] Generate unique coupon code per flyer.
- [ ] Associate coupon with business/flyer.
- [ ] Set 96-hour validity.
- [ ] Enforce one-time use.
- [ ] Implement coupon entry after QR scan.
- [ ] Verify business.
- [ ] Verify expiry.
- [ ] Verify unused status.
- [ ] Grant configured reward on successful redemption.
- [ ] Mark coupon as used.
- [ ] Reject invalid/expired/already-used coupons.
- [ ] Record coupon redemption transaction.

---

# Phase 6 — Retention & Feedback

## 24. Social Follow Rewards [P1]

- [ ] Add Instagram follow option.
- [ ] Add Facebook follow option.
- [ ] Configure follow reward.
- [ ] Current workflow specifies 10 coins per platform.
- [ ] Grant reward once per platform/customer/business.
- [ ] Track follow reward history.
- [ ] Handle unfollow according to configured rules.
- [ ] Prevent follow → unfollow → follow reward farming.
- [ ] Do not rely solely on frontend state for reward eligibility.

---

## 25. Streak Rewards [P1]

- [ ] Create streak schema.
- [ ] Create streak activity schema.
- [ ] Calculate streak server-side.
- [ ] Count eligible QR activity by day.
- [ ] Allow activity across different participating shops.
- [ ] Increment streak on eligible consecutive days.
- [ ] Award 10 bonus coins at each 10-day milestone.
- [ ] Respect 100-coin wallet limit when awarding bonus coins.
- [ ] Reset streak after 3 consecutive inactive days.
- [ ] Record streak activity server-side.
- [ ] Prevent artificial streak creation.
- [ ] Add streak dashboard/history.

---

## 26. Ratings, Reviews & Feedback [P1]

- [ ] Create review schema.
- [ ] Trigger rating after eligible interaction.
- [ ] Support 1–5 star rating.
- [ ] Route 4–5 star users to configured Google review destination.
- [ ] Show in-app review form for 1–3 stars.
- [ ] Store in-app reviews.
- [ ] Show reviews in owner dashboard.
- [ ] Associate reviews with customer/business interaction.

---

## 27. Customer History [P1]

- [ ] Show coin transactions.
- [ ] Show rewards received.
- [ ] Show discounts used.
- [ ] Show flyer coupons used.
- [ ] Show shop interactions.
- [ ] Show follow rewards.
- [ ] Show streak history.
- [ ] Show transaction status/history.

---

# Phase 7 — Shop Discovery

## 28. Shop Discovery [P1]

- [ ] Create discovery module.
- [ ] Allow customers to search participating shops by location.
- [ ] Allow filtering by business type/category.
- [ ] Show participating shops.
- [ ] Show shop profile.
- [ ] Show offers.
- [ ] Show flyers.
- [ ] Keep discovery optional rather than requiring search before QR rewards.

---

# Phase 8 — Database & Storage

## 29. Convex Schema [P0]

- [ ] Create `users`.
- [ ] Create `businesses`.
- [ ] Create `businessImages`.
- [ ] Create `socialAccounts`.
- [ ] Create `flyers`.
- [ ] Create `flyerVersions`.
- [ ] Create `scheduledFlyers`.
- [ ] Create `coupons`.
- [ ] Create `couponRedemptions`.
- [ ] Create `rewards`.
- [ ] Create `rewardConfigurations`.
- [ ] Create `rewardClaims`.
- [ ] Create `customerWallets`.
- [ ] Create `ownerWallets`.
- [ ] Create `walletTransactions`.
- [ ] Create `qrScans`.
- [ ] Create `streaks`.
- [ ] Create `streakActivities`.
- [ ] Create `reviews`.
- [ ] Create `subscriptions`.
- [ ] Create `payments`.
- [ ] Create `socialPosts`.
- [ ] Create `socialMetrics`.
- [ ] Create `analyticsSnapshots`.
- [ ] Add indexes required by application queries.
- [ ] Validate domain relationships.

---

## 30. Cloudflare R2 Storage [P0]

- [ ] Configure R2.
- [ ] Create storage service abstraction.
- [ ] Store business images in R2.
- [ ] Store generated flyers in R2.
- [ ] Use business/flyer-based storage keys.
- [ ] Store storage metadata in Convex.
- [ ] Do not store large binary flyer files directly in Convex.
- [ ] Handle upload failures.
- [ ] Handle deletion/replacement of old assets.

---

# Phase 9 — API Layer

## 31. Identity APIs [P0]

- [ ] `GET /api/me`
- [ ] `PATCH /api/me`

## 32. Business APIs [P0]

- [ ] `POST /api/businesses`
- [ ] `GET /api/businesses/:id`
- [ ] `PATCH /api/businesses/:id`

## 33. Flyer APIs [P0]

- [ ] `POST /api/flyers`
- [ ] `GET /api/flyers`
- [ ] `GET /api/flyers/:id`
- [ ] `POST /api/flyers/:id/select`
- [ ] `POST /api/flyers/:id/publish`
- [ ] `POST /api/flyers/:id/schedule`

## 34. Reward APIs [P0]

- [ ] `GET /api/businesses/:id/rewards`
- [ ] `POST /api/businesses/:id/rewards/spin`

## 35. QR APIs [P0]

- [ ] `GET /api/businesses/:id/qr`
- [ ] `POST /api/qr/:businessId/scan`

## 36. Additional APIs [P0/P1]

- [ ] Wallet endpoints.
- [ ] Coupon endpoints.
- [ ] Social connection endpoints.
- [ ] Social publishing endpoints.
- [ ] Analytics endpoints.
- [ ] Review endpoints.
- [ ] Streak endpoints.
- [ ] Follow reward endpoints.
- [ ] Shop discovery endpoints.
- [ ] Subscription/payment endpoints.
- [ ] Transaction approval/rejection endpoints.

---

# Phase 10 — Validation, Security & Reliability

## 37. API Validation [P0]

- [ ] Create Zod schemas for request bodies.
- [ ] Create Zod schemas for query parameters.
- [ ] Create Zod schemas for route parameters.
- [ ] Validate external API responses where useful.
- [ ] Return consistent `400` validation errors.
- [ ] Validate all owner/customer inputs server-side.

## 38. Authorization & Data Isolation [P0]

- [ ] Verify resource ownership on every owner endpoint.
- [ ] Prevent customers from accessing owner endpoints.
- [ ] Prevent one owner from accessing another owner's business data.
- [ ] Prevent one customer from modifying another customer's wallet.
- [ ] Enforce reward rules server-side.
- [ ] Enforce coupon rules server-side.
- [ ] Enforce QR limits server-side.
- [ ] Enforce wallet limits server-side.
- [ ] Enforce subscription status server-side.

## 39. Fraud & Transaction Safety [P0]

- [ ] Make wallet operations server-controlled.
- [ ] Maintain immutable transaction ledger.
- [ ] Prevent duplicate reward claims.
- [ ] Prevent duplicate coupon redemption.
- [ ] Prevent duplicate payment processing.
- [ ] Prevent duplicate webhook processing.
- [ ] Prevent duplicate owner approval.
- [ ] Add rate limiting to sensitive endpoints.
- [ ] Add audit-friendly transaction metadata.

## 40. Error Handling [P0]

- [ ] Standardize API error responses.
- [ ] Handle AI API errors.
- [ ] Handle Meta API errors.
- [ ] Handle Razorpay errors.
- [ ] Handle Clerk errors.
- [ ] Handle R2 errors.
- [ ] Handle Convex errors.
- [ ] Add frontend error states.
- [ ] Add retry handling where appropriate.
- [ ] Ensure background jobs can fail without corrupting application state.

---

# Phase 11 — Testing

## 41. Unit Tests [P0]

- [ ] Test business rules.
- [ ] Test wallet calculations.
- [ ] Test wallet limits.
- [ ] Test QR daily limit.
- [ ] Test reward calculation.
- [ ] Test streak calculation.
- [ ] Test coupon expiry.
- [ ] Test one-time coupon usage.
- [ ] Test transaction state transitions.
- [ ] Test discount calculation.
- [ ] Test authorization rules.
- [ ] Test flyer status transitions.

## 42. Integration Tests [P0]

- [ ] Test owner signup → payment → activation.
- [ ] Test business creation.
- [ ] Test image upload.
- [ ] Test QR generation.
- [ ] Test QR scan → reward.
- [ ] Test flyer generation workflow.
- [ ] Test owner flyer selection.
- [ ] Test social publishing integration.
- [ ] Test wallet redemption.
- [ ] Test owner approval/rejection.
- [ ] Test coupon redemption.
- [ ] Test analytics synchronization.
- [ ] Test payment webhook.

## 43. End-to-End Tests [P0]

### Owner Flow
- [ ] Signup/login.
- [ ] Business registration.
- [ ] Payment.
- [ ] Business activation.
- [ ] Upload three images.
- [ ] Connect Instagram/Facebook.
- [ ] Generate QR.
- [ ] Generate trend flyers.
- [ ] Review/select flyer.
- [ ] Publish flyer.
- [ ] View analytics.

### Customer Flow
- [ ] Signup/login.
- [ ] Scan business QR.
- [ ] Enter shop environment.
- [ ] Spin wheel.
- [ ] Receive reward.
- [ ] View wallet.
- [ ] Redeem coins.
- [ ] Owner approves/rejects.
- [ ] Verify transaction.
- [ ] Redeem coupon.
- [ ] Complete rating/review flow.

---

# Phase 12 — Deployment & CI/CD

## 44. Environment Configuration [P0]

- [ ] Create development environment.
- [ ] Create staging environment.
- [ ] Create production environment.
- [ ] Configure Clerk secrets.
- [ ] Configure Convex environment.
- [ ] Configure xAI credentials.
- [ ] Configure Meta credentials.
- [ ] Configure Razorpay credentials.
- [ ] Configure R2 credentials.
- [ ] Configure GA4.
- [ ] Keep secrets out of Git.

## 45. Frontend Deployment [P0]

- [ ] Deploy React application to Vercel.
- [ ] Configure frontend environment variables.
- [ ] Configure production API URL.
- [ ] Verify production routing.
- [ ] Verify authentication in production.

## 46. Backend Deployment [P0]

- [ ] Deploy Express API to Render/Railway.
- [ ] Configure backend environment variables.
- [ ] Configure background jobs.
- [ ] Configure webhook endpoints.
- [ ] Verify external API connectivity.
- [ ] Verify production health endpoint.

## 47. GitHub Actions [P0]

- [ ] Create frontend CI workflow.
- [ ] Create backend CI workflow.
- [ ] Install dependencies.
- [ ] Run lint.
- [ ] Run TypeScript typecheck.
- [ ] Run unit tests.
- [ ] Run build.
- [ ] Run CI on pull requests.
- [ ] Run CI on pushes to relevant branches.
- [ ] Connect production deployment to protected `main`.

---

# Phase 13 — Product Validation

## 48. Design Partner Validation [P0]

- [ ] Recruit at least three active design partners.
- [ ] Test the complete owner-to-customer workflow with design partners.
- [ ] Measure whether owners can use the product with minimal effort.
- [ ] Measure customer QR/reward participation.
- [ ] Measure follows where enabled.
- [ ] Measure shop visits/purchases where measurable.
- [ ] Measure repeat engagement.
- [ ] Collect owner feedback.
- [ ] Collect customer feedback.
- [ ] Record pricing objections.
- [ ] Test the ₹299 working price hypothesis.
- [ ] Evaluate whether ₹349 or higher can be justified by demonstrated value.
- [ ] Identify features blocking conversion.
- [ ] Translate feedback into product changes.

## 49. MVP Validation Questions

- [ ] Are generated advertisements relevant and useful?
- [ ] Do SMB owners trust the generated recommendations?
- [ ] Does automated publishing reduce owner effort?
- [ ] Do customers engage with QR rewards?
- [ ] Do rewards/discounts encourage purchases?
- [ ] Do rewards/discounts encourage repeat visits?
- [ ] How frequently do businesses use the platform?
- [ ] Can the product demonstrate measurable business value?
- [ ] Will businesses pay for the recurring value?

---

# Phase 14 — P1 Features

- [ ] Social follow rewards.
- [ ] Streak rewards.
- [ ] Ratings/reviews/feedback system.
- [ ] Campaign history and management.
- [ ] Customer history.
- [ ] Shop discovery.
- [ ] Expanded manual flyer workflows.
- [ ] Additional supported social publishing integrations where validated.
- [ ] Additional analytics views where useful.

---

# Phase 15 — P2 / Later Features

> Build these only after the core workflow and design-partner validation provide evidence that they are needed.

- [ ] Expand beyond the validated MVP feature set.
- [ ] Add additional social platforms where justified.
- [ ] Consider extracting high-load modules into separate services only when measurable scale requires it.
- [ ] Add advanced analytics.
- [ ] Add advanced campaign management.
- [ ] Add additional reward types.
- [ ] Add additional automation based on validated customer/business needs.

---

# Phase 16 — Documentation

- [ ] Document architecture.
- [ ] Document repository structure.
- [ ] Document environment variables.
- [ ] Document API endpoints.
- [ ] Document Convex schema.
- [ ] Document module boundaries.
- [ ] Document external integrations.
- [ ] Document wallet/transaction rules.
- [ ] Document reward rules.
- [ ] Document coupon rules.
- [ ] Document QR rules.
- [ ] Document deployment process.
- [ ] Document local development setup.
- [ ] Document CI/CD process.
- [ ] Document design-partner feedback and decisions.

---

# Current Product Rules

These rules are taken from the current workflow/architecture and should be treated as configurable business rules where appropriate.

- Owner subscription/activation price currently specified in the workflow: **₹299**.
- Customer access: **Free**.
- Customer QR scans: **Maximum 3 per day**.
- Customer wallet redemption minimum: **50 coins**.
- Customer wallet maximum: **100 coins**.
- Coin value: **1 coin = ₹1**.
- Owner wallet: **No upper limit under the proposed model**.
- Automatic flyer publication: **After 48 hours only when enabled by the owner**.
- Flyer coupon validity: **96 hours**.
- Flyer coupon usage: **One-time**.
- Coin redemption: **Requires owner approval**.
- Discount redemption: **Requires customer confirmation of the displayed price**.
- Hashtag generation uses **business type + location + flyer topic/trend**.
- Streak milestone: **Every 10 eligible consecutive active days → +10 coins**.
- Streak reset: **3 consecutive inactive days**.
- Wallet/reward transactions: **Stored server-side for verification, fraud prevention and settlement**.

---

# Open Decisions / Risks

- [ ] Finalize subscription price after design-partner validation.
- [ ] Confirm whether Meta Graph API, Blotato AI API, or both will be used for the MVP publishing path.
- [ ] Confirm exact social platforms supported in the first production release.
- [ ] Confirm exact reward probabilities/configuration for the spin wheel.
- [ ] Confirm final manual flyer-generation limit.
- [ ] Confirm exact follow-reward verification mechanism.
- [ ] Confirm monthly owner settlement workflow.
- [ ] Confirm available Meta analytics metrics for the connected account types.
- [ ] Confirm verification requirements for business onboarding.
- [ ] Confirm the minimum set of P1 features to include before paid conversion.
- [ ] Avoid unrestricted social-media scraping as a core dependency.
- [ ] Keep WhatsApp direct advertising outside the MVP unless platform constraints and product validation change.
- [ ] Prevent MVP scope from becoming too broad.
- [ ] Ensure design-partner feedback is converted into concrete product changes.

---

# MVP Definition of Done

The MVP is ready for design-partner testing when:

- [ ] An owner can sign up/login.
- [ ] An owner can register and activate a business.
- [ ] Payment can be verified server-side.
- [ ] An owner can upload three business images.
- [ ] An owner can connect the required social accounts.
- [ ] The system generates a business QR code.
- [ ] The system can discover a trend through the selected API.
- [ ] The system can match the trend to the business.
- [ ] The system generates two flyer options.
- [ ] The system generates hashtags.
- [ ] The system generates a hidden one-time coupon.
- [ ] The owner can review/select a flyer.
- [ ] The selected flyer can be published.
- [ ] Automatic publishing after 48 hours works when enabled.
- [ ] A customer can scan the QR.
- [ ] The 3-scans/day limit is enforced server-side.
- [ ] A customer can spin the reward wheel.
- [ ] Rewards are recorded server-side.
- [ ] Coins appear in the customer wallet.
- [ ] Customer wallet limits are enforced.
- [ ] A customer can request coin redemption.
- [ ] An owner can approve/reject the request.
- [ ] Approved redemption updates both wallets correctly.
- [ ] Every reward/wallet transaction is permanently recorded.
- [ ] A customer can redeem a valid flyer coupon.
- [ ] Invalid/expired/used coupons are rejected.
- [ ] Published flyer analytics can be synchronized where the connected social APIs expose them.
- [ ] Owner analytics are visible.
- [ ] Authentication and authorization are enforced server-side.
- [ ] Core unit/integration/end-to-end tests pass.
- [ ] CI checks pass.
- [ ] Frontend and backend are deployed.
- [ ] At least three design partners can test the workflow.
- [ ] The team has collected measurable feedback on usefulness, customer engagement, business value, and willingness to pay.

---

# Notes

- Tasks marked P0 follow the Phase 1 MVP priority direction and the core end-to-end workflow.
- P1/P2 items are intentionally separated so the team does not expand the MVP before validating the core workflow.
- Do not assign task ownership in this file until the team explicitly agrees on responsibilities.
