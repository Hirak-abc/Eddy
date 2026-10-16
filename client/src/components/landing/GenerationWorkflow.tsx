import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Sparkles, ChevronRight, RefreshCw } from 'lucide-react';

const CYCLE_MS = 5000;

export const GenerationWorkflow = () => {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [paused]);

  const steps = [
    {
      title: 'Write Your Prompt',
      description: 'Describe what you want to promote',
      color: '#3A0CA3',
    },
    {
      title: 'AI Refines with Trends',
      description: 'Our AI analyzes trends and optimizes your message',
      color: '#0057FF',
    },
    {
      title: 'Beautiful Flyer Generated',
      description: 'Professional flyer ready to publish',
      color: '#064E3B',
    },
  ];

  const samplePrompts = [
    'Summer fashion sale is live',
    'New festive collection launch',
    'Weekend ethnic wear offer',
  ];

  const sampleTrends = [
    { tag: 'Summer 2026', bg: 'rgba(255, 242, 117, 0.2)', text: '#fff275', border: 'rgba(255, 242, 117, 0.3)' },
    { tag: 'Fresh & Local', bg: 'rgba(6, 78, 59, 0.2)', text: '#064E3B', border: 'rgba(6, 78, 59, 0.3)' },
    { tag: 'Limited Time', bg: 'rgba(58, 12, 163, 0.2)', text: '#3A0CA3', border: 'rgba(58, 12, 163, 0.3)' },
  ];

  const generatedFlyers = [
    {
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
      alt: 'Fashion sale flyer — model with shopping bags',
    },
    {
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
      alt: 'Festive collection flyer — fashion editorial',
    },
    {
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
      alt: 'Weekend wear flyer — street style model',
    },
  ];

  const fallbackFlyer =
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80';

  const layerClass = (active: boolean) =>
    `absolute inset-0 space-y-4 ${active ? '' : 'pointer-events-none'}`;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#F8E7C9' }}>
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#3A0CA3' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: '#0057FF' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: 'rgba(0, 87, 255, 0.1)', color: '#0057FF' }}>
            How It Works
          </span>
          <h2 className="text-5xl font-black mb-4" style={{ color: '#23262F' }}>
            See It In Action
          </h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#555' }}>
            Watch how Eddy transforms your ideas into stunning marketing flyers in 3 simple steps
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              onClick={() => setStep(idx)}
              className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                step === idx ? 'shadow-xl' : 'bg-white/50'
              }`}
              style={{
                backgroundColor: step === idx ? s.color : 'rgba(255,255,255,0.5)',
                borderColor: step === idx ? s.color : 'transparent',
              }}
            >
              {/* Step number */}
              <div
                className={`absolute -top-4 -left-4 w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm shadow-md ${
                  step === idx ? 'text-white' : 'text-gray-400'
                }`}
                style={{ backgroundColor: step === idx ? 'white' : s.color }}
              >
                {idx + 1}
              </div>

              <div className="text-3xl mb-3">
                {step === idx && (
                  <motion.span
                    key={step}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {idx === 0 ? '📝' : idx === 1 ? '📊' : '✨'}
                  </motion.span>
                )}
                {step !== idx && (idx === 0 ? '📝' : idx === 1 ? '📊' : '✨')}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: step === idx ? 'white' : '#23262F' }}>
                {s.title}
              </h3>
              <p className="text-sm" style={{ color: step === idx ? 'rgba(255,255,255,0.8)' : '#555' }}>
                {s.description}
              </p>

              {/* Connector Arrow */}
              {idx < 2 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight
                    className="w-6 h-6"
                    style={{ color: step > idx ? s.color : '#ddd' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo — fixed-height stage so auto-cycling never moves the page */}
        <Card
          className="border-0 p-8 bg-white/80 backdrop-blur shadow-xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative h-[480px] sm:h-[450px]">
            {/* Step 1: Input */}
            <motion.div
              className={layerClass(step === 0)}
              aria-hidden={step !== 0}
              initial={false}
              animate={{ opacity: step === 0 ? 1 : 0, y: step === 0 ? 0 : 8 }}
              transition={{ duration: 0.35 }}
            >
              <label className="block text-sm font-medium" style={{ color: '#23262F' }}>
                <Sparkles className="inline w-4 h-4 mr-2" style={{ color: '#3A0CA3' }} />
                Describe Your Campaign
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type your marketing idea..."
                  value={samplePrompts[0]}
                  readOnly
                  tabIndex={step === 0 ? 0 : -1}
                  className="text-base pr-10"
                  style={{ borderColor: '#3A0CA3' }}
                />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded"
                  style={{ backgroundColor: '#3A0CA3' }}
                />
              </div>
              <p className="text-xs" style={{ color: '#555' }}>
                ✨ More examples: {samplePrompts.slice(1).join(', ')}
              </p>
            </motion.div>

            {/* Step 2: Trend Refinement */}
            <motion.div
              className={layerClass(step === 1)}
              aria-hidden={step !== 1}
              initial={false}
              animate={{ opacity: step === 1 ? 1 : 0, y: step === 1 ? 0 : 8 }}
              transition={{ duration: 0.35 }}
            >
              <label className="block text-sm font-medium" style={{ color: '#23262F' }}>
                <Sparkles className="inline w-4 h-4 mr-2" style={{ color: '#0057FF' }} />
                AI Enhanced with Trends
              </label>
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(0, 87, 255, 0.05)', borderColor: 'rgba(0, 87, 255, 0.2)' }}>
                <p className="mb-4 font-medium" style={{ color: '#23262F' }}>
                  "{samplePrompts[0]}"
                </p>
                <p className="text-sm mb-4" style={{ color: '#555' }}>
                  Detected trending topics and optimizations:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sampleTrends.map((trend, i) => (
                    <motion.div
                      key={trend.tag}
                      initial={false}
                      animate={step === 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: step === 1 ? i * 0.15 : 0 }}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: trend.bg, color: trend.text, border: `1px solid ${trend.border}` }}
                    >
                      {trend.tag}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Step 3: Generated Flyer */}
            <motion.div
              className={layerClass(step === 2)}
              aria-hidden={step !== 2}
              initial={false}
              animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? 0 : 8 }}
              transition={{ duration: 0.35 }}
            >
              <label className="block text-sm font-medium" style={{ color: '#23262F' }}>
                <Sparkles className="inline w-4 h-4 mr-2" style={{ color: '#064E3B' }} />
                Your Generated Flyer
              </label>
              <div className="flex gap-3 h-[300px] sm:h-[310px]">
                {/* Main generated flyer */}
                <div className="relative flex-1 rounded-lg border-2 overflow-hidden shadow-xl" style={{ borderColor: 'rgba(6, 78, 59, 0.3)' }}>
                  <motion.img
                    key={variant}
                    src={generatedFlyers[variant].src}
                    alt={generatedFlyers[variant].alt}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackFlyer;
                    }}
                  />
                  {/* Readability gradient */}
                  <div
                    className="absolute inset-0"
                    style={{ backgroundImage: 'linear-gradient(to top, rgba(20, 25, 20, 0.88) 0%, rgba(20, 25, 20, 0.25) 55%, rgba(20, 25, 20, 0.15) 100%)' }}
                  />
                  {/* Offer badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide text-white shadow-lg" style={{ backgroundColor: '#3A0CA3' }}>
                    SPECIAL OFFER
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: '#fff275', color: '#23262F' }}>
                    25% OFF
                  </div>
                  {/* Flyer copy */}
                  <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                    <div className="text-base font-bold text-white leading-snug">
                      {samplePrompts[0]}
                    </div>
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {sampleTrends.map((trend) => (
                        <div
                          key={trend.tag}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#23262F' }}
                        >
                          {trend.tag}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1.5 text-sm font-bold" style={{ color: '#fff275' }}>
                      Limited Time Only!
                    </div>
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(6, 78, 59, 0.5)',
                        '0 0 40px rgba(6, 78, 59, 0.8)',
                        '0 0 20px rgba(6, 78, 59, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                  />
                </div>

                {/* Variant thumbnails */}
                <div className="hidden sm:flex w-24 flex-col gap-3">
                  {generatedFlyers.map((flyer, i) => (
                    <button
                      key={flyer.src}
                      type="button"
                      onClick={() => setVariant(i)}
                      tabIndex={step === 2 ? 0 : -1}
                      className={`relative flex-1 rounded-lg overflow-hidden border-2 transition-all ${
                        variant === i ? 'shadow-md scale-[1.03]' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ borderColor: variant === i ? '#064E3B' : 'rgba(0,0,0,0.1)' }}
                      title={`Preview variant ${i + 1}`}
                    >
                      <img
                        src={flyer.src.replace('w=800', 'w=200')}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = fallbackFlyer;
                        }}
                      />
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-px rounded text-[10px] font-bold text-white whitespace-nowrap" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                        {variant === i ? `✓ ${i + 1}` : `${i + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-center" style={{ color: '#555' }}>
                Ready to publish to Instagram, Facebook, and more →
              </p>
            </motion.div>
          </div>
        </Card>

        {/* Progress Bar */}
        <div className="mt-8 flex gap-2 justify-center">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to step ${idx + 1}`}
              onClick={() => setStep(idx)}
              className="h-2 rounded-full transition-all"
              style={{
                backgroundColor: step === idx ? steps[idx].color : 'rgba(0,0,0,0.1)',
                width: step === idx ? 32 : 16,
              }}
            />
          ))}
        </div>

        {/* Reset Button */}
        <motion.button
          className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'rgba(58, 12, 163, 0.1)', color: '#3A0CA3' }}
          onClick={() => setStep(0)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4" />
          Reset Demo
        </motion.button>
      </div>
    </section>
  );
};
