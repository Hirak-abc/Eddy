import type { ID } from './index';

// ── API envelope ─────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

// ── Pagination ───────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ── Common query params ──────────────────────────────
export interface DateRangeParams {
  from?: string;
  to?: string;
}

// ── Analytics ────────────────────────────────────────
export interface AnalyticsOverview {
  totalReach: number;
  totalEngagement: number;
  totalComments: number;
  flyersPublished: number;
  period: string;
}

export interface FlyerAnalytics {
  flyerId: ID;
  reach: number;
  reactions: number;
  comments: number;
  engagement: number;
  publishedAt: string;
}

export interface TimelineDataPoint {
  date: string;
  reach: number;
  engagement: number;
}
