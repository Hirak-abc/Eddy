import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Instagram,
  Facebook,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(3, 'Address or location is required'),
  phone: z.string().min(10, 'Valid 10-digit phone required'),
  email: z.string().email('Valid business email required'),
  autoPublish: z.boolean().default(true),
  defaultDiscount: z.string().default('20'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { updateBusiness, updateBusinessImages } = useOwner();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Photos state
  const [images, setImages] = useState({
    shop: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    product: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    item: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&auto=format&fit=crop&q=80',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema) as never,
    defaultValues: {
      name: 'The Royal Chai & Cafe',
      category: 'Cafe & Bakery',
      location: 'Hazratganj, Lucknow, UP',
      phone: '9876543210',
      email: 'owner@royalchaicafe.com',
      autoPublish: true,
      defaultDiscount: '20',
    },
  });

  const handleFinishOnboarding = (data: OnboardingFormData) => {
    updateBusiness({
      name: data.name,
      category: data.category,
      location: data.location,
      phone: data.phone,
      email: data.email,
      autoPublish: data.autoPublish ?? true,
      verificationStatus: 'VERIFIED',
    });

    updateBusinessImages({
      shop: {
        storageKey: 'shop_front_img',
        url: images.shop,
        uploadedAt: new Date().toISOString(),
      },
      product: {
        storageKey: 'hero_product_img',
        url: images.product,
        uploadedAt: new Date().toISOString(),
      },
      item: {
        storageKey: 'detail_item_img',
        url: images.item,
        uploadedAt: new Date().toISOString(),
      },
    });

    toast.success('Onboarding complete! Your AI Flyer Studio and QR standees are ready.');
    navigate(ROUTES.OWNER_DASHBOARD);
  };

  const handleImageFileChange = (type: 'shop' | 'product' | 'item', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages((prev) => ({ ...prev, [type]: url }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* ── Top Progress Header ────────────────────────────────────────────── */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Sparkles size={14} />
          <span>Quick 2-Minute Business Setup</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Eddy for Business
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Set up your store identity, upload your 3 photos for AI flyers, and configure automatic customer rewards.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-slate-700">Store Identity</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-slate-700">3 Photos</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="text-xs font-semibold text-slate-700">AI Automation</span>
          </div>
        </div>
      </div>

      {/* ── Multi-Step Form Card ───────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Step 1: Tell us about your business</h2>
              <p className="text-xs text-slate-500">This appears on your QR standee and AI-generated social flyers.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business / Store Name
              </label>
              <Input {...register('name')} placeholder="e.g. The Royal Chai & Cafe" />
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business Category
                </label>
                <select
                  {...register('category')}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Cafe & Bakery">Cafe & Bakery</option>
                  <option value="Restaurant & Fast Food">Restaurant & Fast Food</option>
                  <option value="Salon & Spa">Salon & Spa</option>
                  <option value="Retail & Fashion">Retail & Fashion</option>
                  <option value="Fitness & Gym">Fitness & Gym</option>
                  <option value="Grocery & Organic">Grocery & Organic</option>
                </select>
                {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <Input {...register('phone')} placeholder="9876543210" className="font-mono" />
                {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Store Location / Landmark
              </label>
              <Input {...register('location')} placeholder="e.g. Shop 12, Hazratganj, Lucknow" />
              {errors.location && <p className="text-rose-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Owner Email
              </label>
              <Input {...register('email')} placeholder="owner@business.com" />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 text-xs flex items-center gap-2"
              >
                <span>Continue to Photos</span>
                <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: 3 Photos for AI Flyer Engine */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Step 2: Upload 3 Store Photos</h2>
              <p className="text-xs text-slate-500">
                Eddy's AI uses these 3 distinct images to generate festival campaigns and your digital menu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Photo 1: Shop Front */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="text-xs font-bold text-slate-800">1. Shop Front (1:1)</div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <img src={images.shop} alt="Shop Front" className="w-full h-full object-cover" />
                </div>
                <label className="cursor-pointer block w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors">
                  <span>Replace Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileChange('shop', e)}
                  />
                </label>
              </div>

              {/* Photo 2: Hero Product */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="text-xs font-bold text-slate-800">2. Hero Product (4:5)</div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <img src={images.product} alt="Hero Product" className="w-full h-full object-cover" />
                </div>
                <label className="cursor-pointer block w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors">
                  <span>Replace Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileChange('product', e)}
                  />
                </label>
              </div>

              {/* Photo 3: Interior/Detail */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="text-xs font-bold text-slate-800">3. Signature Item (1:1)</div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <img src={images.item} alt="Signature Item" className="w-full h-full object-cover" />
                </div>
                <label className="cursor-pointer block w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors">
                  <span>Replace Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileChange('item', e)}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-slate-200 text-slate-700 font-bold rounded-xl px-5 py-2.5 text-xs flex items-center gap-1.5"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 text-xs flex items-center gap-2"
              >
                <span>Continue to Automation</span>
                <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Automation & Auto-Publish */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit(handleFinishOnboarding as never)} className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Step 3: AI Marketing Automation</h2>
              <p className="text-xs text-slate-500">Configure how Eddy creates and schedules flyers automatically.</p>
            </div>

            {/* Auto-Publish Pill & Explanation */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900">
                      Automatic 48-Hour AI Trend Publishing
                    </span>
                    <p className="text-xs text-slate-600">
                      Eddy scans local Lucknow trends and queues ready flyers with a 48h review window.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  {...register('autoPublish')}
                  className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Default Discount Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default Flyer Coupon Discount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['10', '15', '20'].map((disc) => (
                  <label
                    key={disc}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-slate-800"
                  >
                    <input
                      type="radio"
                      value={disc}
                      {...register('defaultDiscount')}
                      className="accent-indigo-600"
                    />
                    <span>{disc}% OFF Deal</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social channels preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Instagram size={14} className="text-rose-500" />
                <Facebook size={14} className="text-blue-600" />
                <span>Meta Social Channels</span>
              </div>
              <p className="text-xs text-slate-500">
                You can link your official Instagram & Facebook pages anytime in the Social Media tab.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="border-slate-200 text-slate-700 font-bold rounded-xl px-5 py-2.5 text-xs flex items-center gap-1.5"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-7 py-2.5 text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Check size={16} />
                <span>Complete Setup & Launch</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
