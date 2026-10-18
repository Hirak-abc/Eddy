import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Coins, RefreshCcw, Sparkles, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { rewardsService, type SpinResponse } from '@/services/rewards.service';
import { notifyWalletUpdated } from '@/services/wallet.service';
import { toast } from 'sonner';

const REWARDS = [
  { coins: 2, probability: 40, center: 72 },
  { coins: 3, probability: 20, center: 180 },
  { coins: 4, probability: 10, center: 234 },
  { coins: 5, probability: 10, center: 270 },
  { coins: 10, probability: 20, center: 324 },
];

export const SpinWheelPage = () => {
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get('scanId');
  const [result, setResult] = useState<SpinResponse | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);

  const handleSpin = async () => {
    if (!scanId || spinning || result) return;
    setSpinning(true);
    setRequestFailed(false);

    try {
      const response = await rewardsService.spinWheel(scanId);
      if (!response.success || response.data === null) {
        throw new Error(response.error?.message ?? 'The spin could not be completed.');
      }
      const spinResult = response.data;

      const selectedReward = REWARDS.find((reward) => reward.coins === spinResult.coinsAwarded);
      if (!selectedReward) {
        throw new Error('The server returned an unsupported reward result.');
      }

      setResult(spinResult);
      setRotation(5 * 360 + (360 - selectedReward.center));
      notifyWalletUpdated();
      toast.success(spinResult.message);
      window.setTimeout(() => setSpinning(false), 3100);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'The spin could not be completed.';
      console.error('Spin request failed:', error);
      toast.error(message);
      setRequestFailed(true);
      setSpinning(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 py-6">
      <header className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Spin & win Eddy Coins</h1>
        <p className="mt-2 text-sm text-slate-500">
          Rewards are selected and recorded by Eddy. Wheel animation only displays the server result.
        </p>
      </header>

      {!scanId ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="space-y-3 p-6 text-center">
            <p className="font-bold text-amber-900">Scan an active shop QR before spinning.</p>
            <Button asChild><Link to="/customer/scan">Open QR scanner</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="relative mx-auto h-72 w-72">
            <div
              className="absolute inset-2 rounded-full border-8 border-white shadow-xl transition-transform duration-[3000ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                background: 'conic-gradient(#fbbf24 0deg 144deg,#fdba74 144deg 216deg,#a78bfa 216deg 252deg,#fb7185 252deg 288deg,#8b5cf6 288deg 360deg)',
              }}
              aria-label="Reward wheel"
            >
              <span className="absolute bottom-[24%] right-[18%] font-black text-slate-950">2</span>
              <span className="absolute bottom-[13%] left-1/2 -translate-x-1/2 font-black text-slate-950">3</span>
              <span className="absolute bottom-[23%] left-[18%] font-black text-white">4</span>
              <span className="absolute left-[11%] top-1/2 -translate-y-1/2 font-black text-white">5</span>
              <span className="absolute left-[18%] top-[20%] font-black text-white">10</span>
              <div className="absolute inset-[37%] flex items-center justify-center rounded-full border-4 border-amber-200 bg-white shadow-lg">
                <Sparkles className="text-amber-500" size={26} />
              </div>
            </div>
            <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 border-x-[10px] border-t-[20px] border-x-transparent border-t-rose-600" />
          </div>

          {!result ? (
            <Button
              onClick={() => void handleSpin()}
              disabled={spinning}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-lg font-black text-white"
            >
              <Sparkles size={19} className="mr-2" />
              {spinning ? 'Spinning…' : requestFailed ? 'Retry same spin' : 'SPIN NOW'}
            </Button>
          ) : (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="space-y-3 p-6 text-center">
                <Trophy className="mx-auto text-amber-600" size={32} />
                <h2 className="text-2xl font-black text-amber-900">You won {result.coinsAwarded} Eddy Coins</h2>
                <p className="text-sm font-semibold text-amber-800">
                  {result.coinsCredited} credited · {result.coinsOverflow} not credited (wallet cap 100)
                </p>
                <p className="flex items-center justify-center gap-2 text-sm text-slate-700">
                  <Coins size={17} /> Wallet balance: <strong>{result.walletBalance} Coins</strong>
                </p>
                <Button asChild variant="outline">
                  <Link to="/customer/scan"><RefreshCcw size={16} className="mr-2" />Scan another shop</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-5">
              {REWARDS.map((reward) => (
                <div key={reward.coins} className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="font-black text-slate-900">{reward.coins} Coins</p>
                  <p className="text-xs text-slate-500">{reward.probability}% per 100-spin cycle</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
