import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Upload,
  CheckCircle2,
  MapPin,
  Clock,
  ExternalLink,
  Save,
  Eye,
  QrCode,
  Star,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const businessProfileSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  location: z.string().min(3, 'Physical address or location is required'),
  phone: z.string().min(10, 'Valid 10-digit phone required'),
  email: z.string().email('Valid email required'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export const BusinessProfilePage = () => {
  const { business, updateBusiness, updateBusinessImages } = useOwner();
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'hours'>('details');

  const [images, setImages] = useState({
    shop: business.images?.shop?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    product: business.images?.product?.url || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    item: business.images?.item?.url || 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&auto=format&fit=crop&q=80',
  });

  const [hours, setHours] = useState({ openTime: '10:00 AM', closeTime: '11:00 PM', workingDays: 'Monday - Sunday' });
  const [previewMenu, setPreviewMenu] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: business.name,
      category: business.category,
      location: business.location,
      phone: business.phone || '9876543210',
      email: business.email || 'owner@royalchaicafe.com',
      description: business.description || 'Authentic Masala Chai, artisanal samosas and premium bakery treats crafted with fresh local ingredients.',
    },
  });

  const handleSaveDetails = (data: BusinessProfileFormData) => {
    updateBusiness(data);
    toast.success('Business profile updated successfully.');
  };

  const handleSaveImages = () => {
    updateBusinessImages({
      shop: { storageKey: 'shop_front_img', url: images.shop, uploadedAt: new Date().toISOString() },
      product: { storageKey: 'hero_product_img', url: images.product, uploadedAt: new Date().toISOString() },
      item: { storageKey: 'detail_item_img', url: images.item, uploadedAt: new Date().toISOString() },
    });
    toast.success('Business images updated for AI flyers and customer QR shop.');
  };

  const handleImageFileChange = (type: 'shop' | 'product' | 'item', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages((prev) => ({ ...prev, [type]: url }));
      toast.info(`Previewing new ${type === 'shop' ? 'Shop Front' : type === 'product' ? 'Hero Product' : 'Signature Item'} photo. Save to apply.`);
    }
  };

  const handleResetImages = () => {
    setImages({
      shop: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      product: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      item: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&auto=format&fit=crop&q=80',
    });
    toast.info('Photo suite reset to starter images. Save to apply.');
  };

  const handleCopyStoreLink = async () => {
    const link = `${window.location.origin}/shop/${business.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Customer store link copied. Share it on WhatsApp or print standees.');
    } catch {
      toast.error('Clipboard unavailable in this browser.');
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Settings and Presence</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Store Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Business Profile and Storefront
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Store details feed AI flyers, coupons, and the customer scan screen shown on the right.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyStoreLink}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
          >
            <Eye size={15} />
            <span>Copy Customer Link</span>
            <Copy size={13} className="text-slate-400" />
          </button>
          <Link
            to="/owner/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to Dashboard <ExternalLink size={13} className="text-slate-400" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
            {(['details', 'images', 'hours'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'details' ? 'Store Details' : tab === 'images' ? 'Photos (3 Required)' : 'Timings and Hours'}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit(handleSaveDetails)} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Business Name</label>
                  <Input {...register('name')} placeholder="e.g. The Royal Chai and Cafe" className="text-sm font-medium" />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Category</label>
                    <select {...register('category')} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="Cafe & Bakery">Cafe and Bakery</option>
                      <option value="Restaurant & Fast Food">Restaurant and Fast Food</option>
                      <option value="Salon & Spa">Salon and Spa</option>
                      <option value="Retail & Fashion">Retail and Fashion</option>
                      <option value="Fitness & Gym">Fitness and Gym</option>
                      <option value="Grocery & Organic">Grocery and Organic</option>
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                    <Input {...register('phone')} placeholder="e.g. 9876543210" className="font-mono text-sm font-medium" />
                    {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Store Location / Address</label>
                  <Input {...register('location')} placeholder="e.g. Shop 14, Hazratganj, Lucknow, UP" className="text-sm font-medium" />
                  {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Business Email</label>
                  <Input {...register('email')} placeholder="e.g. contact@business.com" className="text-sm font-medium" />
                  {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Short Description / Story</label>
                  <textarea {...register('description')} rows={3} placeholder="Tell customers what makes your shop special..." className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>}
                </div>
                <div className="flex justify-end border-t border-slate-100 pt-3">
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700">
                    <Save size={15} /> {isSubmitting ? 'Saving...' : 'Save Store Details'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Store Imagery for AI Engine</h3>
                  <p className="mt-0.5 text-xs text-slate-500">These 3 photos generate festival flyers and your QR storefront.</p>
                </div>
                <button type="button" onClick={handleResetImages} className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <RotateCcw size={13} /> Reset to Starter
                </button>
              </div>

              <div className="space-y-5">
                {([
                  { key: 'shop' as const, title: '1. Shop Front / Entrance', hint: 'Daylight shot of facade, name board, or counter.', ratio: '1:1 Ratio' },
                  { key: 'product' as const, title: '2. Hero Dish / Best-Selling Product', hint: 'Top beverage, signature dish, or premier service.', ratio: '4:5 Ratio' },
                  { key: 'item' as const, title: '3. Ambiance / Signature Treat', hint: 'Seating area, bakery display, or packaging.', ratio: '1:1 Ratio' },
                ]).map((slot) => (
                  <div key={slot.key} className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-300 bg-slate-200">
                      <img src={images[slot.key]} alt={slot.title} className="h-full w-full object-cover" />
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">{slot.ratio}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                        <span>{slot.title}</span>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                      <p className="text-xs text-slate-500">{slot.hint}</p>
                      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100">
                          <Upload size={13} />
                          <span>Upload New</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFileChange(slot.key, e)} />
                        </label>
                        <input
                          type="text"
                          value={images[slot.key]}
                          onChange={(e) => setImages((prev) => ({ ...prev, [slot.key]: e.target.value }))}
                          className="h-8 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-slate-600"
                          placeholder="Or paste image URL"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-3">
                <Button type="button" onClick={handleSaveImages} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700">
                  <Save size={15} /> Save Photo Suite
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900">Store Operating Hours</h3>
                <p className="mt-0.5 text-xs text-slate-500">Scanners see a live Open / Closed badge from these timings.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Operating Days</label>
                  <Input value={hours.workingDays} onChange={(e) => setHours((prev) => ({ ...prev, workingDays: e.target.value }))} className="text-sm font-medium" placeholder="e.g. Monday - Sunday" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Opening Time</label>
                    <Input value={hours.openTime} onChange={(e) => setHours((prev) => ({ ...prev, openTime: e.target.value }))} className="font-mono text-sm font-medium" placeholder="10:00 AM" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Closing Time</label>
                    <Input value={hours.closeTime} onChange={(e) => setHours((prev) => ({ ...prev, closeTime: e.target.value }))} className="font-mono text-sm font-medium" placeholder="11:00 PM" />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Currently Open for Customers</div>
                    <div className="text-[11px] text-emerald-800">Open {hours.workingDays}, {hours.openTime} to {hours.closeTime}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end border-t border-slate-100 pt-3">
                <Button type="button" onClick={() => toast.success(`Hours saved: ${hours.workingDays}, ${hours.openTime} - ${hours.closeTime}.`)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700">
                  <Save size={15} /> Save Operating Timings
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <QrCode size={14} className="text-indigo-600" /> Customer Scan Mockup
            </span>
            <span className="text-[11px] font-medium text-slate-500">Live Simulation</span>
          </div>

          <div className="mx-auto w-full max-w-[340px] rounded-[36px] border-4 border-slate-800 bg-slate-950 p-3 shadow-2xl">
            <div className="mx-auto mb-2 h-4 w-24 rounded-full bg-slate-900" />
            <div className="flex h-[520px] flex-col overflow-hidden rounded-[28px] bg-white text-slate-900 shadow-inner">
              <div className="relative h-36 bg-slate-900">
                <img src={images.shop} alt="Shop" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">Open Now</div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-extrabold tracking-tight">{business.name}</span>
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-300">{business.category} | {hours.openTime} - {hours.closeTime}</div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-3.5 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-3 font-bold text-slate-950 shadow-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide opacity-90">Daily Visit Bonus</div>
                    <div className="text-sm font-black">+10 Eddy Coins</div>
                  </div>
                  <button type="button" onClick={() => toast.success('Demo spin: customer would win 10 Eddy Coins. Configure odds in Rewards.')} className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-extrabold text-amber-400 hover:bg-slate-800">
                    Spin Wheel
                  </button>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span>Popular Specialties</span>
                    <button type="button" onClick={() => { setPreviewMenu((v) => !v); toast.info(previewMenu ? 'Collapsed full menu preview.' : 'Expanded 6-item menu preview.'); }} className="text-[10px] text-indigo-600 hover:text-indigo-800">
                      {previewMenu ? 'Hide Menu' : 'View Menu'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-2">
                      <img src={images.product} alt="Special Masala Chai" className="h-16 w-full rounded-lg object-cover" />
                      <div className="truncate text-[11px] font-bold">Special Masala Chai</div>
                      <div className="font-mono text-[10px] text-slate-500">Rs.40</div>
                    </div>
                    <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-2">
                      <img src={images.item} alt="Artisanal Samosa" className="h-16 w-full rounded-lg object-cover" />
                      <div className="truncate text-[11px] font-bold">Artisanal Samosa</div>
                      <div className="font-mono text-[10px] text-slate-500">Rs.30</div>
                    </div>
                  </div>
                  {previewMenu && (
                    <div className="mt-2 space-y-1 rounded-xl border border-slate-100 bg-white p-2 text-[11px]">
                      {['Kulhad Chai - Rs.40', 'Samosa Plate (2 pc) - Rs.30', 'Bun Maska - Rs.50', 'Cold Coffee - Rs.90'].map((row) => (
                        <div key={row} className="flex justify-between border-b border-slate-50 py-1 last:border-0"><span className="text-slate-600">{row.split(' - ')[0]}</span><span className="font-mono font-bold text-slate-900">{row.split(' - ')[1]}</span></div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin size={12} className="shrink-0 text-indigo-600" />
                    <span className="truncate">{business.location}</span>
                  </div>
                  <button type="button" onClick={() => toast.info('128 verified reviews, 4.9 average. Detail view lives in Reviews.')} className="flex items-center gap-1.5 font-bold text-amber-600 hover:text-amber-700">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>4.9 (128 verified reviews)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
