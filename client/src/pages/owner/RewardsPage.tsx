import { useState } from 'react';
import {
  Gift,
  Save,
  Coins,
  Flame,
  Award,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PrizeWedge {
  id: string;
  label: string;
  type: 'COINS' | 'COUPON' | 'ITEM' | 'NONE';
  value: number | string;
  weight: number; // percentage probability
  color: string;
}

export const RewardsPage = () => {
  const [wedges, setWedges] = useState<PrizeWedge[]>([
    { id: '1', label: '10 Eddy Coins', type: 'COINS', value: 10, weight: 35, color: 'bg-amber-500 text-white' },
    { id: '2', label: '15% OFF Coupon', type: 'COUPON', value: '15%', weight: 25, color: 'bg-indigo-500 text-white' },
    { id: '3', label: '25 Eddy Coins', type: 'COINS', value: 25, weight: 15, color: 'bg-emerald-500 text-white' },
    { id: '4', label: 'Free Kulhad Chai', type: 'ITEM', value: 'Chai', weight: 10, color: 'bg-rose-500 text-white' },
    { id: '5', label: '5 Eddy Coins', type: 'COINS', value: 5, weight: 10, color: 'bg-amber-600 text-white' },
    { id: '6', label: 'Better Luck', type: 'NONE', value: 0, weight: 5, color: 'bg-slate-400 text-white' },
  ]);

  const totalWeight = wedges.reduce((acc, w) => acc + (Number(w.weight) || 0), 0);
  const isValidWeight = totalWeight === 100;

  const WEDGE_HEX: Record<string, string> = {
    '1': '#f59e0b',
    '2': '#6366f1',
    '3': '#10b981',
    '4': '#f43f5e',
    '5': '#d97706',
    '6': '#94a3b8',
  };

  const wheelGradient = (() => {
    let acc = 0;
    const stops = wedges.map((w) => {
      const start = (acc / 100) * 360;
      acc += Number(w.weight) || 0;
      const end = (acc / 100) * 360;
      return `${WEDGE_HEX[w.id] ?? '#94a3b8'} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from -90deg, ${stops.join(', ')})`;
  })();

  const handleWeightChange = (id: string, newWeight: number) => {
    setWedges((prev) =>
      prev.map((w) => (w.id === id ? { ...w, weight: Math.max(0, Math.min(100, newWeight)) } : w))
    );
  };

  const handleSaveSettings = () => {
    if (!isValidWeight) {
      toast.error(`Total probability must equal 100% (currently ${totalWeight}%)`);
      return;
    }
    toast.success('Reward spin wheel and streak rules saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <Gift size={14} /> Customer Gamification
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Spin Wheel & Streaks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rewards & Spin Wheel Settings
          </h1>
        </div>

        <Button
          onClick={handleSaveSettings}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
        >
          <Save size={15} />
          <span>Save Reward Rules</span>
        </Button>
      </div>

      {/* ── Coin Economy Rules Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Coins size={13} /> Coin Valuation
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">1 Coin = ₹1.00</div>
          <p className="text-[11px] text-slate-400">Direct ₹ discount at billing</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Redemption Thresholds</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">50 – 100 Coins</div>
          <p className="text-[11px] text-slate-400">Min 50 to redeem, max 100 wallet cap</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <Flame size={13} /> Daily Scan & Streak
          </span>
          <div className="text-2xl font-black text-indigo-600 font-mono">3 Scans / Day</div>
          <p className="text-[11px] text-slate-400">3-day inactivity resets customer streak</p>
        </div>
      </div>

      {/* ── Spin Wheel Prizes Config ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prize Odds Editor */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Spin-the-Wheel Prize Odds</h2>
              <p className="text-xs text-slate-500">Configure what customers win when scanning table QR standees.</p>
            </div>

            <div
              className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                isValidWeight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span>Total Probability: {totalWeight}%</span>
              {isValidWeight ? <CheckCircle2 size={13} /> : <span className="font-extrabold">(Must be 100%)</span>}
            </div>
          </div>

          <div className="space-y-3">
            {wedges.map((w, idx) => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{w.label}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{w.type} PRIZE</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Win Chance:</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={w.weight}
                      onChange={(e) => handleWeightChange(w.id, parseInt(e.target.value, 10) || 0)}
                      className="w-20 font-mono text-xs font-bold text-center"
                      min={0}
                      max={100}
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Preview + Streak Milestone Bonuses */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4 text-white">
            <div className="flex items-center gap-2">
              <Percent size={16} className="text-amber-400" />
              <h3 className="font-bold text-sm">Live Wheel Preview</h3>
            </div>
            <div className="relative w-44 h-44 mx-auto">
              <div
                className="w-full h-full rounded-full border-4 border-white/10 shadow-xl"
                style={{ background: wheelGradient }}
              />
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-amber-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Gift size={20} className="text-amber-500" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {wedges.map((w) => (
                <div key={w.id} className="flex items-center gap-2 text-[11px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: WEDGE_HEX[w.id] ?? '#94a3b8' }}
                  />
                  <span className="flex-1 truncate text-slate-300">{w.label}</span>
                  <span className="font-mono font-bold text-amber-300">{w.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Streak Milestones</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Reward loyal customers who visit consistently. Bonuses are awarded automatically on reaching day milestones.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950">10-Day Streak Milestone</div>
                  <div className="text-[10px] text-amber-800">Bonus rewarded upon 10th visit</div>
                </div>
                <strong className="text-xs font-bold text-amber-900 font-mono">+10 Coins</strong>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950">20-Day Streak Milestone</div>
                  <div className="text-[10px] text-amber-800">Bonus rewarded upon 20th visit</div>
                </div>
                <strong className="text-xs font-bold text-amber-900 font-mono">+20 Coins</strong>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950">30-Day VIP Milestone</div>
                  <div className="text-[10px] text-amber-800">Ultimate local champion reward</div>
                </div>
                <strong className="text-xs font-bold text-amber-900 font-mono">+30 Coins</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
