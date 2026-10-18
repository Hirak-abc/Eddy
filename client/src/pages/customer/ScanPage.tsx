import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ScanLine, Camera, AlertCircle, ChevronRight } from 'lucide-react';
import type { IScannerControls } from '@zxing/browser';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { qrService } from '@/services/qr.service';
import { getQrTokenFromQr } from '@/lib/shopQr';
import { MAX_DAILY_SCANS } from '@/lib/constants';

const STEPS = [
  { title: 'Point at the QR', detail: 'Find the Eddy standee at the billing counter.' },
  { title: 'Verify the shop', detail: 'The server checks the permanent QR and your daily eligibility.' },
  { title: 'Spin to win', detail: 'Your reward comes from the server and is credited to your wallet.' },
];

export const ScanPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [scansLeft, setScansLeft] = useState(MAX_DAILY_SCANS);
  const [scanId, setScanId] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string | null>(null);
  const [shopAddress, setShopAddress] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const scanPendingRef = useRef(false);
  const scanningEnabledRef = useRef(false);
  const scannerSessionRef = useRef(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void qrService.getStatus().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setScansLeft(res.data.scansLeft);
      } else {
        toast.error(res.error?.message ?? 'Could not load your scan status.');
      }
    });

    return () => {
      cancelled = true;
      scanningEnabledRef.current = false;
      scannerSessionRef.current += 1;
      controlsRef.current?.stop();
    };
  }, []);

  const stopCamera = useCallback(() => {
    scanningEnabledRef.current = false;
    scannerSessionRef.current += 1;
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCameraActive(false);
  }, []);

  const handleQrToken = useCallback(async (qrToken: string) => {
    if (scanPendingRef.current) return;
    scanPendingRef.current = true;
    try {
      const response = await qrService.scanQr(qrToken);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message ?? 'Could not verify this QR scan.');
      }

      setScansLeft(response.data.scansLeft);
      setScanId(response.data.scanId);
      setShopName(response.data.businessName);
      setShopAddress(response.data.address);
      setShopCategory(response.data.category);
      setPhase('done');
      stopCamera();
      toast.success(response.data.message);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not verify this QR scan.';
      console.error('QR scan failed:', error);
      setCameraError(message);
      toast.error(message);
      stopCamera();
      setPhase('idle');
    } finally {
      scanPendingRef.current = false;
    }
  }, [stopCamera]);

  const handleDecodedQr = async (value: string) => {
    if (scanPendingRef.current || !scanningEnabledRef.current) return;

    const qrToken = getQrTokenFromQr(value, window.location.origin);
    if (!qrToken) {
      setCameraError('This QR code is not a valid Eddy shop standee. Scan the code printed by an active shop.');
      toast.error('This is not a valid Eddy shop QR code.');
      stopCamera();
      setPhase('idle');
      return;
    }
    await handleQrToken(qrToken);
  };

  const qrTokenFromUrl = searchParams.get('qrToken');
  useEffect(() => {
    if (qrTokenFromUrl && /^[A-Za-z0-9_-]{32,}$/.test(qrTokenFromUrl)) {
      void handleQrToken(qrTokenFromUrl);
    }
  }, [handleQrToken, qrTokenFromUrl]);

  const startCamera = async () => {
    setCameraError(null);
    scanPendingRef.current = false;
    const session = ++scannerSessionRef.current;
    scanningEnabledRef.current = true;
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      if (session !== scannerSessionRef.current) return;
      if (!videoRef.current) {
        throw new Error('Camera preview is not ready. Please try again.');
      }
      const reader = new BrowserMultiFormatReader();
      setCameraActive(true);
      setPhase('scanning');
      const controls = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        videoRef.current,
        (result, _error, scannerControls) => {
          controlsRef.current = scannerControls;
          if (result) {
            void handleDecodedQr(result.getText());
          }
        }
      );
      if (session !== scannerSessionRef.current) {
        controls.stop();
      } else {
        controlsRef.current = controls;
      }
    } catch (error: unknown) {
      if (session !== scannerSessionRef.current) return;
      const message = error instanceof Error ? error.message : 'Camera access failed.';
      console.error('Camera access error:', error);
      setCameraError('Could not access or start the camera. Allow camera permission and try again.');
      scanningEnabledRef.current = false;
      setCameraActive(false);
      setPhase('idle');
      toast.error(message);
    }
  };

  const handleReset = () => {
    setScanId(null);
    setShopName(null);
    setShopAddress(null);
    setShopCategory(null);
    scanPendingRef.current = false;
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
            <video
              ref={videoRef}
              className={cn('absolute inset-0 h-full w-full object-cover', !cameraActive && 'hidden')}
              muted
              playsInline
            />
            {!cameraActive && (
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
            <span className="font-semibold text-slate-300">Scans left today (Max {MAX_DAILY_SCANS}/day)</span>
            <span className={cn('font-black tabular-nums', scansLeft > 0 ? 'text-amber-400' : 'text-rose-400')}>
              {scansLeft}/{MAX_DAILY_SCANS}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              style={{ width: `${(scansLeft / MAX_DAILY_SCANS) * 100}%` }}
            />
          </div>

          {phase === 'done' ? (
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Button
                onClick={() => scanId && navigate(`/customer/spin-wheel?scanId=${encodeURIComponent(scanId)}`)}
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 w-full"
              >
                Spin Now
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
              disabled={scansLeft <= 0}
              className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-base font-extrabold text-white shadow-xl shadow-amber-500/20 transition-transform hover:scale-[1.02] disabled:opacity-70 rounded-2xl flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              <span>Tap to Scan QR</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Result cards */}
      {phase === 'done' && (
        <Card className="border-violet-200 bg-violet-50">
          <CardContent className="space-y-1 p-4">
            <div className="text-lg font-black text-violet-800">{shopName}</div>
            <div className="text-sm font-semibold text-violet-700">{shopCategory}</div>
            <div className="text-xs text-violet-600">{shopAddress}</div>
            <p className="pt-2 text-xs font-semibold text-violet-700">
              Shop identity verified. Spin to receive a server-selected reward.
            </p>
          </CardContent>
        </Card>
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
          <a
            href="/customer/discover"
            className="flex items-center justify-center gap-1 pt-1 text-sm font-bold text-amber-600 hover:text-amber-700"
          >
            Find shops near you <ChevronRight size={16} />
          </a>
        </CardContent>
      </Card>
    </div>
  );
};
