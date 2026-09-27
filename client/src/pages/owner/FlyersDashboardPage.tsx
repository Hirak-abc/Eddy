import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

export const FlyersDashboardPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-3xl font-bold">Flyer Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader><CardTitle>Create New</CardTitle></CardHeader>
        <CardContent>
          <Button asChild><Link to={ROUTES.OWNER_CREATE_FLYER}>Build Flyer</Link></Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Scheduled</CardTitle></CardHeader>
        <CardContent>
          <Button asChild variant="outline"><Link to={ROUTES.OWNER_SCHEDULED}>View Scheduled</Link></Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Published</CardTitle></CardHeader>
        <CardContent>
          <Button asChild variant="outline"><Link to={ROUTES.OWNER_PUBLISHED}>View Published</Link></Button>
        </CardContent>
      </Card>
    </div>
  </div>
);
