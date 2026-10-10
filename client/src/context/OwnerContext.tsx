import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Flyer, FlyerVersion } from '../types/flyer';
import type { Business, BusinessImages } from '../types';
import type { Reward } from '../types/rewards';
import type { WalletTransaction } from '../types/wallet';

export interface CouponItem {
  id: string;
  code: string;
  discount: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrder: number;
  claimedCount: number;
  redeemedCount: number;
  maxRedemptions: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
  campaign: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  category: string;
  createdAt: string;
  status: 'PENDING_REPLY' | 'REPLIED' | 'GOOGLE_REDIRECTED';
  reply?: string | null;
}

export interface SocialAccountState {
  connected: boolean;
  username?: string;
  pageName?: string;
  followers?: number;
  likes?: number;
  lastSync: string;
  tokenExpiresDays: number;
  autoPublish: boolean;
}

export interface ExtendedFlyer extends Flyer {
  title?: string;
  category?: string;
  content?: string;
  scheduledFor?: string;
  stats?: {
    reach: number;
    impressions: number;
    likes: number;
    shares: number;
    couponsRedeemed: number;
  };
}

export interface OwnerContextType {
  // Business Profile
  business: Business;
  updateBusiness: (updates: Partial<Business>) => void;
  updateBusinessImages: (images: BusinessImages) => void;
  toggleAutoPublish: (enabled?: boolean) => void;

  // Flyers
  trendFlyer: ExtendedFlyer | null;
  scheduledFlyers: ExtendedFlyer[];
  publishedFlyers: ExtendedFlyer[];
  allFlyers: ExtendedFlyer[];
  createFlyer: (flyerData: Partial<ExtendedFlyer>) => ExtendedFlyer;
  selectFlyerVersion: (flyerId: string, versionId: string) => void;
  scheduleFlyer: (flyerId: string, scheduledAt: string) => void;
  publishFlyerNow: (flyerId: string) => void;
  deleteFlyer: (flyerId: string) => void;

  // Coupons
  coupons: CouponItem[];
  createCoupon: (coupon: Omit<CouponItem, 'id' | 'claimedCount' | 'redeemedCount' | 'createdAt'>) => CouponItem;
  toggleCouponStatus: (couponId: string) => void;

  // Wallet & Transactions
  walletBalance: number;
  lifetimeCredits: number;
  pendingRedemptionsInr: number;
  transactions: WalletTransaction[];
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;

  // Rewards Configuration
  rewards: Reward[];
  updateRewards: (newRewards: Reward[]) => void;
  dailyScanBonusCoins: number;
  setDailyScanBonusCoins: (coins: number) => void;

  // Social Connections
  socialAccounts: {
    instagram: SocialAccountState;
    facebook: SocialAccountState;
  };
  toggleSocialConnection: (platform: 'instagram' | 'facebook') => void;
  updateSocialAutoPublish: (platform: 'instagram' | 'facebook', autoPublish: boolean) => void;

  // Reviews
  reviews: ReviewItem[];
  reviewStats: {
    overallRating: number;
    totalReviews: number;
    googleRedirectCount: number;
    privateFeedbackCount: number;
  };
  replyToReview: (reviewId: string, replyText: string) => void;

  // Analytics
  analyticsSummary: {
    totalReach: number;
    reachGrowth: number;
    totalScans: number;
    scanGrowth: number;
    couponsRedeemed: number;
    couponGrowth: number;
    repeatCustomerRate: number;
  };
  timelineData: Array<{
    date: string;
    reach: number;
    scans: number;
    redemptions: number;
    coinRedemptions: number;
  }>;

  // Reset helper
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'eddy_owner_state_v1';

// ── Default Mock State ──────────────────────────────────────────────────────────
const defaultBusiness: Business = {
  id: 'b_lucknow_cafe',
  ownerId: 'u_owner_1',
  name: 'The Royal Chai & Cafe',
  category: 'Food & Beverages (Cafe & Bakery)',
  location: 'Hazratganj, Lucknow, Uttar Pradesh',
  phone: '+91 98765 43210',
  email: 'contact@royalchaicafe.com',
  description: 'Artisanal teas, fresh bakery items, and royal Awadhi snacks in the heart of Lucknow.',
  images: {
    shop: {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      storageKey: 'shop_img_1',
      uploadedAt: '2026-09-01T10:00:00Z',
    },
    product: {
      url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      storageKey: 'prod_img_1',
      uploadedAt: '2026-09-01T10:00:00Z',
    },
    item: {
      url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      storageKey: 'item_img_1',
      uploadedAt: '2026-09-01T10:00:00Z',
    },
  },
  verificationStatus: 'VERIFIED',
  autoPublish: true,
  isActive: true,
  createdAt: '2026-08-15T00:00:00Z',
  updatedAt: '2026-10-05T00:00:00Z',
};

const defaultTrendFlyer: ExtendedFlyer = {
  id: 'flyer_trend_navratri',
  businessId: 'b_lucknow_cafe',
  status: 'READY',
  title: 'Navratri Festive Chai Feast',
  category: 'FESTIVAL',
  trendContext: 'Navratri Festive & Special Chai Treats',
  imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  hashtags: ['#LucknowEats', '#HazratganjCafe', '#NavratriSpecial', '#ChaiLovers', '#EddyDeals'],
  couponCode: 'NAVRATRI20',
  couponExpiresAt: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
  scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  selectedVersionId: 'v_1',
  versions: [
    {
      id: 'v_1',
      flyerId: 'flyer_trend_navratri',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      caption: 'Celebrate this festive season with our signature Royal Masala Chai & Saffron Treats! ☕✨ Flat 20% OFF on all combos with coupon NAVRATRI20.',
      hashtags: ['#LucknowEats', '#HazratganjCafe', '#NavratriSpecial', '#ChaiLovers', '#EddyDeals'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'v_2',
      flyerId: 'flyer_trend_navratri',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      caption: 'Festive evenings are better with warm Kulhad Chai & freshly baked saffron cookies. 🪔 Visit us in Hazratganj today!',
      hashtags: ['#FestiveLucknow', '#RoyalChai', '#FoodieLucknow', '#LucknowFoodBloggers'],
      createdAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultScheduledFlyers: ExtendedFlyer[] = [
  {
    id: 'flyer_sched_weekend',
    businessId: 'b_lucknow_cafe',
    status: 'SCHEDULED',
    title: 'Weekend Chai & Snack Combo',
    category: 'DISCOUNT',
    trendContext: 'Weekend Relax & Refresh',
    imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80',
    hashtags: ['#WeekendChai', '#LucknowWeekend', '#ChaiTime', '#Hazratganj'],
    couponCode: 'WEEKEND149',
    couponExpiresAt: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    selectedVersionId: 'v_sched_1',
    versions: [
      {
        id: 'v_sched_1',
        flyerId: 'flyer_sched_weekend',
        imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80',
        caption: 'Weekend unwinding starts at The Royal Chai! Special combo @ ₹149 this Saturday & Sunday. ☕🥟',
        hashtags: ['#WeekendChai', '#LucknowWeekend', '#ChaiTime'],
        createdAt: '2026-10-04T10:00:00Z',
      },
    ],
    createdAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-04T10:00:00Z',
  },
];

const defaultPublishedFlyers: ExtendedFlyer[] = [
  {
    id: 'flyer_pub_monsoon',
    businessId: 'b_lucknow_cafe',
    status: 'PUBLISHED',
    title: 'Monsoon Chai & Pakoda Platter',
    category: 'FESTIVAL',
    trendContext: 'Monsoon Delights',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    hashtags: ['#MonsoonChai', '#LucknowCafes', '#Hazratganj', '#PakodaPlatter'],
    couponCode: 'MONSOON15',
    couponExpiresAt: '2026-10-04T23:59:59Z',
    publishedAt: '2026-10-01T11:00:00Z',
    socialPostId: 'ig_post_894104',
    selectedVersionId: 'v_pub_1',
    stats: {
      reach: 3840,
      impressions: 5210,
      likes: 420,
      shares: 78,
      couponsRedeemed: 46,
    },
    versions: [
      {
        id: 'v_pub_1',
        flyerId: 'flyer_pub_monsoon',
        imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
        caption: 'Monsoon special Pakoda & Adrak Chai platter available now! 🌧️☕ Show this post for flat ₹50 OFF.',
        hashtags: ['#MonsoonChai', '#LucknowCafes', '#Hazratganj'],
        createdAt: '2026-10-01T09:00:00Z',
      },
    ],
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-01T11:00:00Z',
  },
  {
    id: 'flyer_pub_bakery',
    businessId: 'b_lucknow_cafe',
    status: 'PUBLISHED',
    title: 'Freshly Baked Croissant Launch',
    category: 'NEW_PRODUCT',
    trendContext: 'Artisanal Bakery Trend',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    hashtags: ['#BakeryLucknow', '#FreshBakes', '#CroissantLove', '#CafeVibes'],
    couponCode: 'BAKE10',
    publishedAt: '2026-09-25T14:00:00Z',
    socialPostId: 'ig_post_871239',
    selectedVersionId: 'v_pub_2',
    stats: {
      reach: 2920,
      impressions: 4100,
      likes: 310,
      shares: 44,
      couponsRedeemed: 32,
    },
    versions: [
      {
        id: 'v_pub_2',
        flyerId: 'flyer_pub_bakery',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        caption: 'Buttery, flaky, and baked fresh every morning! Pair with your favorite cappuccino. 🥐☕',
        hashtags: ['#BakeryLucknow', '#FreshBakes', '#CroissantLove'],
        createdAt: '2026-09-25T10:00:00Z',
      },
    ],
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T14:00:00Z',
  },
];

const defaultCoupons: CouponItem[] = [
  {
    id: 'c_navratri20',
    code: 'NAVRATRI20',
    discount: '20% OFF',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrder: 200,
    claimedCount: 38,
    redeemedCount: 19,
    maxRedemptions: 100,
    expiresAt: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    campaign: 'Navratri Festive Campaign',
    createdAt: '2026-10-05T08:00:00Z',
  },
  {
    id: 'c_welcome50',
    code: 'WELCOME50',
    discount: 'Flat ₹50 OFF',
    discountType: 'FLAT',
    discountValue: 50,
    minOrder: 150,
    claimedCount: 120,
    redeemedCount: 92,
    maxRedemptions: 200,
    expiresAt: '2026-12-31T23:59:59Z',
    status: 'ACTIVE',
    campaign: 'QR Standee Welcome Deal',
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'c_weekend149',
    code: 'WEEKEND149',
    discount: 'Special Combo @ ₹149',
    discountType: 'FLAT',
    discountValue: 40,
    minOrder: 189,
    claimedCount: 22,
    redeemedCount: 7,
    maxRedemptions: 50,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    campaign: 'Weekend Chai Combo',
    createdAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 'c_monsoon15',
    code: 'MONSOON15',
    discount: '₹50 OFF on ₹250+',
    discountType: 'FLAT',
    discountValue: 50,
    minOrder: 250,
    claimedCount: 84,
    redeemedCount: 46,
    maxRedemptions: 100,
    expiresAt: '2026-10-04T23:59:59Z',
    status: 'EXPIRED',
    campaign: 'Monsoon Chai Platter',
    createdAt: '2026-09-28T00:00:00Z',
  },
];

const defaultTransactions: WalletTransaction[] = [
  {
    id: 'tx_1',
    type: 'COIN_REDEMPTION',
    customerId: 'cust_1',
    businessId: 'b_lucknow_cafe',
    coinAmount: 50,
    amount: 50,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    metadata: { customerName: 'Aarav Sharma', billAmount: 320, note: '50 Coins Discount' },
  },
  {
    id: 'tx_2',
    type: 'COUPON_REDEMPTION',
    customerId: 'cust_2',
    businessId: 'b_lucknow_cafe',
    coinAmount: 0,
    amount: 64,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    metadata: { customerName: 'Priya Verma', couponCode: 'NAVRATRI20', billAmount: 320 },
  },
  {
    id: 'tx_3',
    type: 'COIN_REDEMPTION',
    customerId: 'cust_3',
    businessId: 'b_lucknow_cafe',
    coinAmount: 100,
    amount: 100,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 175 * 60 * 1000).toISOString(),
    metadata: { customerName: 'Rohan Gupta', billAmount: 540 },
  },
  {
    id: 'tx_4',
    type: 'COIN_REDEMPTION',
    customerId: 'cust_4',
    businessId: 'b_lucknow_cafe',
    coinAmount: 50,
    amount: 50,
    status: 'APPROVED',
    createdAt: '2026-10-04T18:30:00Z',
    approvedAt: '2026-10-04T18:32:00Z',
    metadata: { customerName: 'Ananya Singh', billAmount: 260 },
  },
  {
    id: 'tx_5',
    type: 'COUPON_REDEMPTION',
    customerId: 'cust_5',
    businessId: 'b_lucknow_cafe',
    coinAmount: 0,
    amount: 50,
    status: 'APPROVED',
    createdAt: '2026-10-04T15:20:00Z',
    approvedAt: '2026-10-04T15:21:00Z',
    metadata: { customerName: 'Kabir Mehta', couponCode: 'WELCOME50' },
  },
];

const defaultRewards: Reward[] = [
  { id: 'rw_1', businessId: 'b_lucknow_cafe', type: 'COINS', label: '10 Eddy Coins', value: 10, probability: 0.35 },
  { id: 'rw_2', businessId: 'b_lucknow_cafe', type: 'COINS', label: '25 Eddy Coins', value: 25, probability: 0.20 },
  { id: 'rw_3', businessId: 'b_lucknow_cafe', type: 'DISCOUNT', label: '15% Off Coupon', value: 15, probability: 0.25 },
  { id: 'rw_4', businessId: 'b_lucknow_cafe', type: 'FREE_ITEM', label: 'Free Masala Bun', value: 40, probability: 0.10 },
  { id: 'rw_5', businessId: 'b_lucknow_cafe', type: 'COINS', label: '50 Mega Coins', value: 50, probability: 0.08 },
  { id: 'rw_6', businessId: 'b_lucknow_cafe', type: 'OTHER', label: 'Better Luck Next Time', value: 0, probability: 0.02 },
];

const defaultSocialAccounts = {
  instagram: {
    connected: true,
    username: '@royalchaicafe_lucknow',
    followers: 2840,
    lastSync: new Date().toISOString(),
    tokenExpiresDays: 42,
    autoPublish: true,
  },
  facebook: {
    connected: true,
    pageName: 'The Royal Chai & Cafe - Hazratganj',
    likes: 1420,
    lastSync: new Date().toISOString(),
    tokenExpiresDays: 58,
    autoPublish: true,
  },
};

const defaultReviews: ReviewItem[] = [
  {
    id: 'rev_1',
    customerName: 'Vikas Tandon',
    rating: 2,
    comment: 'Chai was warm but the bun maska was delivered cold and late.',
    category: 'Food Quality',
    createdAt: '2026-10-05T12:30:00Z',
    status: 'PENDING_REPLY',
    reply: null,
  },
  {
    id: 'rev_2',
    customerName: 'Meera Saxena',
    rating: 3,
    comment: 'AC was not cooling properly in the afternoon sitting area.',
    category: 'Ambience',
    createdAt: '2026-10-04T15:15:00Z',
    status: 'REPLIED',
    reply: 'Hi Meera, sincere apologies! Our AC compressor was serviced this morning. Please enjoy a complimentary kulhad chai on your next visit.',
  },
  {
    id: 'rev_3',
    customerName: 'Sameer Khan',
    rating: 5,
    comment: 'Best adrak chai and kesar biscuit in Lucknow! Great hospitality.',
    category: 'Overall Experience',
    createdAt: '2026-10-04T19:40:00Z',
    status: 'GOOGLE_REDIRECTED',
    reply: null,
  },
  {
    id: 'rev_4',
    customerName: 'Pooja Agarwal',
    rating: 5,
    comment: 'Loved the ambiance and quick coin redemption on billing! Will come again.',
    category: 'Customer Service',
    createdAt: '2026-10-03T17:10:00Z',
    status: 'GOOGLE_REDIRECTED',
    reply: null,
  },
  {
    id: 'rev_5',
    customerName: 'Rahul Joshi',
    rating: 2,
    comment: 'Parking was crowded on weekend evening, had to wait 15 mins.',
    category: 'Accessibility',
    createdAt: '2026-10-02T20:05:00Z',
    status: 'REPLIED',
    reply: 'Hi Rahul, we recommend using the multi-level parking across Mayfair cinema for hassle-free parking during peak hours!',
  },
];

const defaultTimelineData = [
  { date: 'Sep 22', reach: 450, scans: 28, redemptions: 6, coinRedemptions: 4 },
  { date: 'Sep 23', reach: 520, scans: 34, redemptions: 8, coinRedemptions: 5 },
  { date: 'Sep 24', reach: 490, scans: 30, redemptions: 7, coinRedemptions: 6 },
  { date: 'Sep 25', reach: 680, scans: 45, redemptions: 12, coinRedemptions: 9 },
  { date: 'Sep 26', reach: 740, scans: 52, redemptions: 14, coinRedemptions: 11 },
  { date: 'Sep 27', reach: 890, scans: 64, redemptions: 18, coinRedemptions: 15 },
  { date: 'Sep 28', reach: 950, scans: 70, redemptions: 22, coinRedemptions: 18 },
  { date: 'Sep 29', reach: 820, scans: 58, redemptions: 16, coinRedemptions: 12 },
  { date: 'Sep 30', reach: 780, scans: 54, redemptions: 15, coinRedemptions: 10 },
  { date: 'Oct 01', reach: 1120, scans: 82, redemptions: 26, coinRedemptions: 20 },
  { date: 'Oct 02', reach: 1280, scans: 95, redemptions: 31, coinRedemptions: 24 },
  { date: 'Oct 03', reach: 1050, scans: 76, redemptions: 24, coinRedemptions: 18 },
  { date: 'Oct 04', reach: 1350, scans: 102, redemptions: 34, coinRedemptions: 28 },
  { date: 'Oct 05', reach: 1420, scans: 110, redemptions: 38, coinRedemptions: 30 },
];

// ── Provider Component ──────────────────────────────────────────────────────────
const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export const OwnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<Business>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_business`);
      return saved ? JSON.parse(saved) : defaultBusiness;
    } catch {
      return defaultBusiness;
    }
  });

  const [trendFlyer, setTrendFlyer] = useState<ExtendedFlyer | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_trendFlyer`);
      return saved ? JSON.parse(saved) : defaultTrendFlyer;
    } catch {
      return defaultTrendFlyer;
    }
  });

  const [scheduledFlyers, setScheduledFlyers] = useState<ExtendedFlyer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_scheduledFlyers`);
      return saved ? JSON.parse(saved) : defaultScheduledFlyers;
    } catch {
      return defaultScheduledFlyers;
    }
  });

  const [publishedFlyers, setPublishedFlyers] = useState<ExtendedFlyer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_publishedFlyers`);
      return saved ? JSON.parse(saved) : defaultPublishedFlyers;
    } catch {
      return defaultPublishedFlyers;
    }
  });

  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_coupons`);
      return saved ? JSON.parse(saved) : defaultCoupons;
    } catch {
      return defaultCoupons;
    }
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_walletBalance`);
      return saved ? JSON.parse(saved) : 4850;
    } catch {
      return 4850;
    }
  });

  const [lifetimeCredits, setLifetimeCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lifetimeCredits`);
      return saved ? JSON.parse(saved) : 34200;
    } catch {
      return 34200;
    }
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
      return saved ? JSON.parse(saved) : defaultTransactions;
    } catch {
      return defaultTransactions;
    }
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rewards`);
      return saved ? JSON.parse(saved) : defaultRewards;
    } catch {
      return defaultRewards;
    }
  });

  const [dailyScanBonusCoins, setDailyScanBonusCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_dailyScanBonusCoins`);
      return saved ? JSON.parse(saved) : 5;
    } catch {
      return 5;
    }
  });

  const [socialAccounts, setSocialAccounts] = useState<{
    instagram: SocialAccountState;
    facebook: SocialAccountState;
  }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_socialAccounts`);
      return saved ? JSON.parse(saved) : defaultSocialAccounts;
    } catch {
      return defaultSocialAccounts;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  // Sync to LocalStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_business`, JSON.stringify(business));
      localStorage.setItem(`${STORAGE_KEY}_trendFlyer`, JSON.stringify(trendFlyer));
      localStorage.setItem(`${STORAGE_KEY}_scheduledFlyers`, JSON.stringify(scheduledFlyers));
      localStorage.setItem(`${STORAGE_KEY}_publishedFlyers`, JSON.stringify(publishedFlyers));
      localStorage.setItem(`${STORAGE_KEY}_coupons`, JSON.stringify(coupons));
      localStorage.setItem(`${STORAGE_KEY}_walletBalance`, JSON.stringify(walletBalance));
      localStorage.setItem(`${STORAGE_KEY}_lifetimeCredits`, JSON.stringify(lifetimeCredits));
      localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY}_rewards`, JSON.stringify(rewards));
      localStorage.setItem(`${STORAGE_KEY}_dailyScanBonusCoins`, JSON.stringify(dailyScanBonusCoins));
      localStorage.setItem(`${STORAGE_KEY}_socialAccounts`, JSON.stringify(socialAccounts));
      localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
    } catch (e) {
      console.warn('LocalStorage sync warning:', e);
    }
  }, [business, trendFlyer, scheduledFlyers, publishedFlyers, coupons, walletBalance, lifetimeCredits, transactions, rewards, dailyScanBonusCoins, socialAccounts, reviews]);

  // Derived state
  const allFlyers: ExtendedFlyer[] = [
    ...(trendFlyer ? [trendFlyer] : []),
    ...scheduledFlyers,
    ...publishedFlyers,
  ];

  const pendingRedemptionsInr = transactions
    .filter((t) => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0);

  // Business Actions
  const updateBusiness = (updates: Partial<Business>) => {
    setBusiness((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  const updateBusinessImages = (images: BusinessImages) => {
    setBusiness((prev) => ({
      ...prev,
      images: { ...prev.images, ...images },
      updatedAt: new Date().toISOString(),
    }));
  };

  const toggleAutoPublish = (enabled?: boolean) => {
    setBusiness((prev) => ({
      ...prev,
      autoPublish: enabled !== undefined ? enabled : !prev.autoPublish,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Flyer Actions
  const createFlyer = (flyerData: Partial<ExtendedFlyer>): ExtendedFlyer => {
    const newId = `flyer_${Date.now()}`;
    const newVersionId = `v_${Date.now()}`;
    const version: FlyerVersion = {
      id: newVersionId,
      flyerId: newId,
      imageUrl: flyerData.imageUrl || business.images.product?.url || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      caption: flyerData.versions?.[0]?.caption || 'Special promotion at ' + business.name + '! Check out our latest deals today.',
      hashtags: flyerData.hashtags || ['#LucknowCafe', '#SpecialOffer', '#EddyDeals'],
      createdAt: new Date().toISOString(),
    };

    const newFlyer: ExtendedFlyer = {
      id: newId,
      businessId: business.id,
      status: flyerData.status || 'READY',
      title: flyerData.title || 'New Promotion',
      category: flyerData.category || 'CUSTOM',
      trendContext: flyerData.trendContext || 'Custom Promotion',
      imageUrl: version.imageUrl,
      hashtags: version.hashtags,
      couponCode: flyerData.couponCode || 'PROMO10',
      couponExpiresAt: flyerData.couponExpiresAt || new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
      scheduledAt: flyerData.scheduledAt,
      selectedVersionId: newVersionId,
      versions: [version],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...flyerData,
    };

    if (newFlyer.status === 'SCHEDULED') {
      setScheduledFlyers((prev) => [newFlyer, ...prev]);
    } else if (newFlyer.status === 'PUBLISHED') {
      setPublishedFlyers((prev) => [{ ...newFlyer, stats: { reach: 0, impressions: 0, likes: 0, shares: 0, couponsRedeemed: 0 } }, ...prev]);
    } else {
      setTrendFlyer(newFlyer);
    }

    return newFlyer;
  };

  const selectFlyerVersion = (flyerId: string, versionId: string) => {
    if (trendFlyer && trendFlyer.id === flyerId) {
      const ver = trendFlyer.versions.find((v) => v.id === versionId);
      setTrendFlyer({
        ...trendFlyer,
        selectedVersionId: versionId,
        imageUrl: ver?.imageUrl || trendFlyer.imageUrl,
        hashtags: ver?.hashtags || trendFlyer.hashtags,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const scheduleFlyer = (flyerId: string, scheduledAt: string) => {
    if (trendFlyer && trendFlyer.id === flyerId) {
      const scheduled: ExtendedFlyer = {
        ...trendFlyer,
        status: 'SCHEDULED',
        scheduledAt,
        updatedAt: new Date().toISOString(),
      };
      setScheduledFlyers((prev) => [scheduled, ...prev]);
      setTrendFlyer(null);
    }
  };

  const publishFlyerNow = (flyerId: string) => {
    const target = trendFlyer?.id === flyerId ? trendFlyer : scheduledFlyers.find((f) => f.id === flyerId);
    if (!target) return;

    const published: ExtendedFlyer = {
      ...target,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      socialPostId: `ig_post_${Date.now().toString().slice(-6)}`,
      stats: { reach: 120, impressions: 180, likes: 14, shares: 2, couponsRedeemed: 1 },
      updatedAt: new Date().toISOString(),
    };

    if (trendFlyer?.id === flyerId) {
      setTrendFlyer(null);
    } else {
      setScheduledFlyers((prev) => prev.filter((f) => f.id !== flyerId));
    }

    setPublishedFlyers((prev) => [published, ...prev]);
  };

  const deleteFlyer = (flyerId: string) => {
    if (trendFlyer?.id === flyerId) setTrendFlyer(null);
    setScheduledFlyers((prev) => prev.filter((f) => f.id !== flyerId));
    setPublishedFlyers((prev) => prev.filter((f) => f.id !== flyerId));
  };

  // Coupon Actions
  const createCoupon = (couponData: Omit<CouponItem, 'id' | 'claimedCount' | 'redeemedCount' | 'createdAt'>): CouponItem => {
    const newCoupon: CouponItem = {
      id: `c_${Date.now()}`,
      claimedCount: 0,
      redeemedCount: 0,
      createdAt: new Date().toISOString(),
      ...couponData,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    return newCoupon;
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== couponId) return c;
        const newStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...c, status: newStatus };
      })
    );
  };

  // Wallet Actions
  const approveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status: 'APPROVED',
          approvedAt: new Date().toISOString(),
        };
      })
    );
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      setWalletBalance((prev) => prev + tx.amount);
      setLifetimeCredits((prev) => prev + tx.amount);
    }
  };

  const rejectTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'REJECTED' } : t))
    );
  };

  // Rewards Actions
  const updateRewards = (newRewards: Reward[]) => {
    setRewards(newRewards);
  };

  // Social Actions
  const toggleSocialConnection = (platform: 'instagram' | 'facebook') => {
    setSocialAccounts((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: !prev[platform].connected,
        lastSync: new Date().toISOString(),
      },
    }));
  };

  const updateSocialAutoPublish = (platform: 'instagram' | 'facebook', autoPublish: boolean) => {
    setSocialAccounts((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        autoPublish,
      },
    }));
  };

  // Review Actions
  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, status: 'REPLIED', reply: replyText }
          : r
      )
    );
  };

  const reviewStats = {
    overallRating: 4.6,
    totalReviews: reviews.length + 137, // total count
    googleRedirectCount: reviews.filter((r) => r.status === 'GOOGLE_REDIRECTED').length + 115,
    privateFeedbackCount: reviews.filter((r) => r.rating <= 3).length,
  };

  const analyticsSummary = {
    totalReach: 14280,
    reachGrowth: 18.4,
    totalScans: 842,
    scanGrowth: 24.1,
    couponsRedeemed: coupons.reduce((sum, c) => sum + c.redeemedCount, 0),
    couponGrowth: 12.5,
    repeatCustomerRate: 42.8,
  };

  const resetToDefaults = () => {
    setBusiness(defaultBusiness);
    setTrendFlyer(defaultTrendFlyer);
    setScheduledFlyers(defaultScheduledFlyers);
    setPublishedFlyers(defaultPublishedFlyers);
    setCoupons(defaultCoupons);
    setWalletBalance(4850);
    setLifetimeCredits(34200);
    setTransactions(defaultTransactions);
    setRewards(defaultRewards);
    setDailyScanBonusCoins(5);
    setSocialAccounts(defaultSocialAccounts);
    setReviews(defaultReviews);
    localStorage.clear();
  };

  return (
    <OwnerContext.Provider
      value={{
        business,
        updateBusiness,
        updateBusinessImages,
        toggleAutoPublish,
        trendFlyer,
        scheduledFlyers,
        publishedFlyers,
        allFlyers,
        createFlyer,
        selectFlyerVersion,
        scheduleFlyer,
        publishFlyerNow,
        deleteFlyer,
        coupons,
        createCoupon,
        toggleCouponStatus,
        walletBalance,
        lifetimeCredits,
        pendingRedemptionsInr,
        transactions,
        approveTransaction,
        rejectTransaction,
        rewards,
        updateRewards,
        dailyScanBonusCoins,
        setDailyScanBonusCoins,
        socialAccounts,
        toggleSocialConnection,
        updateSocialAutoPublish,
        reviews,
        reviewStats,
        replyToReview,
        analyticsSummary,
        timelineData: defaultTimelineData,
        resetToDefaults,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = (): OwnerContextType => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
};
