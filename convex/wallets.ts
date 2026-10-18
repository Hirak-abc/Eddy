import { query } from './_generated/server';
import { requireUser } from './auth';

export const getCustomerWallet = query({
  args: {},
  handler: async (ctx) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const wallet = await ctx.db
      .query('wallets')
      .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
      .unique();
    const transactions = await ctx.db
      .query('walletTransactions')
      .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
      .order('desc')
      .take(50);

    return {
      balance: wallet?.balance ?? 0,
      availableBalance: wallet?.balance ?? 0,
      reservedBalance: wallet?.reservedBalance ?? 0,
      spentBalance: wallet?.spentBalance ?? 0,
      transactions: transactions.map((transaction) => ({
        id: transaction._id,
        businessId: transaction.businessId,
        amount: transaction.amount,
        type: transaction.type,
        createdAt: transaction.createdAt,
      })),
    };
  },
});

export const getOwnerWallet = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const wallet = await ctx.db
      .query('ownerWallets')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();
    const transactions = await ctx.db
      .query('ownerWalletTransactions')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .order('desc')
      .collect();

    return {
      balancePaise: wallet?.balancePaise ?? 0,
      lifetimeCreditsPaise: wallet?.lifetimeCreditsPaise ?? 0,
      approvedRedemptionsCount: transactions.filter(
        (transaction) => transaction.type === 'COIN_REDEMPTION_CREDIT',
      ).length,
      transactions: transactions.slice(0, 100),
    };
  },
});
