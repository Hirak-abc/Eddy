import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import type { Request, Response, NextFunction } from 'express';
import app from '../app';

const walletState = vi.hoisted(() => ({
  scanCount: 0,
  balance: 0,
  transactions: [] as Array<{
    id: string;
    businessId: string;
    amount: number;
    type: string;
    createdAt: string;
  }>,
}));

vi.mock('../middleware/auth.middleware', () => ({
  authenticate: (req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: 'customer-e2e', role: 'CUSTOMER' };
    req.authToken = 'verified-test-session';
    next();
  },
  authorize: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../modules/qr/qr.repository', () => ({
  QR_REPOSITORY: {
    recordScan: vi.fn(async () => {
      walletState.scanCount += 1;
      return {
        scanId: `scan-${walletState.scanCount}`,
        businessId: 'shop-e2e',
        businessName: 'Test Cafe',
        category: 'Cafe',
        address: 'Main Street',
        scansToday: walletState.scanCount,
        scansLeft: 100 - walletState.scanCount,
      };
    }),
    getScansCountToday: vi.fn(async () => ({
      scansToday: walletState.scanCount,
      scansLeft: 100 - walletState.scanCount,
    })),
    resolveQr: vi.fn(async () => null),
  },
}));

vi.mock('../modules/rewards/rewards.repository', () => ({
  REWARDS_REPOSITORY: {
    recordSpin: vi.fn(async (scanId: string) => {
      walletState.balance += 5;
      walletState.transactions.unshift({
        id: `spin-${scanId}`,
        businessId: 'shop-e2e',
        amount: 5,
        type: 'QR_SPIN_REWARD',
        createdAt: new Date().toISOString(),
      });
      return {
        spinId: `spin-${scanId}`,
        rewardType: 'COINS',
        rewardValue: '5',
        coinsAwarded: 5,
        coinsCredited: 5,
        coinsOverflow: 0,
        walletBalance: walletState.balance,
        cycleNumber: 1,
        slotIndex: 0,
        idempotentReplay: false,
      };
    }),
    getStreakData: vi.fn(async () => ({
      currentStreak: 0,
      bonusCoinsEarned: 0,
      lastActiveDate: null,
    })),
  },
}));

vi.mock('../modules/wallet/wallet.repository', () => ({
  WALLET_REPOSITORY: {
    getCustomerWallet: vi.fn(async () => ({
      balance: walletState.balance,
      availableBalance: walletState.balance,
      reservedBalance: 0,
      spentBalance: 0,
      transactions: walletState.transactions,
    })),
  },
}));

describe('QR scan, server spin, and customer wallet flow', () => {
  beforeEach(() => {
    walletState.scanCount = 0;
    walletState.balance = 0;
    walletState.transactions = [];
  });

  it('records an eligible shop scan, credits only the server spin, and returns the wallet balance', async () => {
    const scan = await request(app)
      .post('/api/qr/scan')
      .send({ qrToken: 'a'.repeat(43) });

    expect(scan.status).toBe(200);
    expect(scan.body.data).toMatchObject({
      businessId: 'shop-e2e',
      businessName: 'Test Cafe',
      scansToday: 1,
      scansLeft: 99,
    });
    expect(walletState.balance).toBe(0);

    const spin = await request(app)
      .post('/api/rewards/spin')
      .send({ scanId: scan.body.data.scanId });

    expect(spin.status).toBe(200);
    expect(spin.body.data).toMatchObject({
      coinsAwarded: 5,
      coinsCredited: 5,
      coinsOverflow: 0,
      walletBalance: 5,
    });

    const wallet = await request(app).get('/api/wallet');
    expect(wallet.status).toBe(200);
    expect(wallet.body.data).toMatchObject({
      balance: 5,
      availableBalance: 5,
      reservedBalance: 0,
      transactions: [
        expect.objectContaining({
          businessId: 'shop-e2e',
          amount: 5,
          type: 'QR_SPIN_REWARD',
        }),
      ],
    });
  });
});
