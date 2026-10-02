import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApplicationUser } from '@/hooks/useApplicationUser';

export const HomePage = () => {
  const { greetingName } = useApplicationUser();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hello {greetingName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Your Current Streak</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-emerald-600">5 Days 🔥</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Wallet Balance</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-emerald-600">₹85</CardContent>
        </Card>
      </div>
    </div>
  );
};
