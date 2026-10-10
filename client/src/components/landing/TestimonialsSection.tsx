import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Coffee Shop Owner',
    company: 'Brew Haven Cafe',
    quote: 'Eddy helped us increase foot traffic by 40% in just three months. The AI-generated flyers are stunning and always on-trend.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Raj Patel',
    role: 'Grocery Store Manager',
    company: 'Fresh Market India',
    quote: 'We used to spend hours on design. Now it takes minutes. The rewards system keeps customers coming back every week.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80',
    rating: 5,
  },
  {
    id: 3,
    name: 'Maria Garcia',
    role: 'Fitness Studio Director',
    company: 'FitLife Studios',
    quote: 'The trend-based content suggestions are incredible. Our promotions feel current and relevant to our audience every time.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80',
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#3A0CA3' }} />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#F59E0B' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#EDE9FE', color: '#3A0CA3' }}>
            Testimonials
          </span>
          <h2 className="text-5xl font-black mb-4" style={{ color: '#0F172A' }}>
            Loved by Business Owners
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: '#64748B' }}>
            Join thousands of SMBs transforming their marketing with Eddy
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-8 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 mb-4 text-slate-200" />

                  {/* Quote */}
                  <blockquote className="mb-8 flex-1 text-lg leading-relaxed font-medium text-slate-700">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Divider */}
                  <div className="pt-6 border-t border-slate-100" />

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format&q=80'; }}
                    />
                    <div>
                      <p className="font-bold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                      <p className="text-xs font-semibold text-[#3A0CA3]">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-5xl font-black mb-2 text-slate-900">5,000+</div>
            <p className="font-semibold text-slate-900">Active Businesses</p>
            <p className="text-sm text-slate-500">Growing every week</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black mb-2 text-slate-900">2M+</div>
            <p className="font-semibold text-slate-900">Flyers Generated</p>
            <p className="text-sm text-slate-500">And counting</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black mb-2 text-slate-900">40%</div>
            <p className="font-semibold text-slate-900">Avg. Traffic Increase</p>
            <p className="text-sm text-slate-500">Proven results</p>
          </div>
        </motion.div>

        {/* Trust Message */}
        <motion.div className="mt-12 flex items-center justify-center gap-2 text-slate-500" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <p>4.9/5 average rating from 500+ verified reviews</p>
        </motion.div>
      </div>
    </section>
  );
};
