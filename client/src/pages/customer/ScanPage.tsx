import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Ticket, CheckCircle2, ChevronRight, ScanLine, Camera, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { qrService } from '@/services/qr.service';

const STEPS = [
  { title: 'Point at the QR', detail: 'Find the Eddy standee at the billing counter.' },
  { title: 'Earn coins instantly', detail: '+10 coins drop into your wallet on every valid scan.' },
  { title: 'Spin & redeem', detail: 'Unlock the spin wheel and coupon codes for the shop.' },
];

export const ScanPage = () => {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [scansLeft, setScansLeft] = useState(100);
  const [loading, setLoading] = useState(false);
  const [lastReward, setLastReward] = useState<string>('+10 Coins Earned');
  const [verifiedBusinessId, setVerifiedBusinessId] = useState<string>('sharma-sweets');

  // Real camera stream reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial scan status
    qrService.getStatus().then((res) => {
      if (res.success && res.data) {
        setScansLeft(res.data.scansLeft);
      }
    });

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setPhase('scanning');
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission denied or camera not available. Use simulated detection or check permissions.');
      setCameraActive(false);
      setPhase('idle');
      toast.error('Could not access camera. Please allow camera access.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDetectQrCode = async (rawQrData: string) => {
    if (loading || phase === 'done') return;

    if (scansLeft <= 0) {
      toast.error('Daily scan limit reached — come back tomorrow (Max 100 scans/day)');
      stopCamera();
      setPhase('idle');
      return;
    }

    setLoading(true);
    stopCamera();

    // Extract businessId or shop token securely from URL or payload
    // Example format: https://eddy.platform/shop/sharma-sweets or raw business ID
    let extractedBusinessId = rawQrData.trim();
    if (rawQrData.includes('/shop/')) {
      const parts = rawQrData.split('/shop/');
      extractedBusinessId = parts[1]?.split('/')[0] || 'sharma-sweets';
    }

    try {
      const res = await qrService.scanQr(extractedBusinessId);
      if (res.success && res.data) {
        setPhase('done');
        setScansLeft(res.data.scansLeft);
        setVerifiedBusinessId(res.data.businessId);
        setLastReward(`+${res.data.coinsAwarded} Coins Earned`);
        toast.success(res.data.message);
      } else {
        setPhase('idle');
        toast.error(res.error?.message || 'Invalid or unrecognized QR code');
      }
    } catch (err: any) {
      setPhase('idle');
      toast.error(err?.message || 'Failed to verify QR code on server');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setCameraError(null);
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Scan QR</h1>
        <p className="text-sm text-slate-500">Scan shop QR standee to earn rewards & unlock discounts.</p>
      </div>

      {/* Viewfinder */}
      <Card className="overflow-hidden border-slate-900 bg-slate-950 shadow-2xl">
        <CardContent className="p-6">
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-slate-900 flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute left-5 top-5 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-amber-400 pointer-events-none" />
            <div className="absolute right-5 top-5 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-5 left-5 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-5 right-5 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-amber-400 pointer-events-none" />

            {/* Laser line if scanning */}
            {cameraActive && (
              <motion.div
                className="absolute left-8 right-8 h-0.5 rounded bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.9)] pointer-events-none"
                animate={{ top: ['14%', '86%', '14%'] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* Status */}
            <div className="absolute inset-x-0 bottom-8 flex justify-center z-10">
              {phase === 'scanning' ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur">
                  <ScanLine size={14} className="animate-pulse" />
                  Looking for QR code…
                </span>
              ) : phase === 'done' ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  <CheckCircle2 size={14} />
                  Verified QR Scan
                </span>
              ) : (
                <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
                  Tap button below to start camera
                </span>
              )}
            </div>
          </div>

          {cameraError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-300">Scans left today (Max 100/day)</span>
            <span className={cn('font-black tabular-nums', scansLeft > 0 ? 'text-amber-400' : 'text-rose-400')}>
              {scansLeft}/100
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              style={{ width: `${(scansLeft / 100) * 100}%` }}
            />
          </div>

          {phase === 'done' ? (
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Button
                asChild
                className="bg-amber-500 font-bold text-white hover:bg-amber-600 rounded-xl"
              >
                <Link to={`/customer/shop/${verifiedBusinessId}`}>Open Shop & Spin</Link>
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-white/15 font-bold text-white hover:bg-white/10 rounded-xl"
              >
                Scan another
              </Button>
            </div>
          ) : cameraActive ? (
            <div className="mt-5 flex justify-center">
              <Button
                onClick={() => {
                  stopCamera();
                  setPhase('idle');
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-bold text-xs rounded-xl w-full"
              >
                Stop Camera
              </Button>
            </div>
          ) : (
            <Button
              onClick={startCamera}
              disabled={loading || scansLeft <= 0}
              className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-base font-extrabold text-white shadow-xl shadow-amber-500/20 transition-transform hover:scale-[1.02] disabled:opacity-70 rounded-2xl flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              <span>{loading ? 'Verifying Scan…' : 'Tap to Scan QR'}</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Result cards */}
      {phase === 'done' && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Coins size={20} />
              </div>
              <div>
                <div className="text-xl font-black text-amber-700">{lastReward}</div>
                <div className="text-xs font-bold text-amber-600">Added to wallet</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-violet-200 bg-violet-50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white">
                <Ticket size={20} />
              </div>
              <div>
                <div className="text-xl font-black text-violet-700">1</div>
                <div className="text-xs font-bold text-violet-600">Spin unlocked</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* How it works */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <h2 className="text-base font-extrabold text-slate-900">How scanning works</h2>
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{step.title}</p>
                <p className="text-xs text-slate-500">{step.detail}</p>
              </div>
            </div>
          ))}
          <Link
            to="/customer/discover"
            className="flex items-center justify-center gap-1 pt-1 text-sm font-bold text-amber-600 hover:text-amber-700"
          >
            Find shops near you <ChevronRight size={16} />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
