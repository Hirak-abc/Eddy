import { SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';

export const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') === 'CUSTOMER' ? 'CUSTOMER' : 'OWNER';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl={`/complete-signup?role=${role}`}
        unsafeMetadata={{ role }}
      />
    </div>
  );
};
