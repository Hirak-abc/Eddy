import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Reach</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">1,240</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Flyers</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">3</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Coupons Used</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">12</CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link to="/owner/flyers/create">Create New Flyer</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/owner/trend-flyers">View Trend Flyers</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
