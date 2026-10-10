import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Ticket,
  Clock,
  Send,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Facebook,
  Wand2,
  RefreshCw,
  Zap,
  Tag,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner, type ExtendedFlyer } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const FlyerBuilderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillTrend = searchParams.get('trend');

  const { business, createFlyer, publishFlyerNow } = useOwner();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [objective, setObjective] = useState(
    prefillTrend ? 'FESTIVAL' : 'DISCOUNT'
  );
  const [customTitle, setCustomTitle] = useState(
    prefillTrend ? `${prefillTrend} Celebration Offer` : 'Special Weekend Treat'
  );
  const [selectedImage, setSelectedImage] = useState(
    business.images?.product?.url || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
  );
  const [discountPercent, setDiscountPercent] = useState('20');
  const [couponCode, setCouponCode] = useState('EDDY20');
  const [selectedVariant, setSelectedVariant] = useState<'A' | 'B'>('A');

  // AI Generated Variants State
  const [generatedVariants, setGeneratedVariants] = useState({
    A: {
      id: 'v_a',
      caption: `🎉 Celebrate the festive season with authentic flavors at ${business.name}! Enjoy ${discountPercent}% OFF on all signature chai and artisanal snacks. Limited 96h offer — show this flyer or scan our table QR code!`,
      hashtags: ['#LucknowEats', '#ChaiLovers', '#FestiveDeal', '#ShopLocal', '#EddyRewards'],
      aiScore: '98% Engagement Match',
      imageUrl: selectedImage,
    },
    B: {
      id: 'v_b',
      caption: `✨ Craving something delicious? Drop by ${business.name} and unlock an exclusive ${discountPercent}% discount with code ${couponCode}. Freshly prepared, served hot, and made with love! ☕💛`,
      hashtags: ['#LucknowFoodies', '#WeekendVibes', '#SpecialDiscount', '#LocalCafe', '#EddyCoins'],
      aiScore: '95% Engagement Match',
      imageUrl: selectedImage,
    },
  });

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedVariants({
        A: {
          id: 'v_a',
          caption: `🎉 Celebrate ${prefillTrend || 'the season'} with authentic flavors at ${business.name}! Enjoy ${discountPercent}% OFF on our chef-special snacks. Limited 96h deal — scan our QR or use code ${couponCode}!`,
          hashtags: ['#LucknowEats', '#ChaiLovers', '#FestiveDeal', '#ShopLocal', '#EddyRewards'],
          aiScore: '98% Engagement Match',
          imageUrl: selectedImage,
        },
        B: {
          id: 'v_b',
          caption: `✨ Pure delight in every bite! Visit ${business.name} this week and take home ${discountPercent}% savings on your bill. Tag your chai buddy and visit today! ☕💛`,
          hashtags: ['#LucknowFoodies', '#WeekendVibes', '#SpecialDiscount', '#LocalCafe', '#EddyCoins'],
          aiScore: '96% Engagement Match',
          imageUrl: selectedImage,
        },
      });
      setIsGenerating(false);
      setStep(3);
      toast.success('AI created 2 high-converting flyer variations!');
    }, 1200);
  };

  const handleSaveAndPublish = (instant: boolean) => {
    const activeVar = generatedVariants[selectedVariant];
    const newFlyer: Partial<ExtendedFlyer> = {
      title: customTitle,
      category: objective,
      content: activeVar.caption,
      imageUrl: activeVar.imageUrl,
      couponCode: couponCode,
      status: instant ? 'PUBLISHED' : 'SCHEDULED',
      scheduledFor: instant ? undefined : new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      trendContext: prefillTrend || 'Local Seasonal Special',
      versions: [
        {
          id: 'v_a',
          flyerId: 'temp',
          imageUrl: generatedVariants.A.imageUrl,
          caption: generatedVariants.A.caption,
          hashtags: generatedVariants.A.hashtags,
          status: selectedVariant === 'A' ? 'ACTIVE' : 'DRAFT',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'v_b',
          flyerId: 'temp',
          imageUrl: generatedVariants.B.imageUrl,
          caption: generatedVariants.B.caption,
          hashtags: generatedVariants.B.hashtags,
          status: selectedVariant === 'B' ? 'ACTIVE' : 'DRAFT',
          createdAt: new Date().toISOString(),
        },
      ],
      selectedVersionId: selectedVariant === 'A' ? 'v_a' : 'v_b',
    };

    const created = createFlyer(newFlyer);
    if (instant) {
      publishFlyerNow(created.id);
      toast.success('Flyer published live to Instagram and Facebook!');
      navigate(ROUTES.OWNER_PUBLISHED);
    } else {
      toast.success('Flyer scheduled with a 48h auto-publish window!');
      navigate(ROUTES.OWNER_SCHEDULED);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6 pb-16">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Marketing</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Flyer Builder Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create AI Marketing Campaign
          </h1>
        </div>

        {/* Wizard Step Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                step === i
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : step > i
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > i ? '✓' : i}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1: Objective Selection ────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 1: Choose Campaign Objective</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the goal for this AI flyer to tailor copywriting, hashtags, and discount triggers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: 'FESTIVAL',
                label: 'Festival / Trend Celebration',
                desc: 'Navratri, Diwali, Eid, or local events',
                icon: Sparkles,
                color: 'text-amber-500 bg-amber-50',
              },
              {
                id: 'DISCOUNT',
                label: 'Flash Discount Deal',
                desc: 'Limited-time % or ₹ flat savings voucher',
                icon: Tag,
                color: 'text-emerald-500 bg-emerald-50',
              },
              {
                id: 'WEEKEND',
                label: 'Weekend Special',
                desc: 'Drive footfall for Friday–Sunday rush',
                icon: Clock,
                color: 'text-indigo-500 bg-indigo-50',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = objective === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setObjective(item.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{item.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex justify-end">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Title / Headline
            </label>
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Navratri Special Masala Chai & Samosa Treat"
              className="text-sm font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              onClick={() => setStep(2)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <span>Continue to Photos & Offer</span>
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Photo & Offer Selection ───────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 2: Select Photo & Promotion Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick from your store's verified photos and define the customer coupon attached to this flyer.
            </p>
          </div>

          {/* Photo Selection Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choose Product Image
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Hero Product', url: business.images?.product?.url },
                { label: 'Shop Facade', url: business.images?.shop?.url },
                { label: 'Signature Item', url: business.images?.item?.url },
              ].map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => img.url && setSelectedImage(img.url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage === img.url
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-1.5 text-center text-[10px] font-bold text-white">
                    {img.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon / Promotion Setting */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-amber-600" />
              <span className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                Attached 96h Customer Deal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount Amount</label>
                <div className="flex items-center gap-2">
                  {['15', '20', '25', '30'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setDiscountPercent(val);
                        setCouponCode(`FESTIVE${val}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        discountPercent === val
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {val}% OFF
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Coupon Promo Code</label>
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="font-mono text-sm font-bold bg-white"
                  placeholder="e.g. NAVRATRI20"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              <ArrowLeft size={14} className="mr-1.5" /> Back
            </Button>
            <Button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Generating AI Variants...</span>
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  <span>Generate with AI Engine</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: AI Variant Comparison (A vs B) ────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  xAI Marketing Engine
                </span>
                <span className="text-xs text-slate-400 font-medium">2 Variants Generated</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Select Your Preferred Variant
              </h2>
            </div>

            <Button
              variant="outline"
              onClick={handleGenerateAI}
              className="text-xs font-bold border-slate-200 text-slate-700 rounded-xl self-start sm:self-auto"
            >
              <RefreshCw size={13} className="mr-1.5" /> Regenerate AI Copy
            </Button>
          </div>

          {/* Side by Side Variant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant A */}
            <div
              onClick={() => setSelectedVariant('A')}
              className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 bg-white ${
                selectedVariant === 'A'
                  ? 'border-indigo-600 ring-4 ring-indigo-500/10 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <span className="font-bold text-sm text-slate-900">Variant A (Festival Focus)</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {generatedVariants.A.aiScore}
                </span>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={generatedVariants.A.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-indigo-900/90 backdrop-blur text-white text-xs font-bold flex items-center justify-between">
                  <span>Code: {couponCode}</span>
                  <span className="text-amber-300">{discountPercent}% OFF</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl">
                {generatedVariants.A.caption}
              </p>

              <div className="flex flex-wrap gap-1">
                {generatedVariants.A.hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-indigo-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Variant B */}
            <div
              onClick={() => setSelectedVariant('B')}
              className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 bg-white ${
                selectedVariant === 'B'
                  ? 'border-indigo-600 ring-4 ring-indigo-500/10 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    B
                  </div>
                  <span className="font-bold text-sm text-slate-900">Variant B (Appetite & Savings)</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {generatedVariants.B.aiScore}
                </span>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={generatedVariants.B.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-indigo-900/90 backdrop-blur text-white text-xs font-bold flex items-center justify-between">
                  <span>Code: {couponCode}</span>
                  <span className="text-amber-300">{discountPercent}% OFF</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl">
                {generatedVariants.B.caption}
              </p>

              <div className="flex flex-wrap gap-1">
                {generatedVariants.B.hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-indigo-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              <ArrowLeft size={14} className="mr-1.5" /> Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <span>Confirm Variant {selectedVariant} & Schedule</span>
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Publish & Schedule Window ─────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 4: Publishing & Schedule Options</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose between automatic 48-hour scheduled publishing or instant live deployment to Instagram and Facebook.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 48h Auto-Publish Option */}
            <div className="p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} /> Recommended
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">48-Hour Review Window</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Flyer enters the scheduled queue. You can adjust or cancel anytime before it auto-publishes to Meta channels.
                </p>
              </div>
              <Button
                onClick={() => handleSaveAndPublish(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <Calendar size={14} />
                <span>Schedule with 48h Window</span>
              </Button>
            </div>

            {/* Instant Publish Option */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Immediate
                </span>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Publish Instantly</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Pushes live right now to connected Instagram profile and Facebook page feed with active coupon codes.
                </p>
              </div>
              <Button
                onClick={() => handleSaveAndPublish(true)}
                variant="outline"
                className="w-full border-slate-300 text-slate-800 hover:bg-slate-50 font-bold rounded-xl text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Publish Live Now</span>
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Share2 size={15} className="text-slate-400" />
              <span>Target Channels: Instagram Feed + Facebook Business Page</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram size={14} className="text-rose-500" />
              <Facebook size={14} className="text-blue-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
