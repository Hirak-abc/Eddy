import { motion } from 'framer-motion';

const sampleFlyers = [
  {
    id: 1,
    title: 'Summer Sale',
    image: 'https://images.unsplash.com/photo-1767049603596-79204ada5273?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspect: 'portrait',
    rotation: -2,
    delay: 0,
    accentColor: '#3A0CA3',
  },
  {
    id: 2,
    title: 'Fresh Produce',
    image: 'https://images.unsplash.com/photo-1789918414703-66a803fce2ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
    aspect: 'landscape',
    rotation: 3,
    delay: 0.1,
    accentColor: '#0057FF',
  },
  {
    id: 3,
    title: 'Coffee Promo',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZmZlZSUyMHNob3B8ZW58MHx8MHx8fDA%3D',
    aspect: 'portrait',
    rotation: -3,
    delay: 0.2,
    accentColor: '#064E3B',
  },
  {
    id: 4,
    title: 'Fitness Class',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop&auto=format&q=80',
    aspect: 'landscape',
    rotation: 2,
    delay: 0.3,
    accentColor: '#fff275',
  },
  {
    id: 5,
    title: 'Tech Gadgets',
    image: 'https://images.unsplash.com/photo-1523206489230-c012066a6fb9?w=300&h=450&fit=crop&auto=format&q=80',
    aspect: 'portrait',
    rotation: -1,
    delay: 0.4,
    accentColor: '#3A0CA3',
  },
  {
    id: 6,
    title: 'Beauty Products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop&auto=format&q=80',
    aspect: 'landscape',
    rotation: 1,
    delay: 0.5,
    accentColor: '#064E3B',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FlyerGallery = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#23262F' }}>
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#3A0CA3' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#0057FF' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: 'rgba(0, 87, 255, 0.15)', color: '#0057FF' }}>
            Gallery
          </span>
          <h2 className="text-5xl font-black mb-4" style={{ color: '#fff275' }}>
            Stunning Flyers, Every Time
          </h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#F8E7C9' }}>
            See examples of beautiful, professional flyers created by Eddy. Your business deserves to stand out.
          </p>
        </motion.div>

        {/* Masonry-style Gallery */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sampleFlyers.map((flyer, idx) => (
            <motion.div
              key={flyer.id}
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className={`${flyer.aspect === 'landscape' ? 'lg:col-span-1' : ''} ${idx === 1 || idx === 3 || idx === 5 ? 'md:row-span-2' : ''}`}
            >
              <div className="relative h-full group cursor-pointer">
                {/* Flyer Card */}
                <motion.div
                  className="relative h-96 md:h-full rounded-2xl shadow-2xl overflow-hidden border"
                  style={{ rotate: flyer.rotation, borderColor: flyer.accentColor, borderWidth: '1px', backgroundColor: 'white' }}
                  whileHover={{ rotate: 0, transition: { duration: 0.3 } }}
                >
                  <img
                    src={flyer.image}
                    alt={flyer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-${1500000000000 + idx * 100000}?w=400&h=500&fit=crop&auto=format&q=80`;
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-end p-6" style={{ backgroundImage: 'linear-gradient(to top, rgba(35, 38, 47, 0.9), transparent)' }}>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-white">{flyer.title}</h3>
                      <p className="text-sm" style={{ color: '#fff275' }}>Click to customize</p>
                    </div>
                  </div>

                  {/* Shadow Effect */}
                  <motion.div
                    className="absolute -z-10 inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ rotate: flyer.rotation, backgroundColor: flyer.accentColor }}
                  />
                </motion.div>

                {/* Decorative Badge */}
                <div className="absolute -top-3 -right-3 px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg" style={{ backgroundColor: flyer.accentColor }}>
                  Featured
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16 pt-12"
          style={{ borderTopColor: '#3A0CA3', borderTopWidth: '1px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-6 text-lg" style={{ color: '#F8E7C9' }}>
            Ready to create flyers that convert?
          </p>
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-lg hover:shadow-2xl transition-all"
            style={{ backgroundColor: '#3A0CA3' }}
          >
            Start Creating Free
            <span>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
