import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BellRing, Rocket, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  icon: LucideIcon;
  accentFrom?: string;
  accentTo?: string;
  glowColor?: string;
  features?: string[];
  backTo?: string;
  backLabel?: string;
  secondaryTo?: string;
  secondaryLabel?: string;
}

const FLOATERS = [
  { left: '8%', top: '18%', size: 10, delay: 0, duration: 6 },
  { left: '18%', top: '72%', size: 8, delay: 1.2, duration: 7 },
  { left: '82%', top: '24%', size: 12, delay: 0.6, duration: 6.5 },
  { left: '90%', top: '66%', size: 8, delay: 1.8, duration: 7.5 },
  { left: '50%', top: '10%', size: 7, delay: 0.3, duration: 5.5 },
  { left: '68%', top: '82%', size: 9, delay: 2.1, duration: 8 },
];

export const ComingSoon = ({
  eyebrow,
  title,
  highlight,
  description,
  icon: Icon,
  accentFrom = 'from-indigo-600',
  accentTo = 'to-violet-500',
  glowColor = 'bg-indigo-500/20',
  features = [],
  backTo = '/owner/dashboard',
  backLabel = 'Back to Dashboard',
  secondaryTo = '/owner/flyers',
  secondaryLabel = 'Explore Flyer Studio',
}: ComingSoonProps) => {
  return (
    <div className="relative min-h-[78vh] overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 px-6 py-16 text-center shadow-sm sm:px-12">
      {/* ── Animated backdrop ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)',
          }}
        />
        {/* Aurora blobs */}
        <motion.div
          className={`absolute -left-24 -top-24 h-96 w-96 rounded-full blur-3xl ${glowColor}`}
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-28 -right-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Orbit rings */}
        <div className="absolute left-1/2 top-24 -translate-x-1/2">
          <motion.div
            className="h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 shadow-lg shadow-fuchsia-500/50" />
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 sm:h-56 sm:w-56"
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-6 rounded-full bg-sky-300 shadow-lg shadow-sky-400/50" />
          </motion.div>
        </div>
        {/* Floating particles */}
        {FLOATERS.map((f, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-300 to-fuchsia-300"
            style={{ left: f.left, top: f.top, width: f.size, height: f.size }}
            animate={{ y: [0, -22, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200 backdrop-blur">
            <Sparkles size={13} className="text-amber-300" />
            {eyebrow}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          </span>
        </motion.div>

        {/* Icon orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className={`relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${accentFrom} ${accentTo} text-white shadow-2xl shadow-indigo-500/40`}
          >
            <Icon size={34} strokeWidth={2.2} />
            <motion.span
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-amber-300 shadow-lg ring-1 ring-white/20"
              animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Rocket size={16} />
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-7 text-4xl font-black tracking-tight text-white sm:text-6xl"
        >
          {title}{' '}
          <span className={`bg-gradient-to-r ${accentFrom} via-fuchsia-400 ${accentTo} bg-clip-text text-transparent`}>
            {highlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
        >
          {description}
        </motion.p>

        {/* Shimmer progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-8 max-w-md"
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <BellRing size={12} className="text-amber-300" /> In the works
            </span>
            <span className="font-mono text-indigo-300">Launching soon</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
            <motion.div
              className={`h-full w-1/3 rounded-full bg-gradient-to-r ${accentFrom} ${accentTo}`}
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Feature teasers */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {features.map((feature, idx) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur transition-colors hover:border-indigo-400/40 hover:text-white"
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            <ArrowLeft size={14} />
            {backLabel}
          </Link>
          <Link
            to={secondaryTo}
            className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${accentFrom} ${accentTo} px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90`}
          >
            <Sparkles size={14} />
            {secondaryLabel}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
