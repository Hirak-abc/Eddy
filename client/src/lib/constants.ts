// ── App ──────────────────────────────────────────────
export const APP_NAME = 'Eddy';
export const APP_DESCRIPTION = 'AI-powered marketing & rewards for local businesses';

// ── API ──────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// ── Clerk ────────────────────────────────────────────
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '';

// ── Wallet rules ─────────────────────────────────────
export const COIN_VALUE_INR = 1; // 1 coin = ₹1
export const MIN_REDEMPTION_COINS = 50;
export const MAX_WALLET_COINS = 100;

// ── QR rules ─────────────────────────────────────────
export const MAX_DAILY_SCANS = 3;

// ── Flyer / Coupon rules ─────────────────────────────
export const COUPON_VALIDITY_HOURS = 96;
export const AUTO_PUBLISH_WINDOW_HOURS = 48;

// ── Streak rules ─────────────────────────────────────
export const STREAK_MILESTONE_DAYS = 10;
export const STREAK_BONUS_COINS = 10;
export const STREAK_RESET_INACTIVE_DAYS = 3;

// ── Subscription ─────────────────────────────────────
export const SUBSCRIPTION_PRICE_INR = 299;

// ── Routes ───────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',

  // Owner
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_ONBOARDING: '/owner/onboarding',
  OWNER_FLYERS: '/owner/flyers',
  OWNER_CREATE_FLYER: '/owner/flyers/create',
  OWNER_SCHEDULED: '/owner/flyers/scheduled',
  OWNER_PUBLISHED: '/owner/flyers/published',
  OWNER_COUPONS: '/owner/coupons',
  OWNER_REVIEWS: '/owner/reviews',
  OWNER_WALLET: '/owner/wallet',
  OWNER_QR: '/owner/qr',
  OWNER_SOCIAL: '/owner/social',
  OWNER_ANALYTICS: '/owner/analytics',
  OWNER_PROFILE: '/owner/profile',
  OWNER_SETTINGS: '/owner/settings',

  // Customer
  CUSTOMER_HOME: '/customer/home',
  CUSTOMER_DISCOVER: '/customer/discover',
  CUSTOMER_SCAN: '/customer/scan',
  CUSTOMER_REWARDS: '/customer/rewards',
  CUSTOMER_WALLET: '/customer/wallet',
  CUSTOMER_HISTORY: '/customer/history',
  CUSTOMER_COUPONS: '/customer/coupons',
  CUSTOMER_FOLLOWING: '/customer/following',
  CUSTOMER_STREAK: '/customer/streak',
  CUSTOMER_PROFILE: '/customer/profile',

  // Shop (public via QR)
  SHOP: '/shop/:businessId',
} as const;
