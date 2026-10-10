export interface Shop {
  id: string;
  name: string;
  category: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  openNow: boolean;
  offer: string;
  couponCode: string;
  couponExpiryHours: number;
  image: string;
  gallery: string[];
  description: string;
  phone: string;
}

export const SHOPS: Shop[] = [
  {
    id: 'sharma-sweets',
    name: 'Sharma Sweets & Snacks',
    category: 'Sweets & Bakery',
    area: 'Hazratganj',
    distanceKm: 1.2,
    rating: 4.8,
    reviewCount: 342,
    openNow: true,
    offer: 'Flat 15% off on all sweets with flyer coupon',
    couponCode: 'SHARMA15',
    couponExpiryHours: 96,
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'A beloved Hazratganj institution serving fresh motichoor ladoo, kaju katli and crispy samosas since 1987. Everything is made in-house every morning.',
    phone: '+91 98390 11224',
  },
  {
    id: 'cafe-aadab',
    name: 'Café Aadab',
    category: 'Café',
    area: 'Gomti Nagar',
    distanceKm: 2.4,
    rating: 4.6,
    reviewCount: 518,
    openNow: true,
    offer: 'Free cold coffee on 100 Eddy Coins',
    couponCode: 'AADAB100',
    couponExpiryHours: 96,
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Cosy riverside café known for its adrak elaichi chai, cold brews and bun-maska. A favourite work-from-café spot with fast Wi-Fi and quiet corners.',
    phone: '+91 90056 77881',
  },
  {
    id: 'lucknowi-threads',
    name: 'Lucknowi Threads',
    category: 'Fashion',
    area: 'Aminabad',
    distanceKm: 3.1,
    rating: 4.5,
    reviewCount: 264,
    openNow: true,
    offer: 'Extra 10% off for Eddy followers',
    couponCode: 'THREADS10',
    couponExpiryHours: 72,
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Authentic chikankari kurtis, sarees and menswear sourced directly from Aminabad artisans. Fair prices, no bargaining needed.',
    phone: '+91 94152 30987',
  },
  {
    id: 'royal-biryani-house',
    name: 'Royal Biryani House',
    category: 'Restaurant',
    area: 'Aliganj',
    distanceKm: 1.8,
    rating: 4.9,
    reviewCount: 731,
    openNow: false,
    offer: '2x coins on weekend spins',
    couponCode: 'BIRYANI20',
    couponExpiryHours: 96,
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Slow-cooked dum biryani, kakori kebabs and shahi tukda in a royal Awadhi setting. Voted Aliganj’s best family dinner spot two years running.',
    phone: '+91 98391 44556',
  },
  {
    id: 'glow-grace-salon',
    name: 'Glow & Grace Salon',
    category: 'Salon & Spa',
    area: 'Indiranagar',
    distanceKm: 4.0,
    rating: 4.4,
    reviewCount: 189,
    openNow: true,
    offer: 'Flat ₹200 off on services above ₹999',
    couponCode: 'GLOW200',
    couponExpiryHours: 48,
    image:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Unisex salon offering haircuts, facials, bridal packages and head massages with herbal products. Prior appointment recommended on weekends.',
    phone: '+91 91258 66773',
  },
  {
    id: 'techgully',
    name: 'TechGully Electronics',
    category: 'Electronics',
    area: 'Hazratganj',
    distanceKm: 2.0,
    rating: 4.3,
    reviewCount: 156,
    openNow: true,
    offer: 'Spin & win up to 50 coins on accessories',
    couponCode: 'TECH50',
    couponExpiryHours: 96,
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Genuine mobiles, audio gear and accessories with GST billing and brand warranty. Free screen-guard application with every purchase.',
    phone: '+91 93361 20845',
  },
];

export const getShopById = (id: string | undefined): Shop | undefined =>
  SHOPS.find((shop) => shop.id === id);
