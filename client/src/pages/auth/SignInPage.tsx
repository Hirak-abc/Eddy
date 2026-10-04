import { SignIn } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';

export const SignInPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') === 'CUSTOMER' ? 'CUSTOMER' : 'OWNER';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl={`/sign-up?role=${role}`}
        fallbackRedirectUrl={`/complete-login?role=${role}`}
      />
    </div>
  );
};
