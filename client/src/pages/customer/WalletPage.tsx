import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const CustomerWalletPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">My Wallet</h1>
    <Card>
      <CardHeader><CardTitle>Balance (Coins)</CardTitle></CardHeader>
      <CardContent className="text-4xl font-bold text-emerald-600">85 Coins</CardContent>
    </Card>
  </div>
);
