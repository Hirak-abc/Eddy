import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { Zap, ArrowRight, Star, Shield, Globe } from 'lucide-react';

export const CTAFooter = () => {
  return (
    <section id="cta" className="relative px-4 pt-24 sm:px-6 lg:px-8 text-white overflow-hidden" style={{ backgroundColor: '#1D2F2A' }}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: '#1D5412' }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: '#153751' }}
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border"
          style={{ backgroundColor: 'rgba(255, 242, 117, 0.2)', borderColor: '#fff275' }}
        >
          <Zap className="w-4 h-4" style={{ color: '#fff275' }} />
          <span className="text-sm font-medium" style={{ color: '#fff275' }}>Special Offer</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl font-black mb-6 leading-tight"
        >
          Ready to Transform Your
          <span className="block" style={{ color: '#fff275' }}>
            Marketing Today?
          </span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: '#F8E7C9' }}
        >
          Join 5,000+ SMBs creating stunning marketing flyers with AI. Get started free — no credit card required.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button asChild size="lg" className="text-white font-bold text-base transition-all hover:shadow-2xl" style={{ backgroundColor: '#3A0CA3' }}>
            <Link to={ROUTES.SIGN_UP} className="flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-semibold text-base transition-all" style={{ borderColor: '#fff275', color: '#fff275' }}>
            <a href="mailto:info@eddy.com">Contact Sales</a>
          </Button>
        </motion.div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12"
          style={{ borderTopColor: 'rgba(255,255,255,0.3)', borderTopWidth: '1px' }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: '#fff275' }} />
            <span style={{ color: '#F8E7C9' }}>No credit card required</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color: '#fff275' }} />
            <span style={{ color: '#F8E7C9' }}>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" style={{ color: '#fff275' }} />
            <span style={{ color: '#F8E7C9' }}>Cancel anytime</span>
          </div>
        </motion.div>
      </div>

      {/* Footer with Vertical Strips */}
      <footer
        className="relative -mx-4 mt-24 pt-12 sm:-mx-6 lg:-mx-8"
        style={{ backgroundColor: '#F8E7C9' }}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Brand */}
            <div className="border-black/10 px-8 py-12 md:border-r">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#3A0CA3' }}>
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold" style={{ color: '#000000' }}>Eddy</span>
              </div>
              <p className="text-xs" style={{ color: '#000000' }}>AI-powered marketing for local businesses.</p>
            </div>

            {/* Product */}
            <div className="border-black/10 px-8 py-12 md:border-r">
              <h4 className="mb-4 font-bold" style={{ color: '#000000' }}>Product</h4>
              <ul className="space-y-2 text-xs text-black">
                <li><a href="#" className="transition hover:underline">Features</a></li>
                <li><a href="#" className="transition hover:underline">Pricing</a></li>
                <li><a href="#" className="transition hover:underline">Blog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="border-black/10 px-8 py-12 md:border-r">
              <h4 className="mb-4 font-bold" style={{ color: '#000000' }}>Company</h4>
              <ul className="space-y-2 text-xs text-black">
                <li><a href="#" className="transition hover:underline">About</a></li>
                <li><a href="#" className="transition hover:underline">Contact</a></li>
                <li><a href="#" className="transition hover:underline">Support</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="border-black/10 px-8 py-12 md:border-r">
              <h4 className="mb-4 font-bold" style={{ color: '#000000' }}>Resources</h4>
              <ul className="space-y-2 text-xs text-black">
                <li><a href="#" className="transition hover:underline">Documentation</a></li>
                <li><a href="#" className="transition hover:underline">Help Center</a></li>
                <li><a href="#" className="transition hover:underline">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="px-8 py-12">
              <h4 className="mb-4 font-bold" style={{ color: '#000000' }}>Legal</h4>
              <ul className="space-y-2 text-xs text-black">
                <li><Link to="/privacy" className="transition hover:underline">Privacy</Link></li>
                <li><Link to="/terms" className="transition hover:underline">Terms</Link></li>
                <li><a href="#" className="transition hover:underline">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-black/10 py-8 text-center">
            <p className="text-xs text-black">&copy; 2026 Eddy. All rights reserved. Transforming SMB marketing with AI.</p>
          </div>
        </div>
      </footer>
    </section>
  );
};
