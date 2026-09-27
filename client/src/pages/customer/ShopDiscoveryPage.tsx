import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export const ShopDiscoveryPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Discover Shops</h1>
    <Input placeholder="Search shops by location or category..." />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Local Shop {i}</CardTitle></CardHeader>
          <CardContent>Category: Food & Beverage</CardContent>
        </Card>
      ))}
    </div>
  </div>
);
