import {
  Gift,
  Coins,
  Flame,
} from 'lucide-react';

const PRIZES = [
  { label: '2 Eddy Coins', probability: 50, color: 'bg-amber-500 text-white' },
  { label: '3 Eddy Coins', probability: 30, color: 'bg-orange-400 text-white' },
  { label: '4 Eddy Coins', probability: 10, color: 'bg-violet-500 text-white' },
  { label: '5 Eddy Coins', probability: 7, color: 'bg-rose-500 text-white' },
  { label: '10 Eddy Coins', probability: 3, color: 'bg-indigo-500 text-white' },
];

export const RewardsPage = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <Gift size={14} /> Customer Gamification
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Spin Wheel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rewards & Spin Wheel
          </h1>
        </div>
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
          <div className="text-2xl font-black text-indigo-600 font-mono">100 Scans / Day</div>
          <p className="text-[11px] text-slate-400">3-day inactivity resets customer streak</p>
        </div>
      </div>

      {/* ── Spin Wheel Prizes Config ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Spin-the-Wheel Prize Odds</h2>
              <p className="text-xs text-slate-500">Fixed coin rewards per 100 eligible spins.</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Total Probability: 100%
            </div>
          </div>

          <div className="space-y-3">
            {PRIZES.map((prize, idx) => (
              <div
                key={prize.label}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${prize.color}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{prize.label}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">COIN PRIZE</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Win Chance:</span>
                  <span className="min-w-14 text-right font-mono text-sm font-bold text-slate-900">
                    {prize.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
