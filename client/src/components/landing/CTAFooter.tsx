import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { Zap, ArrowRight, Star, Shield, Globe } from 'lucide-react';

export const CTAFooter = () => {
  return (
    <section id="cta" className="relative py-24 px-4 sm:px-6 lg:px-8 text-white overflow-hidden" style={{ backgroundColor: '#1D2F2A' }}>
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
      <footer className="mt-24 pt-12 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Brand - Dark Teal */}
            <div className="px-8 py-12" style={{ backgroundColor: '#7d1422', borderRightColor: '#1D5412', borderRightWidth: '1px' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1D5412' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: '#fff275' }}>Eddy</span>
              </div>
              <p className="text-xs" style={{ color: '#F8E7C9' }}>AI-powered marketing for local businesses.</p>
            </div>

            {/* Product - Forest Green */}
            <div className="px-8 py-12" style={{ backgroundColor: '#1D5412', borderRightColor: '#153751', borderRightWidth: '1px' }}>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>

            {/* Company - Ocean Blue */}
            <div className="px-8 py-12" style={{ backgroundColor: '#153751', borderRightColor: '#3A0CA3', borderRightWidth: '1px' }}>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            {/* Resources - Purple */}
            <div className="px-8 py-12" style={{ backgroundColor: '#3A0CA3', borderRightColor: '#fff275', borderRightWidth: '1px' }}>
              <h4 className="font-bold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>

            {/* Legal - Gold */}
            <div className="px-8 py-12" style={{ backgroundColor: '#fff275', color: '#23262F' }}>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-xs opacity-80">
                <li><Link to="/privacy" className="hover:opacity-100 transition">Privacy</Link></li>
                <li><a href="#" className="hover:opacity-100 transition">Terms</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center py-8" style={{ backgroundColor: '#1D2F2A', borderTopColor: '#1D5412', borderTopWidth: '1px' }}>
            <p className="text-xs" style={{ color: '#F8E7C9' }}>&copy; 2026 Eddy. All rights reserved. Transforming SMB marketing with AI.</p>
          </div>
        </div>
      </footer>
    </section>
  );
};
