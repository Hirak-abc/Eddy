import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type UserRole = 'OWNER' | 'CUSTOMER' | null;

export function SignInPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSignIn = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    // TODO: Implement actual Clerk sign-in with role
    console.log('Sign in as:', selectedRole);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to respective dashboard after signin
      if (selectedRole === 'OWNER') {
        window.location.href = '/owner/dashboard';
      } else {
        window.location.href = '/customer/home';
      }
    }, 1500);
  };

  // Demo mode quick login
  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    console.log('Demo login as:', role);
    setTimeout(() => {
      if (role === 'OWNER') {
        window.location.href = '/owner/dashboard';
      } else {
        window.location.href = '/customer/home';
      }
    }, 500);
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
          <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {!selectedRole ? (
          <>
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
                  <CardTitle className="text-2xl">Business Owner</CardTitle>
                  <CardDescription>
                    Access your dashboard, flyers, and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <span>Sign in as Owner</span>
                  </Button>
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
                  <CardTitle className="text-2xl">Customer</CardTitle>
                  <CardDescription>
                    Access your wallet, rewards, and scan QR codes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <span>Sign in as Customer</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Demo Mode Section */}
            <Card className="mt-6 border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <p className="mb-3 text-sm font-medium text-amber-900 dark:text-amber-200">
                  🚀 Quick Demo Access (Dev Mode)
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('OWNER')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Demo as Owner
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('CUSTOMER')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Demo as Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>
                {selectedRole === 'OWNER' ? 'Business Owner' : 'Customer'} Sign In
              </CardTitle>
              <CardDescription>
                You selected {selectedRole === 'OWNER' ? 'Business Owner' : 'Customer'} account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Replace with actual Clerk SignIn component */}
              <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Clerk Sign In form will be integrated here
                </p>
                <Button onClick={handleSignIn} loading={isLoading} className="w-full">
                  Sign in as {selectedRole === 'OWNER' ? 'Business Owner' : 'Customer'}
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
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
