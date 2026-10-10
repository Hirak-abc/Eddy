import { Link } from 'react-router-dom';
import { Flame, Trophy, Check, Lock, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const STREAK = {
  current: 5,
  longest: 12,
  bonusEarned: 20,
  nextMilestone: 10,
};

// Mon..Sun — last 7 days, 5 active
const WEEK = [
  { day: 'M', active: true },
  { day: 'T', active: true },
  { day: 'W', active: true },
  { day: 'T', active: true },
  { day: 'F', active: true },
  { day: 'S', active: false },
  { day: 'S', active: false },
];

const MILESTONES = [
  { days: 10, bonus: 10 },
  { days: 20, bonus: 10 },
  { days: 30, bonus: 10 },
];

export const StreakPage = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Flame size={20} />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Streak</h1>
        <p className="text-sm text-slate-500">Scan daily — every 10 days earns +10 coins</p>
      </div>
    </div>

    {/* Hero */}
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-center text-white shadow-2xl">
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-orange-500/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
          <Flame size={32} className="text-white" />
        </div>
        <div>
          <div className="text-7xl font-black tabular-nums leading-none tracking-tighter">{STREAK.current}</div>
          <div className="mt-1 text-lg font-extrabold text-amber-300">day streak</div>
        </div>

        {/* Week dots */}
        <div className="flex items-center justify-center gap-2.5">
          {WEEK.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-xs font-black',
                  d.active ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow' : 'bg-white/10 text-slate-500'
                )}
              >
                {d.active ? <Check size={15} /> : d.day}
              </span>
              <span className="text-[10px] font-bold text-slate-500">{d.day}</span>
            </div>
          ))}
        </div>

        {/* Progress to milestone */}
        <div className="mx-auto max-w-xs">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>{STREAK.nextMilestone - STREAK.current} days to +10 coins</span>
            <span>{STREAK.current}/{STREAK.nextMilestone}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
              style={{ width: `${(STREAK.current / STREAK.nextMilestone) * 100}%` }}
            />
          </div>
        </div>

        <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-slate-300">
          Longest {STREAK.longest} days · {STREAK.bonusEarned} bonus coins earned
        </p>
      </div>
    </div>

    {/* Milestones */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {MILESTONES.map((m) => {
        const reached = STREAK.current >= m.days;
        return (
          <Card
            key={m.days}
            className={cn(reached ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-white' : 'opacity-80')}
          >
            <CardContent className="space-y-2 p-6 text-center">
              <div
                className={cn(
                  'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg',
                  reached ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200' : 'bg-slate-200 text-slate-400 shadow-none'
                )}
              >
                {reached ? <Trophy size={26} /> : <Lock size={22} />}
              </div>
              <div className={cn('text-4xl font-black tabular-nums', reached ? 'text-amber-600' : 'text-slate-400')}>
                {m.days}
              </div>
              <div className="text-sm font-extrabold text-slate-900">Day Milestone</div>
              <div className="text-xs font-bold text-amber-600">+{m.bonus} coins bonus</div>
              <span
                className={cn(
                  'inline-block rounded-full px-3 py-1 text-xs font-extrabold',
                  reached ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                )}
              >
                {reached ? 'Reached' : `${m.days - STREAK.current} days left`}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>

    <Link
      to="/customer/scan"
      className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 font-extrabold text-white shadow-lg transition-transform hover:scale-[1.01]"
    >
      <QrCode size={18} /> Scan today to extend streak
    </Link>
  </div>
);
