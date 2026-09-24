# SMB Flyer & Customer Rewards Platform

## Product Requirements Document

**Team:** Nightwing\
**Team members:** Prem Kumar, Hirak Nath, Bhaskar Mahato, Satish Maht\
**Working subscription hypothesis:** ₹299/month for business owners\
**Customer access:** Free

------------------------------------------------------------------------

## 1. Problem / Opportunity

Small local businesses do not have the same marketing resources as
larger companies. Most depend on walk-in customers, word of mouth,
repeat customers, or occasional social-media posts. The problem is not
that these businesses do not know Instagram or Facebook exist. The
problem is that regular promotion takes time, creativity, and people.

The Phase 1 conversations support this. Across 40 conversations,
difficulty increasing visibility and attracting new customers appeared 8
times. Hiring and training employees was mentioned 6 times, while the
difficulty of giving competitive discounts without damaging margins
appeared 5 times.

For many owners, promotion is still manual. Some use WhatsApp, word of
mouth, printed pamphlets, or simple social posts. Others try
general-purpose design tools. These approaches either take too much time
or do not give the owner a simple way to connect promotion with an
actual shop visit or purchase.

There is a second problem after a customer notices a business: getting
the customer to actually buy and come back. A social-media post can
create attention, but attention alone does not guarantee a visit,
purchase, or repeat visit. Customers may still compare prices with
online stores or nearby competitors.

That is the opportunity for this product:

> **Help local businesses create and publish relevant promotional
> content with very little effort, then give customers a simple reason
> to visit, interact, buy, and return.**

The product therefore combines two parts that are normally handled
separately:

1.  **Customer acquisition:** trend-based flyers, offers, coupons, and
    social publishing.
2.  **Customer engagement:** QR rewards, coins, discounts, streaks, and
    feedback.

The product should not try to become a complete marketing agency for
SMBs. The MVP should prove one simple loop:

**Business gets a useful promotion → promotion reaches customers →
customer visits the shop → customer receives a reward/offer → business
can see the interaction.**

------------------------------------------------------------------------

## 2. Target Users & Use Cases

### 2.1 Primary user: SMB owner

The initial target is an owner-operated or small-team local business
that:

-   depends mainly on local/walk-in customers;
-   has limited time for marketing;
-   does not have a dedicated marketing employee;
-   wants more visibility or repeat customers;
-   uses, or is willing to use, Instagram/Facebook;
-   can benefit from local offers or promotions.

Initial business types include:

-   local retail shops;
-   small food outlets and restaurants;
-   salons and beauty businesses;
-   service-based local businesses;
-   other neighbourhood SMBs.

The first design partners should be businesses where customer footfall
and local visibility matter directly.

### 2.2 Secondary user: customer

The customer is someone who visits or discovers a participating local
business and wants:

-   a discount or reward;
-   a simple loyalty mechanism;
-   useful local offers;
-   a reason to return to a shop;
-   a quick way to interact with promotions.

Customer access is free.

### 2.3 Core use cases

**Owner**

1.  Set up the business once.
2.  Give the platform enough business context to create relevant flyers.
3.  Review and publish a generated promotion.
4.  Put a QR code in the physical shop.
5.  See customer reward activity.
6.  Track basic performance of published flyers.
7.  Manage offers, coupons and wallet transactions.

**Customer**

1.  See a promotion on social media.
2.  Visit a participating shop.
3.  Scan the shop QR code.
4.  Spin for a reward or use an available offer.
5.  Collect coins or discounts.
6.  Redeem eligible rewards.
7.  Return to the shop and continue earning rewards.
8.  Leave feedback after an eligible interaction.

------------------------------------------------------------------------

## 3. Current Journey / Landscape

Today, a typical small business may follow a fragmented process:

**Think of an offer → make a poster or message → post/share it manually
→ wait for customers → explain the offer at the shop → give the discount
manually → hope the customer returns.**

There is little connection between these steps.

### Current workarounds seen in Phase 1

-   Printed pamphlets and manual distribution.
-   Word of mouth.
-   WhatsApp messages and broadcast groups.
-   Basic Facebook/Instagram posts.
-   General-purpose design tools such as Canva.
-   Copying competitor promotions or generic templates.
-   Hiring people or agencies for advertising.

These options are not necessarily bad on their own. The issue is that
they require the business owner to do much of the work and do not
naturally connect online promotion with an in-store customer journey.

### Existing solution landscape

The team reviewed tools such as Canva, AdCreative.ai, Meta Ads
Manager/Smart Ads, and local designers/agencies.

The product is not trying to replace all of these tools. The intended
difference is the workflow:

**business context + current trend → ready-to-use local promotion →
publishing → in-store QR reward → customer engagement**

The focus is on reducing the work required from a local business owner
rather than giving them another design tool to learn.

------------------------------------------------------------------------

## 4. Proposed Solution

### Elevator pitch

A local business connects its social accounts, adds basic business
information and uploads a few images. The platform finds relevant
trends, turns them into business-specific promotional flyers, and
prepares them for publishing.

The promotion can also contain a one-time coupon. At the physical shop,
customers scan the business QR code to access rewards, discounts and
coins. This creates a link between online promotion and offline customer
activity.

### The three main value propositions

1.  **Less marketing work for the owner**\
    The owner does not have to start every promotion from a blank page.

2.  **A direct online-to-store connection**\
    Flyers and coupons bring customers into a reward flow that continues
    at the physical shop.

3.  **A simple reason for customers to return**\
    Coins, discounts and streak rewards create an ongoing customer
    relationship instead of a one-time advertisement.

### Conceptual model

``` text
                BUSINESS OWNER
                     |
          Business profile + images
                     |
                     v
              Trend discovery
                     |
                     v
            Trend/business match
                     |
                     v
          Flyer + offer + coupon
                     |
              Owner approval
                     |
                     v
       Instagram / Facebook publishing
                     |
                     v
                  CUSTOMER
                     |
             Sees promotion
                     |
             Visits the shop
                     |
                 Scan QR
                     |
                     v
          Reward / Coupon / Discount
                     |
              Coins / Wallet
                     |
              Repeat interaction
                     |
                     v
              Business feedback
```

------------------------------------------------------------------------

## 5. Goals / Measurable Outcomes

For Phase 2, the product should answer three practical questions:

1.  **Can an SMB owner create and publish a useful promotion with very
    little effort?**
2.  **Do customers actually use the QR/reward flow when they visit the
    shop?**
3.  **Do design partners see enough business value to keep using the
    product and consider paying for it?**

The team should measure these through actual design-partner usage rather
than relying only on feature completion.

------------------------------------------------------------------------

## 6. MVP / Functional Requirements

The MVP is intentionally limited to the complete core loop. Features
that are useful but not necessary to prove the loop should remain
outside the first release.

### Priority definitions

-   **P0:** Required for the MVP to prove the core product loop.
-   **P1:** Important after the basic loop works and design partners are
    using it.
-   **P2:** Later improvements; not required to validate the initial
    product.

------------------------------------------------------------------------

### CUJ 1 --- Business owner onboarding

#### \[P0\] Create business account

The owner must be able to:

-   select **Business Owner** during signup;
-   sign up or log in;
-   provide business name;
-   select business type/category;
-   provide location;
-   provide contact details;
-   complete required verification information;
-   pay the subscription;
-   connect supported social accounts.

The working product flow uses a **₹299 subscription** for the business
owner. Phase 2 should test whether ₹299 is comfortable and whether
additional value can support a price closer to ₹349.

#### \[P0\] Business profile

The owner must be able to maintain:

-   business name;
-   category;
-   location;
-   contact information;
-   basic business description;
-   products/services;
-   offers;
-   social accounts.

Business type and location must be available to the promotion system
because they are also used when generating local tags/hashtags.

#### \[P0\] Business images

The owner uploads three primary images:

1.  business/shop image;
2.  main product image;
3.  specific product/item image.

The owner can replace these later.

#### \[P0\] Shop QR code

After activation, the platform generates a unique QR code for the
business.

The owner can download/print it and place it in the physical shop.

------------------------------------------------------------------------

### CUJ 2 --- Create a promotion with minimal effort

#### \[P0\] Trend discovery

The platform should identify recent/relevant trends without requiring
the business owner to manually search for them.

The current Phase 2 direction is to use available APIs rather than
unrestricted scraping. The Phase 1 plan specifically considered **Grok/X
API** for trend discovery and analysis.

The MVP should treat API availability and platform rules as a dependency
rather than assuming unrestricted access.

#### \[P0\] Trend/business matching

The system should determine whether a trend is relevant to the business.

The generated promotion should use:

-   business type;
-   business context;
-   products/services;
-   offers;
-   location;
-   selected trend.

The owner should not need to understand how the matching works.

#### \[P0\] Generate flyer options

For an automatic trend-based campaign:

1.  select a relevant trend;
2.  select one of the business images;
3.  combine the trend with the business context;
4.  generate two flyer options;
5.  generate relevant tags/hashtags;
6.  create a one-time coupon code;
7.  show the results to the owner.

The owner chooses which flyer to publish.

#### \[P0\] Tags and hashtags

Tags should be based on:

**business type + location + flyer topic/trend**

For example, a food business in Hazratganj, Lucknow may receive local
tags such as:

`#Hazratganj`\
`#HazratGanjLucknow`\
`#LucknowEats`\
`#HazratganjEats`

The examples are illustrative; the system should generate tags
appropriate to the actual business.

#### \[P0\] Owner approval

The owner must be able to preview:

-   flyer;
-   generated tags;
-   coupon.

The owner can approve one option for publishing.

#### \[P0\] Multi-platform publishing

Approved content should be publishable to connected supported social
platforms.

The current plan is to use available integrations/API aggregation rather
than building and maintaining a separate custom integration for every
platform. Phase 1 identified **Blotato AI API** as the planned
publishing route for supported platforms.

#### \[P1\] Automatic publishing

If enabled by the owner:

-   generated flyers remain available for 48 hours for owner selection;
-   if the owner does not select one within 48 hours, one flyer may be
    selected automatically;
-   if automatic publishing is disabled, nothing is published
    automatically.

The owner can disable this setting.

------------------------------------------------------------------------

### CUJ 3 --- Manual flyer creation

#### \[P0\] Create flyer manually

The owner can use **+ Create Flyer**.

The platform asks what type of flyer is needed, for example:

-   Festival;
-   Discount;
-   Hiring;
-   New Product;
-   Announcement;
-   Custom.

The owner answers a small number of relevant questions.

The system generates:

-   flyer;
-   relevant tags;
-   preview.

The owner can then choose:

-   **Publish Now**
-   **Schedule**

The exact manual-generation frequency is configurable; the current
product flow assumes a limit such as one manual flyer every 4--5 days.

------------------------------------------------------------------------

### CUJ 4 --- Customer discovers a reward

#### \[P0\] Customer account

Customers can create a free account and reach the customer home screen.

The home screen can provide:

-   Search Shops;
-   Scan QR;
-   Wallet;
-   My Rewards;
-   Coupon Codes;
-   Following;
-   Streak;
-   Transaction History.

#### \[P0\] Shop QR entry

QR scanning is the primary customer entry point.

The normal journey is:

**Visit shop → see QR → scan QR → enter shop environment**

Shop search is optional and mainly supports discovery.

#### \[P0\] Spin wheel

After scanning a shop QR, the customer can spin the shop's reward wheel.

Possible rewards include:

-   percentage discount;
-   coins;
-   free item;
-   other configured rewards.

The reward must be recorded against the customer and shop.

#### \[P0\] Daily QR limit

The platform tracks QR activity.

The current rule is:

-   maximum **3 QR scans per customer per day**;
-   after the third scan, additional scans are blocked until the next
    day.

This rule should be enforced server-side.

------------------------------------------------------------------------

### CUJ 5 --- Customer wallet and redemption

#### \[P0\] Customer coin wallet

Current rules:

-   **1 coin = ₹1**
-   minimum redemption balance: **50 coins**
-   maximum wallet balance: **100 coins**

The customer can see:

-   current balance;
-   earned coins;
-   redeemed coins;
-   transaction history.

#### \[P0\] Coin redemption

Example:

A customer has 70 coins and wants to use 50.

1.  Customer selects **Use 50 Coins**.
2.  Platform creates a pending redemption request.
3.  Owner sees the customer username and requested amount.
4.  Owner chooses **Approve** or **Reject**.
5.  If rejected, wallets do not change.
6.  If approved, 50 customer coins are deducted.
7.  ₹50 is added to the owner's wallet.
8.  Both sides receive confirmation.
9.  The transaction is permanently recorded.

Owner approval is required because the redemption represents a real
in-store transaction.

#### \[P0\] Discount redemption

The owner enters or sends the product price.

The platform shows:

-   original price;
-   discount;
-   final amount.

The customer confirms the displayed price and pays the discounted
amount. The discount value is recorded in the owner's wallet and the
transaction is stored.

------------------------------------------------------------------------

### CUJ 6 --- Flyer coupon redemption

#### \[P0\] One-time flyer coupon

A published flyer can contain a one-time code, for example:

`DIWALI27`

The customer flow is:

**See flyer → note code → visit shop → scan QR → enter code → platform
verifies → reward is granted**

The platform checks:

-   correct shop;
-   valid code;
-   expiry;
-   previous usage.

Current coupon rules:

-   validity: **96 hours**;
-   one-time use.

Invalid, expired or already-used codes must not provide the reward.

------------------------------------------------------------------------

### CUJ 7 --- Repeat engagement

#### \[P1\] Social follow rewards

Customers can follow the participating business on supported social
platforms.

Current proposed reward:

-   one follow: 10 coins;
-   two supported follows: 20 coins total.

The platform should prevent repeated follow → unfollow → follow reward
farming.

#### \[P1\] Streaks

A streak is based on eligible QR-based shop activity.

The customer can use different participating shops; the same shop is not
required.

Current rules:

-   each eligible active day increases the streak by 1;
-   every 10-day milestone gives 10 bonus coins;
-   bonus coins remain subject to the 100-coin wallet limit;
-   3 consecutive inactive days reset the streak to 0;
-   streak activity is recorded server-side.

------------------------------------------------------------------------

### CUJ 8 --- Reviews and feedback

#### \[P1\] Rating

After an eligible interaction, the customer can give a 1--5 star rating.

Current routing:

-   4--5 stars → business's Google Maps/review destination;
-   1--3 stars → in-platform review form.

The owner can view in-platform reviews from the dashboard.

This feature should be treated as a feedback mechanism first, not as a
substitute for understanding customer complaints.

------------------------------------------------------------------------

### CUJ 9 --- Owner dashboard

#### \[P0\] Core dashboard

The owner dashboard should provide access to:

-   Trend Flyers;
-   Create Flyer;
-   Scheduled Flyers;
-   Published Flyers;
-   Coupon Management;
-   Customer Reviews;
-   Wallet;
-   QR Code;
-   Social Media;
-   Analytics;
-   Business Profile;
-   Subscription/account settings.

The dashboard should make the current state of campaigns and customer
transactions easy to understand without requiring marketing expertise.

#### \[P1\] Campaign history

The owner can view and manage previously generated advertisements and
campaigns.

------------------------------------------------------------------------

### CUJ 10 --- Analytics

#### \[P1\] Basic campaign analytics

The owner should be able to see available performance information for
published flyers, including:

-   reach;
-   reactions/engagement;
-   comments;
-   individual flyer performance;
-   overall performance;
-   performance over time;
-   best-performing flyers.

The exact metrics depend on what connected social-platform APIs make
available.

The goal for the MVP is visibility into whether the content is getting
engagement, not a full enterprise analytics suite.

#### \[P2\] Recommendations

Later, performance data can be used to improve future trend and flyer
recommendations.

------------------------------------------------------------------------

## 7. Owner Wallet & Settlement

### \[P0\] Owner wallet

The owner wallet records amounts associated with verified customer
transactions.

The proposed model has no upper wallet limit.

The owner can see:

-   current balance;
-   transaction history;
-   redemption-related entries;
-   discount-related entries.

### \[P0\] Monthly settlement

Verified owner wallet balances are settled at month-end under the
proposed model.

All wallet and reward transactions must be stored server-side so that
the system can verify transactions, reduce fraud and support settlement.

------------------------------------------------------------------------

## 8. Product Rules for the MVP

  Rule                      Current product decision
  ------------------------- ----------------------------------------------
  Business subscription     ₹299/month working hypothesis
  Customer access           Free
  QR scan                   Primary reward entry point
  Daily QR limit            3 scans/customer/day
  Coin value                1 coin = ₹1
  Minimum coin redemption   50 coins
  Maximum customer wallet   100 coins
  Owner wallet              No upper limit in proposed model
  Flyer coupon              One-time use
  Flyer coupon validity     96 hours
  Auto-publish delay        48 hours if enabled
  Coin redemption           Owner approval required
  Discount transaction      Customer confirms displayed price
  Streak milestone          +10 coins every 10 eligible days
  Streak reset              3 consecutive inactive days
  Hashtag generation        Business type + location + flyer topic/trend
  Transaction records       Stored server-side

------------------------------------------------------------------------

## 9. What Is Not in the MVP

To keep the product small enough to validate, the following should not
become Phase 2 blockers:

-   Direct WhatsApp promotional advertising.
-   Unlimited social-platform integrations.
-   A complete advertising-agency workflow.
-   Advanced campaign optimization.
-   Full enterprise analytics.
-   Weather-based campaigns.
-   Festival-based automation beyond the basic flyer use case.
-   Local event tracking.
-   Complex recommendation systems.
-   A large marketplace or directory of every local business.

Weather, festivals and local events are useful future directions, but
they do not need to be proven before the basic acquisition-to-reward
loop works.

------------------------------------------------------------------------

## 10. Phased Delivery

### Phase 1 --- Core acquisition loop

Build and validate:

-   business onboarding;
-   business profile;
-   three images;
-   QR generation;
-   trend discovery;
-   trend/business matching;
-   flyer generation;
-   tags;
-   coupon generation;
-   owner review;
-   supported social publishing;
-   basic customer signup;
-   QR scan;
-   spin wheel;
-   basic coins/wallet;
-   coin redemption;
-   transaction records.

**Question to answer:**\
Can a real SMB owner use this without needing a marketing employee?

### Phase 2 --- Retention loop

Add and validate:

-   social follow rewards;
-   streaks;
-   customer history;
-   ratings/reviews;
-   campaign history;
-   basic analytics;
-   automatic publishing where useful.

**Question to answer:**\
Do customers actually engage and return, and does the owner see value
beyond the first promotion?

### Phase 3 --- Optimization

Only after the first two loops work:

-   performance-based recommendations;
-   weather-based flyers;
-   festival-based flyers;
-   local event promotion;
-   deeper analytics;
-   broader publishing support.

**Question to answer:**\
Can the product become more useful over time without adding more work
for the business owner?

------------------------------------------------------------------------

## 11. Success Signals for Phase 2

The team should not judge the MVP only by the number of features
completed.

The important signals are:

### Owner side

-   A design partner can complete onboarding without substantial help.
-   An owner can generate and approve a promotion in a short session.
-   Owners are willing to publish the generated content.
-   Owners return to use the product again.
-   Owners say the product saves meaningful time compared with doing
    promotion manually.
-   Owners can explain what value they received from the product.

### Customer side

-   Customers scan the shop QR.
-   Customers participate in rewards.
-   Customers redeem eligible offers/coins.
-   Customers return for another interaction.
-   Customers understand the reward flow without staff having to explain
    every step.

### Business value

The team should look for a visible connection between:

**promotion → customer interaction → shop visit/purchase → repeat
activity**

The product does not need to prove every part perfectly in the first
pilot, but it should produce enough evidence to understand where the
loop is working and where it breaks.

------------------------------------------------------------------------

## 12. Pricing Hypothesis

The current working price for the product is **₹299/month per
business**.

This is a hypothesis, not a validated final price.

Phase 1 produced several useful signals:

-   Dhipycare indicated willingness to pay around ₹1,000/month if the
    promised functionality works.
-   Anand Electricals indicated willingness to try the product around
    ₹200--₹500/month.
-   Soni Medicals indicated willingness to pay based on the sales value
    generated.
-   The Phase 1 report also notes several businesses that were
    interested in seeing a demonstration before deciding.

The product's earlier working assumption was ₹200--₹300/month, with
₹250/month as an initial reference. The updated working range is
**₹299--₹349/month**.

Phase 2 should test this directly with design partners.

The pricing test should answer:

1.  Is ₹299 easy enough for the target SMB to accept?
2.  What objections appear at ₹299?
3.  Does the owner see enough recurring value to continue after the
    trial?
4.  What additional value, if any, would justify moving toward ₹349 or
    higher?

The goal is not to decide the final price from interviews alone. It
should be tested through actual product use and a real payment
conversation.

------------------------------------------------------------------------

## 13. Risks & Open Questions

### Risk 1 --- The product becomes too broad

The current idea combines advertising, rewards, wallets, coupons, social
publishing, analytics and reviews.

**What we need to learn:**\
Which parts are essential to the value proposition and which are adding
complexity without enough value?

### Risk 2 --- Owners may still need too much involvement

If the owner has to review too many settings, edit every flyer, manage
complicated campaigns and explain the reward system to customers, the
product loses its main advantage.

**What we need to learn:**\
Can a small business owner operate the core workflow with minimal
effort?

### Risk 3 --- Customers may prefer simple discounts

Customers may understand a direct discount more easily than coins,
streaks and a spin wheel.

**What we need to learn:**\
Which reward mechanics actually change customer behaviour?

### Risk 4 --- Digital engagement may not translate into shop activity

A flyer can receive likes and reach without creating purchases.

**What we need to learn:**\
Can the QR/coupon flow give us enough evidence of an online-to-offline
connection?

### Risk 5 --- Trend data access

The original plan depended on scraping trends from multiple social
platforms. Phase 1 showed that platform restrictions make unrestricted
scraping unreliable.

**Current direction:**\
Use available APIs and supported integrations instead of making scraping
the foundation of the product.

### Risk 6 --- Publishing integrations

Supporting many platforms through separate integrations can increase
maintenance and development effort.

**Current direction:**\
Start with the supported publishing path available to the MVP and expand
only when there is a clear user need.

### Risk 7 --- Reward and wallet abuse

Coins, follows, QR scans and coupons create opportunities for artificial
reward farming.

The system therefore needs server-side transaction records and rules
around:

-   daily scans;
-   coupon reuse;
-   follow/unfollow rewards;
-   streak activity;
-   wallet changes;
-   redemption approval.

### Risk 8 --- Design partners may not convert to paid users

Free usage alone is not enough evidence.

The team needs to learn:

-   what owners value;
-   what they would pay for;
-   what they still find missing;
-   why they might stop using the product.

------------------------------------------------------------------------

## 14. First Design Partner Test

The first design-partner test should be intentionally small.

### Test flow

``` text
One local business
      ↓
Create business profile
      ↓
Generate one relevant promotion
      ↓
Owner reviews and publishes
      ↓
Customer sees promotion
      ↓
Customer visits shop
      ↓
Customer scans QR
      ↓
Customer receives reward/offer
      ↓
Owner sees the interaction
```

### What we should observe

**Owner**

-   How much help is required?
-   Does the generated flyer feel relevant?
-   Would the owner publish it?
-   Does the owner understand the value?
-   Would the owner use it again?

**Customer**

-   Do they understand the QR flow?
-   Do they participate in the reward?
-   Do they redeem it?
-   Does the reward give them a reason to return?

**Business**

-   Does the owner believe the promotion brought useful attention?
-   Can the business identify customer activity through the product?
-   Is there enough value to justify a monthly subscription?

The first test should validate the workflow before the team expands the
feature set.

------------------------------------------------------------------------

## 15. Telemetry / Product Learning

The product should capture enough information to answer product
questions without turning the MVP into a large analytics system.

At minimum, the team should be able to track:

### Acquisition

-   business signup;
-   onboarding completion;
-   subscription activation;
-   social account connection.

### Content

-   flyer generated;
-   flyer approved;
-   flyer rejected;
-   flyer published;
-   coupon generated;
-   coupon redeemed.

### Customer engagement

-   QR scanned;
-   reward received;
-   coins earned;
-   coins redeemed;
-   discount redeemed;
-   streak activity;
-   follow reward claimed.

### Business value

-   owner returning to dashboard;
-   repeat flyer generation;
-   repeat publishing;
-   repeat customer interactions;
-   wallet transactions.

These events should be enough to identify where users stop progressing
through the core journey.

------------------------------------------------------------------------

## 16. Non-Functional Expectations

The MVP should be reliable enough for a real design partner to use
during normal business activity.

However, the PRD does not set arbitrary performance targets such as a
specific page-load time or uptime percentage. Those should only become
product requirements if actual users or the chosen integrations make
them necessary.

The important product-level expectations are:

-   wallet and reward changes must be recorded consistently;
-   coupon reuse must be prevented;
-   QR limits must be enforced;
-   owner approval must be respected;
-   transaction history must remain available;
-   connected-platform failures should not silently create false success
    states.

Detailed technical architecture, database schema, API contracts and
infrastructure decisions should live in separate engineering documents.

------------------------------------------------------------------------

## 17. Dependencies

The MVP depends on several external capabilities:

-   social-platform account connections;
-   available trend data/API access;
-   AI generation services;
-   supported social publishing APIs;
-   QR scanning;
-   payment processing;
-   availability of social analytics data.

The product should be designed so that a limitation in one external
platform does not make the entire business workflow impossible.

In particular, WhatsApp direct advertising is not a core MVP dependency.

------------------------------------------------------------------------

## 18. Decisions Already Made

These decisions come from the current product flow and Phase 1 learning:

1.  The primary target is local SMBs that depend on walk-in customers.
2.  Advertising alone is not enough; the product needs a customer
    engagement mechanism.
3.  QR is the primary in-store customer entry point.
4.  Customers use the product for free.
5.  Business owners pay the subscription.
6.  The current working business price is ₹299/month.
7.  The product should use available APIs instead of relying on
    unrestricted scraping.
8.  WhatsApp direct advertising is not part of the MVP.
9.  The owner should have control over automatic publishing.
10. Wallet and reward transactions must be recorded server-side.
11. The MVP should be validated with a small number of design partners
    before the team tries to support the full feature list.

------------------------------------------------------------------------

## 19. Appendix --- Supporting Product Material

The following documents should remain separate from this PRD because
they contain deeper detail than is needed for product-level alignment:

-   **WorkFlow.docx** --- detailed owner and customer step-by-step flow.
-   **Submission_Phase1.pdf** --- Phase 1 problem validation, interview
    evidence, competitive landscape, pricing hypothesis, feature
    priorities and Phase 2 risks.
-   **Product/UX flows** --- detailed screens and interaction designs as
    they are created.
-   **Engineering specification** --- APIs, database schema,
    integrations, authentication, wallet implementation and
    infrastructure.
-   **Analytics/event specification** --- final event names and
    telemetry implementation.
-   **Design partner notes** --- interview and usage findings collected
    during Phase 2.

### Current end-to-end product flow

``` text
OWNER
  ↓
Signup → Verification → ₹299 subscription
  ↓
Connect social accounts
  ↓
Business type + location + 3 images
  ↓
Unique shop QR generated

PLATFORM
  ↓
Trend discovery
  ↓
Trend/business matching
  ↓
Generate 2 flyer options
  ↓
Generate local tags
  ↓
Generate one-time coupon
  ↓
Show owner

OWNER
  ↓
Review → Select → Publish

CUSTOMER
  ↓
See flyer / visit shop
  ↓
Scan QR
  ↓
Spin wheel
  ↓
Coins / discount / coupon
  ↓
Redeem at shop

PLATFORM
  ↓
Record verified transaction
  ↓
Update customer wallet / owner wallet
  ↓
Track repeat activity and streaks

OWNER
  ↓
View campaign and customer activity
  ↓
Understand whether the product is creating value
```

------------------------------------------------------------------------

## 20. One-Sentence Product Definition

**A simple marketing and customer-rewards platform that helps local SMBs
turn relevant social promotions into real in-store customer
interactions, without requiring a dedicated marketing team.**
