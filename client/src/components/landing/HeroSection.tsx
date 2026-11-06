import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_EASE = [0.22, 1, 0.36, 1] as const;

const Word = ({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) => (
  <span className="inline-block overflow-hidden pb-1 -mb-1 align-bottom">
    <motion.span
      className={`inline-block will-change-transform ${className ?? ''}`}
      initial={{ y: '105%' }}
      animate={{ y: '0%' }}
      transition={{
        duration: 1.1,
        ease: HERO_EASE,
        delay: 0.35 + index * 0.09,
      }}
    >
      {children}
    </motion.span>
  </span>
);

export const HeroSection = () => {
  return (
    <section
      id="top"
      className="hero-font relative mt-16 w-full text-white overflow-hidden bg-black"
      style={{ height: 'calc(100vh - 4rem)', minHeight: 'calc(100vh - 4rem)' }}
    >
      {/* Full-frame background image — cover fills the whole frame, touching both edges */}
      <motion.div
        role="img"
        aria-label="Marketing Dashboard"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'url(/images/hero-cropped.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: HERO_EASE }}
      />

      {/* Soft bottom fade only — keeps text readable without covering the image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content — anchored lower-left over the image */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 flex h-full flex-col justify-end pb-24 pt-24">
        <div className="max-w-2xl space-y-8">
          {/* Headline — word-by-word reveal */}
          <h1
            className="font-bold text-white"
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4.75rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textShadow: '0 1px 12px rgba(0, 0, 0, 0.55)',
            }}
          >
            <Word index={0}>Marketing</Word>
            <span className="block">
              <Word index={1}><span style={{ color: '#fff275' }}>Made</span></Word>{' '}
              <Word index={2}><span style={{ color: '#fff275' }}>Simple</span></Word>
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: HERO_EASE, delay: 0.75 }}
            className="max-w-xl text-lg leading-relaxed text-white/85"
            style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.6)' }}
          >
            Create stunning flyers, publish across social media, and build customer loyalty—all from one intelligent platform built for small businesses.
          </motion.p>

          {/* CTA Buttons — pill style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: HERO_EASE, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-black font-semibold text-base px-8 transition-all hover:bg-white/90 hover:shadow-2xl hover:shadow-white/10"
            >
              <Link to={ROUTES.SIGN_UP} className="flex items-center gap-2">
                Start Free Today
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/20 bg-white/[0.04] font-semibold text-base px-8 text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <a href="#how-it-works" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                See How It Works
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator — minimal line + label */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Scroll to explore</span>
        <div className="relative h-12 w-px overflow-hidden bg-white/15">
          <motion.div
            className="absolute inset-x-0 top-0 h-full bg-white/70"
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};
