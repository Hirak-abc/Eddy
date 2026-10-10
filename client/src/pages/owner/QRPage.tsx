import { useState, useRef } from 'react';
import {
  Printer,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  FileDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const QRPage = () => {
  const { business } = useOwner();
  const printRef = useRef<HTMLDivElement>(null);

  const [standeeType, setStandeeType] = useState<'A6' | 'A5' | 'STICKER'>('A6');
  const [headline, setHeadline] = useState('Scan to Spin & Win Instant Rewards!');
  const [copiedLink, setCopiedLink] = useState(false);

  // Shop customer portal URL
  const shopUrl = `${window.location.origin}/shop/${business.id || 'b1'}`;

  // High contrast SVG QR with store branding
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    shopUrl
  )}&format=svg`;
  const qrPngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(
    shopUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopiedLink(true);
    toast.success('Customer shop link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadImage = (format: 'png' | 'svg') => {
    const link = document.createElement('a');
    link.href = format === 'svg' ? qrSvgUrl : qrPngUrl;
    link.download = `${business.name.toLowerCase().replace(/\s+/g, '-')}-qr.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded high-resolution QR code (${format.toUpperCase()})`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">In-Store Experience</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">QR & Table Standees</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart QR Standee Suite
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="text-xs font-bold border-slate-200 text-slate-700 rounded-xl"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600 mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Shop Link'}</span>
          </Button>

          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
          >
            <Printer size={15} />
            <span>Print Standee</span>
          </Button>
        </div>
      </div>

      {/* ── Stats & Security Policy ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Total Scans</span>
          <div className="text-2xl font-black text-slate-900 font-mono">148</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+18% vs yesterday</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Unique Diners</span>
          <div className="text-2xl font-black text-blue-600 font-mono">112</div>
          <p className="text-[11px] text-slate-400">Scanned at table</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={13} /> Scan Limit Security
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">3 / Day</div>
          <p className="text-[11px] text-slate-400">Per customer device (server-enforced)</p>
        </div>
      </div>

      {/* ── Standee Customizer & Live Printable Preview ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customizer Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Select Standee Format</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the physical dimensions tailored for table acrylic holders or wall posters.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'A6', label: 'A6 Table', sub: '105 x 148 mm' },
                { id: 'A5', label: 'A5 Poster', sub: '148 x 210 mm' },
                { id: 'STICKER', label: 'Sticker', sub: '75 x 75 mm' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setStandeeType(fmt.id as 'A6' | 'A5' | 'STICKER')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    standeeType === fmt.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{fmt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{fmt.sub}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Standee Header Call-to-Action
              </label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Scan to Spin the Wheel & Win 20% OFF!"
                className="text-xs font-medium"
              />
            </div>

            {/* Direct Downloads */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Download Standee Assets
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadImage('png')}
                  className="rounded-xl text-xs font-bold border-slate-200 text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <FileDown size={14} />
                  <span>High-Res PNG</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadImage('svg')}
                  className="rounded-xl text-xs font-bold border-slate-200 text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <FileDown size={14} />
                  <span>Vector SVG</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Standee Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            ref={printRef}
            className={`w-full max-w-sm rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl border-4 border-indigo-500/20 relative overflow-hidden text-center flex flex-col items-center justify-between space-y-6 ${
              standeeType === 'STICKER' ? 'aspect-square justify-center' : 'min-h-[500px]'
            }`}
          >
            {/* Background Glow effects */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />

            {/* Store Header */}
            <div className="relative z-10 space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/50">
                {business.name.charAt(0)}
              </div>
              <h3 className="font-black text-lg tracking-tight text-white">{business.name}</h3>
              <p className="text-xs text-indigo-200 font-medium">{headline}</p>
            </div>

            {/* Central QR Frame */}
            <div className="relative z-10 p-4 bg-white rounded-3xl shadow-2xl border-2 border-indigo-400/40">
              <img src={qrPngUrl} alt="Store QR Code" className="w-48 h-48 rounded-2xl object-contain" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                  E
                </div>
              </div>
            </div>

            {/* Footer Customer Instructions */}
            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-400/30 text-amber-300 text-[11px] font-bold">
                <Sparkles size={12} />
                <span>Win Coins, Spin Wheel & 96h Coupons</span>
              </div>
              <p className="text-[10px] text-slate-400">Scan with any phone camera or Google Lens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
