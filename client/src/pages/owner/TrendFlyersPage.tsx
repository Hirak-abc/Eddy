import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Flame,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  MapPin,
  Clock,
  MessageCircle,
  Trophy,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface TrendItem {
  id: string;
  name: string;
  category: 'FESTIVAL' | 'SEASONAL' | 'WEEKEND' | 'VIRAL';
  badgeColor: string;
  heat: string;
  heatIcon: LucideIcon;
  location: string;
  description: string;
  suggestedOffer: string;
  suggestedHashtags: string[];
  image: string;
}

const LOCAL_TRENDS: TrendItem[] = [
  {
    id: 't_navratri',
    name: 'Navratri Fasting & Festive Celebrations',
    category: 'FESTIVAL',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    heat: '14.2k searches in Lucknow',
    heatIcon: Flame,
    location: 'Hazratganj & Gomti Nagar',
    description: 'High search surge for special vegetarian delights, festive discounts, and family treat packages.',
    suggestedOffer: '20% OFF Festive Chai & Snack Combos',
    suggestedHashtags: ['#Navratri2025', '#LucknowFoodies', '#FestiveTreats', '#PureVegSpecial'],
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 't_monsoon',
    name: 'Monsoon Chai & Crispy Bites Craving',
    category: 'SEASONAL',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    heat: '8.9k social mentions',
    heatIcon: MessageCircle,
    location: 'Lucknow Metro Area',
    description: 'Cloudy weather driving local demand for hot artisanal tea, samosas, and warm bakery items.',
    suggestedOffer: 'Buy 2 Kulhad Chais, Get 1 Free Bun Maska',
    suggestedHashtags: ['#LucknowMonsoon', '#ChaiSuttaVibes', '#MonsoonSpecial', '#HazratganjCafe'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 't_weekend_brunch',
    name: 'Weekend Student & Family Hangout Rush',
    category: 'WEEKEND',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    heat: '+45% footfall predicted',
    heatIcon: TrendingUp,
    location: 'Local University / College Zone',
    description: 'Peak hangout hours between 4 PM to 9 PM this Friday through Sunday.',
    suggestedOffer: 'Flat ₹50 OFF on orders above ₹250',
    suggestedHashtags: ['#LucknowWeekend', '#CafeHangout', '#StudentDiscounts', '#ChillVibes'],
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 't_cricket_fever',
    name: 'IPL / Cricket Match Screening Buzz',
    category: 'VIRAL',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    heat: 'Trending #1 in UP',
    heatIcon: Trophy,
    location: 'Ekana Stadium & City Lounges',
    description: 'Massive local excitement for evening matches. Ideal for match-time combo offers.',
    suggestedOffer: '15% OFF Match-Day Party Platter',
    suggestedHashtags: ['#CricketFever', '#MatchSnacks', '#LucknowSuperGiants', '#GameTime'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  },
];

export const TrendFlyersPage = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <Flame size={14} /> AI Trend Radar
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Local Lucknow Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trending Marketing Opportunities
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <Clock size={13} className="text-indigo-600" />
          <span>Updated 15 mins ago by xAI Engine</span>
        </div>
      </div>

      {/* ── Trend Cards Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LOCAL_TRENDS.map((trend) => (
          <div
            key={trend.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Visual with Badges */}
              <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                <img src={trend.image} alt={trend.name} className="w-full h-full object-cover" />

                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${trend.badgeColor}`}
                  >
                    {trend.category}
                  </span>
                </div>

                {/* Heat Metric */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <trend.heatIcon size={13} />
                  {trend.heat}
                </div>

                {/* Location Pin */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                  <MapPin size={11} className="text-indigo-400" />
                  <span>{trend.location}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">{trend.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{trend.description}</p>

                {/* Recommended Deal Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                    <Tag size={11} className="text-amber-600" /> AI Suggested Offer
                  </div>
                  <div className="text-xs font-bold text-slate-900">{trend.suggestedOffer}</div>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {trend.suggestedHashtags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-indigo-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="p-5 pt-0 border-t border-slate-50 mt-2">
              <Button
                asChild
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs py-2.5 flex items-center justify-center gap-2 shadow-xs"
              >
                <Link to={`${ROUTES.OWNER_CREATE_FLYER}?trend=${encodeURIComponent(trend.name)}`}>
                  <Sparkles size={14} />
                  <span>Launch AI Campaign with this Trend</span>
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
