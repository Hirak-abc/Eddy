import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Plus,
  Clock,
  Copy,
  Check,
  Pause,
  Play,
  X,
  Dices,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Tab = 'ACTIVE' | 'EXPIRED' | 'PAUSED';

export const CouponsPage = () => {
  const { coupons, createCoupon, toggleCouponStatus } = useOwner();

  const [activeTab, setActiveTab] = useState<Tab>('ACTIVE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formCode, setFormCode] = useState('');
  const [formDiscount, setFormDiscount] = useState('20');
  const [formType, setFormType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [formMinOrder, setFormMinOrder] = useState('200');

  const counts = useMemo(
    () => ({
      ACTIVE: coupons.filter((c) => c.status === 'ACTIVE').length,
      EXPIRED: coupons.filter((c) => c.status === 'EXPIRED').length,
      PAUSED: coupons.filter((c) => c.status === 'PAUSED').length,
    }),
    [coupons]
  );

  const totalRedemptions = useMemo(
    () => coupons.reduce((acc, c) => acc + c.redeemedCount, 0),
    [coupons]
  );

  const filteredCoupons = coupons.filter((c) => c.status === activeTab);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      toast.error('Clipboard blocked by browser');
      return;
    }
    setCopiedCode(code);
    toast.success(`Copied code ${code} to clipboard`);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateCode = () => {
    const words = ['FEST', 'CHAI', 'THALI', 'DIWALI', 'WOW', 'SPIN'];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(10 + Math.random() * 89);
    const code = `${word}${num}`;
    setFormCode(code);
    toast.success(`Generated code ${code}`);
  };

  const handlePauseToggle = (id: string, status: string) => {
    toggleCouponStatus(id);
    toast.success(status === 'ACTIVE' ? 'Coupon paused' : 'Coupon re-activated');
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = formCode.toUpperCase().trim().replace(/\s+/g, '');
    if (!code || code.length < 4) {
      toast.error('Enter a code with at least 4 characters');
      return;
    }
    if (coupons.some((c) => c.code === code)) {
      toast.error(`Code ${code} already exists`);
      return;
    }
    const discountValue = parseInt(formDiscount, 10);
    if (!discountValue || discountValue <= 0) {
      toast.error('Pick a valid discount value');
      return;
    }
    if (formType === 'PERCENTAGE' && discountValue > 90) {
      toast.error('Percentage discount cannot exceed 90%');
      return;
    }
    const minOrder = Math.max(0, parseInt(formMinOrder, 10) || 0);

    createCoupon({
      code,
      discount: formType === 'PERCENTAGE' ? `${discountValue}% OFF` : `Flat Rs.${discountValue} OFF`,
      discountType: formType,
      discountValue,
      minOrder,
      maxRedemptions: 100,
      expiresAt: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
      status: 'ACTIVE',
      campaign: 'Owner dashboard manual deal',
    });
    toast.success(`Coupon ${code} created with 96-hour validity`);
    setIsModalOpen(false);
    setFormCode('');
    setFormDiscount('20');
    setFormType('PERCENTAGE');
    setFormMinOrder('200');
    setActiveTab('ACTIVE');
  };

  return (
    <div className="min-h-screen bg-slate-50 -m-4 sm:-m-6 p-4 sm:p-6">
      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Promotions</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500">Discounts and Vouchers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Flyer Coupon Deals
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              One-time flyer coupons, valid 96 hours. See{' '}
              <Link to="/owner/qr" className="text-indigo-600 font-semibold hover:underline">
                QR standees
              </Link>{' '}
              or{' '}
              <Link to="/owner/rewards" className="text-indigo-600 font-semibold hover:underline">
                rewards
              </Link>
              .
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Create New Coupon</span>
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Deals</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{counts.ACTIVE}</div>
            <p className="text-[11px] text-slate-400">96-hour validity window</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Total Redemptions</span>
            <div className="text-2xl font-black text-amber-600 font-mono">{totalRedemptions}</div>
            <p className="text-[11px] text-slate-400">Claimed at billing counter</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Paused Deals</span>
            <div className="text-2xl font-black text-indigo-600 font-mono">{counts.PAUSED}</div>
            <p className="text-[11px] text-slate-400">Hidden from customers until resumed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {(['ACTIVE', 'PAUSED', 'EXPIRED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'ACTIVE' && `Active (${counts.ACTIVE})`}
              {tab === 'PAUSED' && `Paused (${counts.PAUSED})`}
              {tab === 'EXPIRED' && `Expired (${counts.EXPIRED})`}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Ticket size={22} />
            </div>
            <h3 className="font-bold text-slate-900">No {activeTab.toLowerCase()} coupons</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'ACTIVE'
                ? 'Create a festive 96-hour deal to drive footfall this week.'
                : 'Switch tabs or create a fresh deal.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {activeTab !== 'ACTIVE' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('ACTIVE')}
                  className="rounded-xl text-xs font-bold"
                >
                  View Active Deals
                </Button>
              )}
              <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Create Coupon
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCoupons.map((coupon) => {
              const isActive = coupon.status === 'ACTIVE';
              const isPaused = coupon.status === 'PAUSED';
              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isPaused
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {coupon.status}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <Clock size={12} className="text-amber-500" />
                        <span>96h Window</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Coupon Code</div>
                        <div className="text-lg font-black font-mono text-slate-900 tracking-wider truncate">
                          {coupon.code}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        aria-label={`Copy ${coupon.code}`}
                        className="shrink-0 p-2 rounded-xl bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors shadow-sm"
                      >
                        {copiedCode === coupon.code ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">Discount:</span>
                        <strong className="text-slate-900 font-bold text-right">{coupon.discount}</strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">Min order:</span>
                        <strong className="text-slate-900 font-mono">Rs.{coupon.minOrder}</strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">Redeemed:</span>
                        <strong className="text-emerald-600 font-mono">
                          {coupon.redeemedCount}/{coupon.maxRedemptions}
                        </strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">Campaign:</span>
                        <strong className="text-slate-700 text-right truncate max-w-[55%]">{coupon.campaign}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Expires {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    {coupon.status !== 'EXPIRED' && (
                      <button
                        type="button"
                        onClick={() => handlePauseToggle(coupon.id, coupon.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          isActive
                            ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isActive ? <Pause size={12} /> : <Play size={12} />}
                        {isActive ? 'Pause' : 'Resume'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-950/70"
              onClick={() => setIsModalOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Ticket size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Create 96h Coupon Deal</h3>
                    <p className="text-[11px] text-slate-500">Attached to AI flyers and table QR scans.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close dialog"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCouponSubmit} className="space-y-4">
                <div>
                  <label htmlFor="coupon-code" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon-code"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      placeholder="e.g. NAVRATRI25"
                      className="font-mono font-bold uppercase"
                      maxLength={16}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateCode}
                      title="Generate random code"
                      aria-label="Generate random code"
                      className="rounded-xl shrink-0 px-3"
                    >
                      <Dices size={16} />
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Discount Type
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['PERCENTAGE', 'FLAT'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormType(t)}
                        aria-pressed={formType === t}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          formType === t
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {t === 'PERCENTAGE' ? '% Percentage' : 'Rs. Flat Off'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {formType === 'PERCENTAGE' ? 'Discount Percentage' : 'Flat Discount (Rs.)'}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(formType === 'PERCENTAGE' ? ['10', '15', '20', '25'] : ['30', '50', '75', '100']).map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setFormDiscount(d)}
                        aria-pressed={formDiscount === d}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          formDiscount === d
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {formType === 'PERCENTAGE' ? `${d}%` : `Rs.${d}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="coupon-min" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Minimum Order Value (Rs.)
                  </label>
                  <Input
                    id="coupon-min"
                    type="number"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    placeholder="e.g. 200"
                    min={0}
                    className="font-mono"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1">
                    <Clock size={12} /> 96-Hour Rule
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 mt-0.5">
                    Flyer coupons stay valid for exactly 96 hours to drive fast local footfall.
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm"
                  >
                    Create and Activate
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
