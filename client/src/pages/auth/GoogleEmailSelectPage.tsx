import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { API_BASE_URL } from '@/lib/constants';
import { getPostAuthPath, type AuthRole } from '@/lib/auth';
import { clearApplicationUserCache } from '@/hooks/useApplicationUser';

export const GoogleEmailSelectPage = () => {
  const navigate = useNavigate();
  const clerkAuth = useAuth();
  const isLoaded = clerkAuth.isLoaded;
  const isSignedIn = clerkAuth.isSignedIn;
  const userId = clerkAuth.userId;
  const getToken = clerkAuth.getToken;
  const user = (clerkAuth as any).user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const startedRef = useRef(false);

  const emailAddresses = (user?.emailAddresses as Array<{ emailAddress: string }> | undefined)?.map((e) => e.emailAddress) || [];
  const primaryEmail = (user?.primaryEmailAddress as { emailAddress: string } | null)?.emailAddress || '';
  // Ensure primary email is always included in dropdown options
  const dropdownEmails = emailAddresses.length > 0 ? emailAddresses : (primaryEmail ? [primaryEmail] : []);

  useEffect(() => {
    if (primaryEmail && !selectedEmail) setSelectedEmail(primaryEmail);
  }, [primaryEmail]);

  const handleContinue = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !userId) {
      toast.error('Authentication not ready.');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    setIsSubmitting(true);

    try {
      const token = await getToken();
      if (!token) { setIsSubmitting(false); startedRef.current = false; return; }

      // Pass role hint from sessionStorage for new-user creation
      const savedRole = sessionStorage.getItem('eddy.authRole') as 'OWNER' | 'CUSTOMER' | null;
      const roleQuery = savedRole ? `?role=${encodeURIComponent(savedRole)}` : '';
      const resp = await fetch(`${API_BASE_URL}/me${roleQuery}`, { headers: { Authorization: `Bearer ${token}` } });
      const payload = (await resp.json()) as { success?: boolean; data?: { role?: AuthRole }; error?: { message?: string } };

      if (!resp.ok || !payload?.success) {
        toast.error(payload?.error?.message || 'Failed.');
        setIsSubmitting(false); startedRef.current = false; return;
      }

      const backendRole = payload.data?.role;
      if (backendRole !== 'OWNER' && backendRole !== 'CUSTOMER') {
        toast.error('Role missing.');
        setIsSubmitting(false); startedRef.current = false; return;
      }

      clearApplicationUserCache();
      navigate(getPostAuthPath(backendRole), { replace: true });
    } catch {
      toast.error('Failed.');
      setIsSubmitting(false); startedRef.current = false;
    }
  }, [isLoaded, isSignedIn, userId, getToken, navigate]);

  if (!isLoaded) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" /></div>;
  if (!isSignedIn) { navigate('/sign-in', { replace: true }); return null; }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <Card className="w-full max-w-md rounded-2xl border-slate-200/80 shadow-2xl shadow-indigo-100/50">
        <CardHeader className="space-y-4 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100"><Mail className="h-7 w-7 text-indigo-600" /></div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Continue with Google</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pb-8">
          <div className="space-y-2">
            <label htmlFor="email-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Your Google Account</label>
            <select id="email-select" value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm hover:border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              {dropdownEmails.map((email: string) => <option key={email} value={email}>{email}</option>)}
            </select>
          </div>
          <Button className="w-full gap-2 rounded-xl bg-indigo-600 py-3 text-base font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700" onClick={handleContinue} disabled={isSubmitting || !selectedEmail}>
            {isSubmitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Continuing...</> : <>Continue with this account<ArrowRight className="h-4 w-4" /></>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
