import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { ChevronRight, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section id="top" className="relative min-h-screen text-white overflow-hidden flex items-center pt-16" style={{ backgroundColor: '#23262F' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(58, 12, 163, 0.3)' }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(0, 87, 255, 0.2)' }}
          animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(255, 242, 117, 0.15)' }}
          animate={{ x: [-50, 50, -50], y: [50, -30, 50] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #fff275 1px, transparent 1px), linear-gradient(to bottom, #fff275 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? '#3A0CA3' : '#0057FF',
            left: `${20 + i * 12}%`,
            top: `${60 + i * 5}%`
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -100, -200, -300] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit border"
            style={{ backgroundColor: 'rgba(58, 12, 163, 0.3)', borderColor: '#3A0CA3' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#fff275' }} />
            <span className="text-sm font-medium" style={{ color: '#fff275' }}>AI-Powered Marketing Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
              Marketing
              <span className="block" style={{ color: '#fff275' }}>Made Simple</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg leading-relaxed max-w-xl"
            style={{ color: '#F8E7C9' }}
          >
            Create stunning AI-powered flyers, publish across social media, and build customer loyalty—all from one intelligent platform built for small businesses.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button
              asChild
              size="lg"
              className="text-white font-semibold text-base transition-all hover:shadow-2xl hover:shadow-purple-500/30"
              style={{ backgroundColor: '#3A0CA3' }}
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
              className="font-semibold text-base transition-all hover:bg-white/10"
              style={{ borderColor: '#0057FF', color: '#0057FF' }}
            >
              <a href="#how-it-works" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                See How It Works
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="grid grid-cols-3 gap-6 pt-8"
            style={{ borderTopColor: '#3A0CA3', borderTopWidth: '1px' }}
          >
            <div>
              <div className="text-3xl font-bold" style={{ color: '#fff275' }}>5K+</div>
              <p className="text-sm" style={{ color: '#F8E7C9' }}>Active Businesses</p>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#0057FF' }}>2M+</div>
              <p className="text-sm" style={{ color: '#F8E7C9' }}>Flyers Created</p>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#064E3B' }}>40%</div>
              <p className="text-sm" style={{ color: '#F8E7C9' }}>Traffic Increase</p>
            </div>
          </motion.div>
        </div>

        {/* Right Image - Floating Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-2"
          style={{ borderColor: '#3A0CA3' }}
        >
          <img
            src="https://media.istockphoto.com/id/505650897/photo/beautiful-young-woman-holding-blue-scarf-on-the-wind.jpg?s=612x612&w=0&k=20&c=s2_llYX1VE_oxDf144pIy-ZHSIvQEsZd2xDNGUevHA8="
            alt="Marketing Dashboard"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=700&fit=crop&auto=format&q=80';
            }}
          />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, #23262F, transparent 60%)' }} />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#3A0CA3', color: '#fff275' }}>
            ✨ AI Powered
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
          style={{ color: '#fff275' }}
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
};
