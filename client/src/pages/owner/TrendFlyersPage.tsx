import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const TrendFlyersPage = () => {
  // Mock data for flyers
  const flyers = [
    { id: 1, title: 'Summer Sale', trend: 'Seasonal' },
    { id: 2, title: 'Flash Discount', trend: 'Local Event' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Trend Flyers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flyers.map((flyer) => (
          <Card key={flyer.id}>
            <CardHeader><CardTitle>{flyer.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4">Trend: {flyer.trend}</p>
              <Button>Select & Customize</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
