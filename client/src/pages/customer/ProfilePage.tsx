import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Coins, Flame, Store, ChevronRight, Camera, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useClerk } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';
import { clearAuthFlowState } from '@/lib/authRedirect';

const STATS = [
  { label: 'Day streak', value: '5', color: 'bg-orange-100 text-orange-600' },
  { label: 'Coins', value: '85', color: 'bg-amber-100 text-amber-600' },
  { label: 'Shops', value: '3', color: 'bg-emerald-100 text-emerald-600' },
];

export const ProfilePage = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { photoUrl, uploadPhoto, removePhoto } = useProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(() => {
        clearAuthFlowState();
        navigate('/');
      });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    const result = await uploadPhoto(file);
    setUploading(false);
    if (result.ok) toast.success('Profile photo updated');
    else toast.error(result.error ?? 'Could not update profile photo');
  };

  const handleRemovePhoto = () => {
    removePhoto();
    toast.success('Profile photo removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          <User size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your account & activity</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Cover */}
        <div className="relative h-32 bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1000&q=80"
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
        </div>
        <CardContent className="space-y-5 p-6">
          <div className="-mt-14 flex items-end gap-4">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-amber-400 to-orange-600 text-3xl font-black text-white shadow-lg dark:border-slate-900">
                {photoUrl ? (
                  <img src={photoUrl} alt="Customer profile photo" className="h-full w-full object-cover" />
                ) : (
                  'A'
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title={uploading ? 'Uploading photo…' : 'Upload profile photo'}
                aria-label={uploading ? 'Uploading photo' : 'Upload profile photo'}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-2 ring-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-amber-500 dark:text-slate-950 dark:ring-slate-900 dark:hover:bg-amber-400"
              >
                <Camera size={15} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Choose profile photo"
              />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="truncate text-xl font-extrabold text-slate-900 dark:text-white">Aarav Sharma</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Customer · Member since Oct 2026</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline disabled:opacity-60 dark:text-amber-300 dark:hover:text-amber-200"
                >
                  {uploading ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            </div>
            <Link
              to="/customer/settings"
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Settings size={14} /> Edit
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-100 dark:bg-slate-800/60 dark:ring-slate-800">
                <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                  {stat.label === 'Day streak' ? <Flame size={16} /> : stat.label === 'Coins' ? <Coins size={16} /> : <Store size={16} />}
                </div>
                <div className="text-xl font-black tabular-nums text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link
            to="/customer/history"
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition-colors hover:bg-slate-100 dark:bg-slate-800/60 dark:ring-slate-800 dark:hover:bg-slate-800"
          >
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">View transaction history</span>
            <ChevronRight size={17} className="text-slate-400" />
          </Link>

          <Button
            onClick={handleSignOut}
            className="w-full bg-slate-900 py-3 font-extrabold text-white hover:bg-slate-700"
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
