import { useState } from 'react';
import {
  Save,
  Building2,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Crown,
  Download,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Eye,
  EyeOff,
  RefreshCw,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const SettingsPage = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { business, updateBusiness } = useOwner();

  // Profile editing
  const [businessName, setBusinessName] = useState(business?.name || '');
  const [phone, setPhone] = useState(business?.phone || '');
  const [address, setAddress] = useState(business?.address || '');
  const [operatingHours, setOperatingHours] = useState(business?.hours || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    whatsapp: false,
    push: true,
  });

  // Subscription state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Password change (account security)
  const [passwordSection, setPasswordSection] = useState<'idle' | 'changing'>('idle');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Notification toggle handler
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preference updated');
  };

  // Profile save handler
  const handleProfileSave = () => {
    if (!businessName.trim()) {
      toast.error('Business name is required');
      return;
    }
    setProfileSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateBusiness({
        name: businessName,
        phone,
        address,
        hours: operatingHours,
      });
      setProfileSaving(false);
      toast.success('Business profile updated successfully!');
    }, 600);
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  // Password change handler
  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordSection('changing');
    // Simulate API call
    setTimeout(() => {
      setPasswordSection('idle');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!');
    }, 800);
  };

  // Invoice data
  const invoices = [
    { id: 'INV-2025-001', date: '2025-09-01', amount: 299, status: 'PAID', cycle: 'Sep 2025' },
    { id: 'INV-2025-002', date: '2025-08-01', amount: 299, status: 'PAID', cycle: 'Aug 2025' },
    { id: 'INV-2025-003', date: '2025-07-01', amount: 299, status: 'PAID', cycle: 'Jul 2025' },
    { id: 'INV-2025-004', date: '2025-06-01', amount: 299, status: 'PAID', cycle: 'Jun 2025' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Shield size={14} /> Account & Business
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Profile, Security & Subscription</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Settings & Subscription
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
            <Crown size={12} className="fill-amber-500 text-amber-600" />
            Eddy Pro Active
          </span>
        </div>
      </div>

      {/* ── Subscription & Billing Card ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-amber-400" />
              <h2 className="text-lg font-bold text-white">Pro Subscription — ₹299 / Month</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Active billing cycle: Auto-renews monthly on the 1st. Includes unlimited AI flyer generation,
              Meta Graph publishing, QR analytics, and priority support.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-indigo-300 uppercase font-bold">Next Billing</div>
              <div className="text-sm font-black font-mono text-amber-300">Oct 1, 2025</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
              <div className="text-[10px] text-indigo-200 uppercase font-semibold">Status</div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 size={14} className="fill-emerald-300" /> Active
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5"
            onClick={() => toast.info('Invoice download started')}
          >
            <Download size={14} />
            <span>Download Invoice</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl text-xs"
            onClick={() => toast.info('Billing portal opening...')}
          >
            <CreditCard size={14} />
            <span>Manage Billing</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Business Profile + Notifications ────────── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Business Profile Editor */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 size={18} className="text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900">Business Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Business Name
                </label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your restaurant / shop name"
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  className="rounded-xl text-sm font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full shop address"
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Operating Hours
                </label>
                <Input
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="e.g. 10:00 AM – 11:00 PM (Mon–Sun)"
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>{profileSaving ? 'Saving...' : 'Save Profile'}</span>
              </Button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell size={18} className="text-amber-500" />
              <h2 className="font-bold text-base text-slate-900">Notification Preferences</h2>
            </div>

            <p className="text-xs text-slate-500">Choose how Eddy sends you alerts about reviews, redemptions, and publishing status.</p>

            <div className="space-y-3 pt-1">
              {[
                {
                  key: 'sms' as const,
                  icon: Smartphone,
                  label: 'SMS Alerts',
                  desc: 'Text messages for urgent redemption requests and critical reviews',
                },
                {
                  key: 'email' as const,
                  icon: Mail,
                  label: 'Email Notifications',
                  desc: 'Daily summary reports and invoice delivery',
                },
                {
                  key: 'whatsapp' as const,
                  icon: MessageSquare,
                  label: 'WhatsApp Alerts',
                  desc: 'Instant push for new customer reviews and coupon claims',
                },
                {
                  key: 'push' as const,
                  icon: Bell,
                  label: 'Browser Push',
                  desc: 'Real-time browser notifications for 48h publish window reminders',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <item.icon size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      notifications[item.key] ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Security + Invoices ──────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield size={18} className="text-emerald-600" />
              <h2 className="font-bold text-base text-slate-900">Account Security</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Current Password
                </label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  New Password
                </label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  {showPasswords ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPasswords ? 'Hide' : 'Show'} passwords
                </button>

                <Button
                  size="sm"
                  onClick={handlePasswordChange}
                  disabled={passwordSection === 'changing'}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  {passwordSection === 'changing' ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>{passwordSection === 'changing' ? 'Updating...' : 'Change Password'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={18} className="text-sky-600" />
              <h2 className="font-bold text-base text-slate-900">Invoice History</h2>
            </div>

            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors cursor-pointer ${
                    selectedInvoice === inv.id
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-slate-50/60 border-slate-200/60 hover:bg-slate-100'
                  }`}
                  onClick={() => {
                    setSelectedInvoice(inv.id);
                    setShowInvoiceModal(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {inv.status === 'PAID' ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-mono">{inv.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {inv.cycle} • ₹{inv.amount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <Download size={14} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Crown size={18} className="text-amber-500" />
              <h2 className="font-bold text-base text-slate-900">Quick Actions</h2>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Download QR Standee Print File', icon: Download, desc: 'A6 / A5 / Sticker PDF' },
                { label: 'View Full Analytics Report', icon: FileText, desc: 'Export CSV / PDF' },
                { label: 'Re-connect Meta Accounts', icon: RefreshCw, desc: 'Token refresh' },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => toast.info(`Opening: ${action.label}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60 border border-slate-200/60 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    <action.icon size={15} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{action.label}</div>
                    <div className="text-[10px] text-slate-500">{action.desc}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Danger Zone: Sign Out ──────────────────────────────── */}
          <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <LogOut size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-950">Sign Out</h3>
                <p className="text-xs text-rose-700/80">
                  Securely end your session and return to the landing page.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-rose-300 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs"
            >
              <LogOut size={14} className="mr-1.5" />
              Sign Out of Eddy
            </Button>
          </div>
        </div>
      </div>

      {/* ── Invoice Preview Modal ──────────────────────────────────── */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setShowInvoiceModal(false)} />

          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Invoice Preview</h3>
                <p className="text-[11px] text-slate-500 font-mono">{selectedInvoice}</p>
              </div>

              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Invoice ID</span>
                  <span className="font-mono font-bold text-slate-900">{selectedInvoice}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-bold text-slate-900">Eddy Pro — ₹299/mo</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Cycle</span>
                  <span className="font-mono font-bold text-slate-900">
                    {invoices.find((i) => i.id === selectedInvoice)?.cycle}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{invoices.find((i) => i.id === selectedInvoice)?.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} /> PAID
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                <strong>Payment Method:</strong> Razorpay — Saved card ending in 4242
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInvoiceModal(false)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                onClick={() => {
                  toast.success(`Downloading ${selectedInvoice}...`);
                  setShowInvoiceModal(false);
                }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
