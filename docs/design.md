# Eddy — UI/UX Design System Specification

> **Project:** Eddy — SMB Flyer & Customer Rewards Platform  
> **Platform Types:** Web Application (Responsive SaaS Desktop Dashboard + Mobile-First Customer App)  
> **Tech Stack:** React 18+ (TypeScript), Tailwind CSS v3/v4, shadcn/ui (Radix UI primitives), Lucide Icons, Recharts, Framer Motion, Sonner Toasts  
> **Target Audience:** Local SMB Owners (Retail, Food, Salon, Services) & End Customers  

---

## 1. Design Vision & Principles

Eddy connects online social promotions with offline in-store customer visits. The design must balance **SaaS operational clarity for busy business owners** with **engaging, frictionless gamification for mobile-first customers**.

### Core Principles
1. **Professional Yet Dynamic (Non-Monotonous)**: Base architecture is clean White/Slate Gray to maintain SaaS credibility, but functional domains use distinct, dedicated accent palettes so pages feel alive and intuitive.
2. **Effortless for Owners**: Zero design cognitive load. High-contrast cards, card-deck previews, lightbox zooms, and 1-click publishing actions.
3. **Frictionless In-Store Speed**: Counter interactions (QR scans, coin redemptions, coupon validations) must complete in < 5 seconds with clear warning confirmations.
4. **Accessible & Responsive**: WCAG AA compliant contrast ratios, tabular numbers for financial clarity, touch targets ≥ 48px on mobile devices.

---

## 2. Color Palette & Token System

### 2.1 Neutral Base System (Global)
The app uses a clean slate foundation across all views.

| Token | Light Mode Hex | Dark Mode Hex | Usage |
|---|---|---|---|
| `bg-background` | `#F8FAFC` (Slate 50) | `#0B0F17` (Deep Dark) | App-wide background |
| `bg-card` | `#FFFFFF` (Pure White) | `#131B2A` (Slate 900) | Card & surface containers |
| `bg-muted` | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) | Input backgrounds, badges, hover fills |
| `border-subtle` | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) | Card outlines, dividers |
| `text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Main headings, critical text |
| `text-muted` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Subtitles, helper descriptions |

---

### 2.2 Domain-Specific Page Accent Identities
To prevent visual monotony while maintaining brand consistency, each domain module is distinguished by a purposeful accent color.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      EDDY ACCENT COLOR TAXONOMY                         │
├──────────────────────────┬──────────────────────┬───────────────────────┤
│ Domain / Feature         │ Primary Accent       │ Visual Emotion        │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ 1. AI Marketing & Flyers │ Violet / Indigo      │ Creative, AI, Studio  │
│    (Drafts, Studio)      │ #6366F1              │                       │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ 2. Wallet & Settlement   │ Emerald Green        │ Growth, Money, Trust  │
│    (Coins, Rupee ledger) │ #10B981              │                       │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ 3. Gamification/Rewards  │ Warm Amber / Gold    │ Prizes, Winning, Fun  │
│    (Mystery Box, Streak) │ #F59E0B              │                       │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ 4. Analytics & Metrics   │ Sky Blue / Cyan      │ Clarity, Insight      │
│    (Reach, Reactions)    │ #0284C7              │                       │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ 5. QR & Shop Environment │ Soft Blue (Brand)    │ Connectivity, Scan    │
│    (In-store, Profile)   │ #3B82F6              │                       │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ 6. Reviews & Sentiment   │ Rose / Coral         │ Stars, Heart, Voice   │
│    (Ratings, Feedback)   │ #F43F5E              │                       │
└──────────────────────────┴──────────────────────┴───────────────────────┘
```

#### Tailwind Class Tokens per Domain:
- **Flyers / AI:** `text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/40`
- **Wallet:** `text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40`
- **Rewards / Streaks:** `text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40`
- **Analytics:** `text-sky-600 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-950/40`
- **QR / Brand:** `text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40`
- **Reviews:** `text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40`

---

## 3. Typography System

- **Primary Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Tabular Figures Enabled:** `font-feature-settings: "tnum" 1` for all balances, analytics stats, dates, and tables.

```css
/* Typography Scale */
.text-display  { font-size: 2.25rem; line-height: 2.75rem; font-weight: 700; letter-spacing: -0.025em; } /* 36px */
.text-h1       { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; letter-spacing: -0.02em; }  /* 30px */
.text-h2       { font-size: 1.5rem; line-height: 2.0rem; font-weight: 600; letter-spacing: -0.015em; }   /* 24px */
.text-h3       { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; }                            /* 20px */
.text-body     { font-size: 0.9375rem; line-height: 1.5rem; font-weight: 400; }                           /* 15px */
.text-small    { font-size: 0.8125rem; line-height: 1.25rem; font-weight: 400; }                          /* 13px */
.text-caption  { font-size: 0.75rem; line-height: 1.0rem; font-weight: 500; letter-spacing: 0.02em; }    /* 12px */
```

---

## 4. Surfaces, Shadows & Geometry

- **Border Radius:**
  - Cards & Containers: `rounded-xl` (12px–16px)
  - Modals & Drawers: `rounded-2xl` (16px–24px)
  - Buttons & Inputs: `rounded-lg` (8px–10px)
  - Pills & Badges: `rounded-full` (9999px)
- **Elevation & Shadows:**
  - Standard Cards: `shadow-md` (`0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)`)
  - Hover / Interactive Cards: `hover:shadow-lg transition-shadow duration-200`
  - Popovers & Modals: `shadow-2xl` (`0 25px 50px -12px rgb(0 0 0 / 0.2)`)
  - Dark Mode Surfaces: Subtle outline glow `border border-slate-800 shadow-none`

---

## 5. Owner Dashboard Architecture (Desktop / Tablet)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  EDDY OWNER APP SHELL                                                        │
├───────────────┬─────────────────────────────────────────────────────────────┤
│ SIDEBAR (240px)│ TOP HEADER (64px Sticky)                                    │
│ [Logo] Eddy   │ [Active Shop Name]  [Auto-Publish ON]  [Bell] [Theme] [Avatar]│
│ ──────────────┼─────────────────────────────────────────────────────────────┤
│ ❖ Dashboard   │ MAIN CONTENT AREA (Padded, Max-width 1400px)                 │
│               │                                                             │
│ ✦ AI Studio   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│   • Trend Fly │  │ Stat Card 1  │ │ Stat Card 2  │ │ Stat Card 3  │         │
│   • + Create  │  │ Active Reach │ │ Coins Redeemed│ │ Scans Today │         │
│   • Scheduled │  └──────────────┘ └──────────────┘ └──────────────┘         │
│               │                                                             │
│ 💰 Wallet     │  ┌────────────────────────────────────────────────────────┐ │
│ 🏷 Coupons    │  │ Main Workspace: (Card Deck / Table / Analytics Chart)   │ │
│ ⚏ QR Code     │  │                                                        │ │
│ 📊 Analytics  │  │                                                        │ │
│ 💬 Reviews    │  │                                                        │ │
│ ⚙ Settings    │  └────────────────────────────────────────────────────────┘ │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

### Key UI Modules:

#### 1. AI Flyer Review — Card Deck + Lightbox Zoom
- **Layout:** 2-card interactive comparison deck showing Variant A and Variant B with AI trend match score tag (`#LucknowEats`, `#FestivalSpecial`).
- **Interactive Lightbox:** Clicking any card opens a full-screen high-res preview mockup showing exact Instagram Feed / Facebook Post layout.
- **Controls:**
  - `[ 👁 Expand Lightbox ]`
  - `[ 🚀 1-Click Approve & Publish ]`
  - `[ 🕒 Schedule for Later ]`
  - 48-Hour countdown badge: *"Auto-publishes in 38h 12m unless changed"*.

#### 2. QR Code Generator & Download Suite
- Central high-contrast preview of the shop QR (`https://eddy.app/shop/{businessId}`).
- Action bar: `[ Download SVG ]`, `[ Download Printable PDF Counter Stand ]`, `[ Copy Shop Link ]`.

#### 3. Transaction Ledger & Wallet
- Live balance pill with rupee equivalent (`₹4,850`).
- Immutable real-time activity table with badge tags (`COIN_REDEMPTION`, `DISCOUNT_APPLIED`, `STREAK_BONUS`).

---

## 6. Customer Mobile Experience (Mobile-First Web App)

```text
┌─────────────────────────────────────────┐
│ [Shop Badge] 📍 Anand Electricals      │
│ Coin Balance: 🟡 70 Coins               │
├─────────────────────────────────────────┤
│                                         │
│  ✨ Daily Shop Experience               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   🎁 MYSTERY BOX / SPIN WHEEL     │  │
│  │                                   │  │
│  │       [ Tap to Reveal! ]          │  │
│  │                                   │  │
│  │   Daily Scans Left: (2 / 3)       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  🔥 Active Streak: 7 Days (3 to bonus) │
│  🏷 Available Shop Coupons (DIWALI27)   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ⚡ Instant Counter Redemption     │  │
│  │ [ Use 50 Coins (₹50 OFF) ]        │  │
│  └───────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ 🏠 Home  │  ⚏ Scan  │  💰 Wallet │ 👤 Profile │
└─────────────────────────────────────────┘
```

### Key Customer Interactions:

#### 1. Gamified Reward Reveal (Scratch Card / Mystery Box)
- **Physics & Motion:** Smooth 3D box wobble or touch-activated scratch effect via Framer Motion.
- **Celebration Modal:** Full-screen soft confetti burst, sound/haptic trigger, win tag: *"You Won 15 Eddy Coins!"*.
- Instant animated ticker updating customer wallet balance from `70` → `85`.

#### 2. In-Store Coin Redemption Dialog (Frictionless Flow)
- Tap `[ Redeem 50 Coins for ₹50 Discount ]`.
- **Confirmation Warning Modal:**
  > ⚠️ **Are you sure you want to redeem 50 coins?**  
  > *This will deduct ₹50 from your bill at Anand Electricals. This action is irreversible.*  
  > `[ Cancel ]` &emsp; `[ Yes, Redeem Now ]`
- On confirmation: Big green animated checkmark + Success Sound + In-store receipt card for counter staff.

#### 3. 2-Tier Rating & Feedback Modal
- Triggered after redemption interaction.
- **5-Star Interactive Rating Bar:**
  - **4 or 5 Stars:** Prompts *"Glad you had a great visit! Share your review on Google Maps"* → Redirects to Google Maps listing.
  - **1, 2, or 3 Stars:** Opens in-app feedback box for private owner dashboard review.

---

## 7. Component Library & Implementation Standards

### 7.1 UI Primitives (shadcn/ui + Radix UI)
- **Buttons (`Button`):** Variants (`default`, `secondary`, `destructive`, `outline`, `ghost`, `link`) with `active:scale-98 transition-transform`.
- **Dialogs & Modals (`Dialog`, `Sheet`):** Backdrop blur `backdrop-blur-sm bg-slate-900/40`.
- **Badges (`Badge`):** Rounded pill with subtle background and crisp border.
- **Forms (`Form`, `Input`, `Select`):** Zod-validated with inline assistive error messages.

### 7.2 Data Visualizations (Recharts)
- Responsive Container SVG charts.
- Custom Tooltip with glassmorphism card (`bg-white/90 dark:bg-slate-900/90 shadow-lg border rounded-lg p-2`).
- Domain-matched line & bar chart strokes (Sky Blue `#0284C7`, Emerald Green `#10B981`, Indigo `#6366F1`).

### 7.3 Motion & Transitions (Framer Motion)
```typescript
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

export const modalPop = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
};
```

### 7.4 Toast Notifications (Sonner)
- Position: `bottom-right` for Desktop Dashboard, `top-center` for Customer Mobile Web.
- Formats:
  - Success: Emerald pill with check icon (`Flyer published to Instagram!`)
  - Warning/Alert: Amber pill with alert icon (`48-hour auto-publish window ending soon`)
  - Error: Rose pill (`Daily scan limit of 3 reached`)

---

## 8. Loading States, Skeletons & Empty States

### 8.1 AI Generation Progressive Loading
When the owner initiates AI flyer generation (trend discovery → business matching → flyer creation), the process can take 5–15 seconds. Provide clear feedback:

**Skeleton Card Deck:**
```text
┌─────────────────────────────────────────────────────┐
│  Generating Your Flyers...                          │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ ░░░░░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░░░░░ │         │
│  │ ░░░░░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░░░░░ │         │
│  │ ░░░░░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░░░░░ │         │
│  │ [Shimmer Pulse]  │  │ [Shimmer Pulse]  │         │
│  └──────────────────┘  └──────────────────┘         │
│                                                     │
│  ✓ Analyzing trending topics...                     │
│  → Matching your business context...                │
│  ⏳ Generating hashtags & coupon code...            │
└─────────────────────────────────────────────────────┘
```

**Implementation:**
- Use `animate-pulse` Tailwind utility on shimmer skeleton cards.
- Display progressive status messages with checkmark → arrow → hourglass icons.
- Disable navigation away from the generation page to prevent accidental data loss.

### 8.2 Empty State Patterns
Provide clear calls-to-action when data tables or lists are empty:

| Screen | Empty State Message | CTA |
|---|---|---|
| **Flyer History** | *"No flyers generated yet. Let AI create your first trend-based promotion!"* | `[ 🤖 Generate AI Flyer ]` |
| **Wallet Transactions** | *"No transactions recorded. Once customers redeem rewards, they'll appear here."* | — |
| **Coupons** | *"No active coupons. Publish a flyer to generate coupon codes automatically."* | `[ 📄 View Flyers ]` |
| **Reviews** | *"No customer reviews yet. Reviews will appear here after redemptions."* | — |
| **Customer Wallet** | *"You haven't earned any coins yet. Visit a participating shop and scan the QR!"* | `[ ⚏ Scan Shop QR ]` |

**Visual Style:**
- Centered illustration icon (Lucide icon at 64px size in muted slate).
- 2-line descriptive text (`text-muted` color, `text-body` size).
- Optional primary CTA button with domain-specific accent color.

---

## 9. Form Controls & Image Upload Specifications

### 9.1 Business Onboarding Image Upload (3 Required Images)
Owners must upload exactly **3 business images** during setup:
1. **Shop Front / Exterior Image** (helps customers recognize the physical location)
2. **Main Product / Hero Item** (signature offering for promotion focus)
3. **Specific Product / Detail Shot** (seasonal item, featured dish, etc.)

**Drag-and-Drop Upload Zone Design:**
```text
┌─────────────────────────────────────────────────────┐
│  📷 Upload Shop Front Image                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  [Drag & Drop or Click to Browse]           │   │
│  │                                             │   │
│  │  Recommended: 1080×1080px (1:1 ratio)        │   │
│  │  Max size: 5MB  •  JPG, PNG, WebP           │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Image Preview & Crop Modal:**
- After upload, display live aspect ratio preview (Instagram 1:1 and 4:5 Story formats).
- Optional inline crop/rotate tool using `react-easy-crop` or similar library.
- Replace button: `[ 🔄 Replace Image ]` overlays on hover with `bg-slate-900/60 backdrop-blur-sm`.

**Validation States:**
- **Success:** Green checkmark badge in top-right corner with `border-emerald-500`.
- **Error:** Red border `border-rose-500` with helper text: *"Image must be under 5MB and in JPG/PNG format."*
- **Loading:** Subtle spinner overlay with semi-transparent backdrop during upload.

### 9.2 Form Input Styling Standards
All text inputs, selects, and textareas follow consistent shadcn/ui styling:
- **Default State:** `border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 rounded-lg px-3 py-2 text-body`
- **Focus State:** `focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- **Error State:** `border-rose-500 focus:ring-rose-500 text-rose-900`
- **Disabled State:** `bg-slate-100 text-slate-400 cursor-not-allowed opacity-60`

**Helper Text Positioning:**
- Below input with 4px spacing: `text-small text-muted` for hints.
- Error messages in `text-rose-600` with alert icon (Lucide `AlertCircle`).

---

## 10. Printable QR Code Counter Standee Specification

Owners need to display QR codes prominently on physical shop counters for customer scanning. Provide print-ready templates.

### 10.1 Print Template Formats
| Format | Dimensions | Use Case |
|---|---|---|
| **A6 Tent Card** | 105 × 148mm (folded) | Counter top folded standee |
| **A5 Poster** | 148 × 210mm | Wall/window display |
| **Counter Sticker** | 100 × 100mm | Adhesive vinyl decal |

### 10.2 QR Code Design Standards
- **QR Minimum Size:** 3cm × 3cm (ensures reliable smartphone camera scanning from 30cm distance).
- **Quiet Zone:** 4-module white border around QR code (prevents scan errors).
- **High Contrast:** Pure black (`#000000`) on pure white (`#FFFFFF`) background for maximum readability.
- **Error Correction Level:** `H` (High, 30% recovery) to handle minor damage/dirt.

### 10.3 Customer-Facing Call-to-Action Copy
```text
┌─────────────────────────────────────┐
│                                     │
│   🎁 SCAN & WIN DAILY REWARDS!       │
│                                     │
│        [QR CODE 3cm × 3cm]          │
│                                     │
│   🟡 Earn Eddy Coins Every Visit     │
│   🎯 Spin for Discounts & Prizes     │
│   💰 Redeem Coins for Cash Off       │
│                                     │
│   Powered by Eddy                   │
└─────────────────────────────────────┘
```

**Typography for Print:**
- Heading: Bold, 18pt, black
- Body bullets: Regular, 10pt, dark slate
- Footer branding: Light, 8pt, muted slate

**Download Options in Owner Dashboard:**
- `[ 📥 Download SVG ]` — Vector format for professional printing
- `[ 📥 Download High-Res PNG ]` — 300 DPI for home/office printers
- `[ 📄 Download PDF Tent Card ]` — Pre-formatted A6 foldable template with bleed margins
- `[ 🔗 Copy Shop Link ]` — Shareable URL `https://eddy.app/shop/{businessId}`

---

## 11. Mobile Sound & Haptic Feedback

### 11.1 Audio Feedback Library
Subtle audio cues enhance in-store gamification without disrupting quiet shop environments:

| Event | Sound Effect | Duration | Volume |
|---|---|---|---|
| **Mystery Box Opening** | Soft "whoosh" reveal | 0.4s | 40% |
| **Reward Win** | Bright chime / bell | 0.6s | 50% |
| **Coin Earned** | Coin "clink" | 0.3s | 45% |
| **QR Scan Success** | Gentle beep | 0.2s | 35% |
| **Error / Limit Reached** | Low bass "buzz" | 0.3s | 40% |

**Implementation:**
- Use Web Audio API or lightweight library like `howler.js`.
- Provide instant mute toggle button in customer app header (`🔊 / 🔇`).
- Respect device silent mode via `navigator.mediaDevices.getUserMedia()` permissions check.

### 11.2 Haptic Vibration Patterns
```javascript
// Mystery Box Reveal (3-stage build-up)
navigator.vibrate([50, 50, 100]);

// Reward Win Celebration
navigator.vibrate([100, 50, 100, 50, 200]);

// Coin Add (single pulse)
navigator.vibrate(50);

// Error / Limit Reached (double buzz)
navigator.vibrate([100, 100, 100]);
```

**Best Practices:**
- Always check `navigator.vibrate` support before calling.
- Provide Settings toggle: *"Enable haptic feedback for rewards"* (default: ON).
- Keep vibration durations under 200ms to avoid user annoyance.

---

## 12. Responsive Grid System & Breakpoint Rules

### 12.1 Tailwind Breakpoint Strategy
| Breakpoint | Min Width | Target Device | Layout Behavior |
|---|---|---|---|
| `sm` | 640px | Large phones (landscape) | Single-column customer app, full-width cards |
| `md` | 768px | Tablets | Owner sidebar collapses to icon-only mode |
| `lg` | 1024px | Small laptops | Full sidebar expands, 2-column stat grids |
| `xl` | 1280px | Desktop monitors | 3-column analytics dashboards, max-width 1400px container |
| `2xl` | 1536px | Widescreen displays | Enhanced spacing, larger preview cards |

### 12.2 Customer Mobile Layout Constraints
- **Max Content Width:** `480px` centered on screens > 768px (prevents awkward stretching on tablets).
- **Bottom Nav Bar:** Fixed `h-16` (64px) with `safe-area-inset-bottom` padding for iPhone notch compatibility.
- **Touch Target Minimum:** All interactive elements ≥ 48×48px (WCAG 2.5.5 AA compliance).

### 12.3 Owner Desktop Dashboard Grid
```css
/* 3-Column Responsive Stat Card Grid */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem; /* 24px */
}

/* Analytics Chart Container */
.chart-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem; /* 32px */
}

/* Sidebar Responsive Behavior */
@media (max-width: 1023px) {
  .sidebar {
    width: 64px; /* Icons-only mode */
  }
  .sidebar-label {
    display: none;
  }
}
```

---

## 13. Accessibility (a11y) Standards

### 13.1 Keyboard Navigation & Focus Indicators
All interactive elements must be fully keyboard-navigable:

```css
/* High-Visibility Focus Ring */
.focus-visible:focus-visible {
  outline: 2px solid #3B82F6; /* Soft Blue */
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Domain-Specific Focus Colors */
.wallet-focus:focus-visible { outline-color: #10B981; } /* Emerald */
.flyer-focus:focus-visible { outline-color: #6366F1; } /* Indigo */
.reward-focus:focus-visible { outline-color: #F59E0B; } /* Amber */
```

**Tab Order Requirements:**
- Logical flow: Top header → Sidebar navigation → Main content → Modals/Overlays.
- Skip-to-content link for screen readers: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`.

### 13.2 ARIA Live Regions for Real-Time Updates
Critical for wallet balance changes and redemption confirmations:

```html
<!-- Customer Wallet Balance (Announced by Screen Readers) -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Your coin balance is now 85 coins
</div>

<!-- QR Scan Limit Status -->
<div role="status" aria-live="polite">
  You have 2 scans remaining today
</div>

<!-- Transaction Confirmation -->
<div role="alert" aria-live="assertive">
  Redemption successful! 50 coins deducted.
</div>
```

**Live Region Guidelines:**
- `aria-live="polite"`: Non-urgent updates (balance changes, streak milestones).
- `aria-live="assertive"`: Critical alerts (redemption confirmed, scan limit reached).
- `aria-atomic="true"`: Read entire updated region, not just changed text.

### 13.3 Color Contrast Compliance (WCAG AA)
All text must meet 4.5:1 contrast ratio for normal text, 3:1 for large text (≥18pt):

| Text Color | Background | Contrast Ratio | Pass/Fail |
|---|---|---|---|
| `#0F172A` (Slate 900) | `#FFFFFF` (White) | 16.1:1 | ✅ AAA |
| `#64748B` (Slate 500) | `#FFFFFF` (White) | 4.6:1 | ✅ AA |
| `#3B82F6` (Soft Blue) | `#FFFFFF` (White) | 3.4:1 | ⚠️ Large text only |
| `#10B981` (Emerald) | `#FFFFFF` (White) | 2.9:1 | ❌ Use `#059669` (darker) |

**Action Required:**
- Use darker variants of accent colors for small text on white backgrounds:
  - Emerald: `#059669` instead of `#10B981`
  - Amber: `#D97706` instead of `#F59E0B`

### 13.4 Screen Reader Annotations
```html
<!-- Mystery Box Button -->
<button aria-label="Reveal your daily reward" aria-describedby="scans-remaining">
  Tap to Reveal!
</button>
<p id="scans-remaining" class="sr-only">You have 2 scans left today</p>

<!-- Coin Balance Pill -->
<div role="status" aria-label="Current coin balance: 70 coins">
  🟡 70 Coins
</div>

<!-- Loading Spinner -->
<div role="status" aria-live="polite" aria-busy="true">
  <span class="sr-only">Generating your flyers, please wait...</span>
  [Spinner Animation]
</div>
```

---

## 14. Summary Table of Design Specs

| Attribute | Specification |
|---|---|
| **Framework Foundation** | shadcn/ui (Radix UI) + Tailwind CSS + React (TypeScript) |
| **Neutral Colors** | Slate White (`#F8FAFC`, `#FFFFFF`) & Deep Slate (`#0B0F17`, `#131B2A`) |
| **Page-Specific Accents** | AI/Flyers (Indigo), Wallet (Emerald), Rewards (Amber), Analytics (Sky), QR/Brand (Soft Blue), Reviews (Rose) |
| **Typography** | Inter (Google Fonts) with Tabular Figures (`tnum`) |
| **Theme Engine** | Light mode default + Dark mode toggle (`dark:` class via `next-themes`) |
| **Desktop Layout** | Collapsible Left Sidebar (240px) + Sticky Top Header |
| **Mobile Layout** | Mobile-first App Shell with Persistent Bottom Navigation Tab Bar (max-width 480px) |
| **Card Geometry** | `rounded-xl` corners with soft elevated `shadow-md` |
| **Flyer Inspection** | Card Deck comparison with Full-Screen Lightbox Zoom |
| **Counter Redemption** | Frictionless 1-step Confirmation Dialog with clear warning copy |
| **Icons Library** | Lucide React |
| **Charts** | Recharts (via shadcn/ui Charts) |
| **Motion & Alerts** | Framer Motion animations + Sonner Toast notifications |
| **Loading States** | Shimmer skeleton cards + Progressive AI status messages |
| **Empty States** | Centered icon + 2-line description + Optional primary CTA |
| **Image Uploads** | Drag-and-drop zones with live aspect ratio preview, max 5MB, 1080×1080px recommended |
| **Printable QR Templates** | A6 tent card, A5 poster, 100mm sticker with 3cm × 3cm QR code minimum |
| **Audio Feedback** | Web Audio API with instant mute toggle, 40–50% volume |
| **Haptic Patterns** | `navigator.vibrate()` with 50–200ms pulses for reward wins |
| **Responsive Breakpoints** | Mobile-first: 480px max → Tablet: 768px → Desktop: 1024px → Widescreen: 1280px+ |
| **Accessibility** | WCAG AA contrast (4.5:1), keyboard focus rings, ARIA live regions for wallet updates |
