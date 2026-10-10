import { Sparkles, TrendingUp, Share2, Gift, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Sparkles,
    title: 'AI Flyer Generation',
    description: 'Create professional, eye-catching flyers in seconds with our advanced AI. No design skills needed.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=500&fit=crop&auto=format&q=80',
    accentColor: '#3A0CA3',
    iconBg: '#3A0CA3',
  },
  {
    icon: TrendingUp,
    title: 'Trend-Based Content',
    description: 'Our AI analyzes current market trends to ensure your flyers stay relevant and resonate with customers.',
    image: 'https://plus.unsplash.com/premium_photo-1684979565684-e350fc89a29d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHJlbmRzfGVufDB8fDB8fHww',
    accentColor: '#0057FF',
    iconBg: '#0057FF',
  },
  {
    icon: Share2,
    title: 'Multi-Channel Publishing',
    description: 'Publish directly to Instagram, Facebook, and more. Manage all campaigns from one dashboard.',
    image: 'https://images.unsplash.com/photo-1724862936518-ae7fcfc052c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D',
    accentColor: '#064E3B',
    iconBg: '#064E3B',
  },
  {
    icon: Gift,
    title: 'Loyalty & Rewards',
    description: 'Build customer loyalty with digital spin wheels, QR codes, coupon systems, and reward wallets.',
    image: 'https://plus.unsplash.com/premium_photo-1764702246278-ba590b84b739?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    accentColor: '#fff275',
    iconBg: '#fff275',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#F8F7F4' }}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-32" style={{ backgroundImage: 'linear-gradient(to bottom, #F8E7C9, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ backgroundColor: '#3A0CA3' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: 'rgba(58, 12, 163, 0.1)', color: '#3A0CA3' }}>
            Features
          </span>
          <h2 className="text-5xl font-black mb-4" style={{ color: '#23262F' }}>
            Everything You Need to Succeed
          </h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#555' }}>
            Eddy combines AI-powered design, marketing automation, and customer engagement tools into one intelligent platform.
          </p>
        </motion.div>

        {/* Features Grid with Varied Layouts */}
        <div className="space-y-16">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:grid-cols-2' : ''}`}
            >
              {/* Image Side */}
              <div className={`relative ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <motion.img
                  src={feature.image}
                  alt={feature.title}
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                  whileHover={{ scale: 1.03, rotate: idx % 2 === 0 ? 1 : -1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-${1500000000000 + idx * 100000}?w=400&h=500&fit=crop&auto=format&q=80`;
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl shadow-xl opacity-30"
                  style={{ backgroundColor: feature.accentColor }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring' }}
                />
              </div>

              {/* Text Side */}
              <div className={`space-y-6 ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: feature.iconBg }}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold" style={{ color: '#23262F' }}>{feature.title}</h3>
                <p className="text-lg leading-relaxed" style={{ color: '#555' }}>{feature.description}</p>
                <ul className="space-y-3">
                  {['Smart AI design suggestions', 'Customizable templates', 'One-click publish'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 flex-shrink-0" style={{ color: feature.accentColor }} />
                      <span style={{ color: '#555' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
