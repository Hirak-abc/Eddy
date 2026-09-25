import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type UserRole = 'OWNER' | 'CUSTOMER' | null;

export function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSignUp = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    // TODO: Implement actual Clerk sign-up with role
    console.log('Sign up as:', selectedRole);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to respective dashboard after signup
      if (selectedRole === 'OWNER') {
        window.location.href = '/owner/dashboard';
      } else {
        window.location.href = '/customer/home';
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              E
            </div>
            <span className="font-bold text-2xl">Eddy</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            Choose how you want to use Eddy
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Business Owner Card */}
            <Card
              className={cn(
                'cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg',
                'group'
              )}
              onClick={() => handleRoleSelect('OWNER')}
            >
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Store className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">I'm a Business Owner</CardTitle>
                <CardDescription>
                  Grow your local business with AI-powered marketing and customer rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    AI-generated promotional flyers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Automatic social media publishing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    QR rewards for customers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Real-time analytics dashboard
                  </li>
                </ul>
                <div className="mt-6 flex items-center justify-between text-sm font-semibold">
                  <span className="text-2xl font-bold">₹299/month</span>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card
              className={cn(
                'cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg',
                'group'
              )}
              onClick={() => handleRoleSelect('CUSTOMER')}
            >
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-950/40 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <User className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">I'm a Customer</CardTitle>
                <CardDescription>
                  Discover local businesses and earn rewards for your visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Scan QR codes to earn coins
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Redeem coins for discounts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Spin the wheel for rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Track your wallet & streaks
                  </li>
                </ul>
                <div className="mt-6 flex items-center justify-between text-sm font-semibold">
                  <span className="text-2xl font-bold text-emerald-600">Free Forever</span>
                  <ArrowRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>
                {selectedRole === 'OWNER' ? 'Business Owner' : 'Customer'} Sign Up
              </CardTitle>
              <CardDescription>
                You selected {selectedRole === 'OWNER' ? 'Business Owner' : 'Customer'} account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Replace with actual Clerk SignUp component */}
              <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Clerk Sign Up form will be integrated here
                </p>
                <Button onClick={handleSignUp} loading={isLoading} className="w-full">
                  Continue as {selectedRole === 'OWNER' ? 'Business Owner' : 'Customer'}
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setSelectedRole(null)}
                className="w-full"
              >
                ← Back to role selection
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
