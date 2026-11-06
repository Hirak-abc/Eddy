import { motion } from 'framer-motion';

const features = [
  {
    title: 'AI Flyer Generation',
    label: 'AI Design',
    description: 'Create professional, eye-catching flyers in seconds with our advanced AI. No design skills needed.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Trend-Based Content',
    label: 'Trend Insights',
    description: 'Our AI analyzes current market trends to ensure your flyers stay relevant and resonate with customers.',
    image: 'https://plus.unsplash.com/premium_photo-1684979565684-e350fc89a29d?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Multi-Channel Publishing',
    label: 'Social Publishing',
    description: 'Publish directly to Instagram, Facebook, and more. Manage all campaigns from one dashboard.',
    image: 'https://images.unsplash.com/photo-1724862936518-ae7fcfc052c1?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Loyalty & Rewards',
    label: 'Customer Loyalty',
    description: 'Build customer loyalty with digital spin wheels, QR codes, coupon systems, and reward wallets.',
    image: 'https://plus.unsplash.com/premium_photo-1764702246278-ba590b84b739?q=80&w=800&auto=format&fit=crop',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="hero-font relative overflow-hidden bg-white text-black px-6 sm:px-10 lg:px-16 py-24">
      <div className="w-full">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50 mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.02em] mb-4 text-black">Everything You Need to Succeed</h2>
          <p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed">
            Eddy combines design, marketing automation, and customer engagement tools into one intelligent platform.
          </p>
        </motion.div>

        {/* Numbered feature rows */}
        <div>
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start border-t border-black/10 py-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
            >
              {/* Number — stays with the text */}
              <div className={`lg:col-span-2 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <span
                  className="block font-medium text-black leading-none tracking-[-0.03em]"
                  style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Image — alternates left/right per row */}
              <div className={`lg:col-span-5 overflow-hidden rounded-md ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-3'}`}>
                <motion.img
                  src={feature.image}
                  alt={feature.title}
                  className="aspect-[4/3] w-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-${1500000000000 + idx * 100000}?w=800&h=600&fit=crop&auto=format&q=80`;
                  }}
                />
              </div>

              {/* Text */}
              <div className={`lg:col-span-5 lg:pt-2 ${idx % 2 === 1 ? 'lg:order-3' : 'lg:order-2'}`}>
                <h3 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] mb-8 text-black">{feature.title}</h3>
                <p className="text-sm font-semibold text-black mb-2">{feature.label}</p>
                <p className="text-base leading-relaxed text-black/60">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
