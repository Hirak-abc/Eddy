import { useState } from 'react';
import { Sparkles, Trophy, Percent, Gift, RefreshCcw, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockRewards = [
  { id: 1, label: '10 Coins', value: 10, color: 'from-amber-400 to-amber-600', icon: Trophy, prob: 0.35 },
  { id: 2, label: '25 Coins', value: 25, color: 'from-amber-300 to-amber-500', icon: Trophy, prob: 0.2 },
  { id: 3, label: '15% Off', value: 15, color: 'from-rose-400 to-rose-600', icon: Percent, prob: 0.25 },
  { id: 4, label: 'Free Bun', value: 40, color: 'from-emerald-400 to-emerald-600', icon: Gift, prob: 0.1 },
  { id: 5, label: '50 Coins', value: 50, color: 'from-violet-400 to-violet-600', icon: Star, prob: 0.08 },
  { id: 6, label: 'Better Luck', value: 0, color: 'from-slate-400 to-slate-600', icon: RefreshCcw, prob: 0.02 },
];

export const SpinWheelPage = () => {
  const [spun, setSpun] = useState(false);
  const [res, setRes] = useState<typeof mockRewards[0] | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    const r = Math.random(); let c = 0;
    for (const x of mockRewards) {
      c += x.prob;
      if (r <= c) {
        setRes(x);
        break;
      }
    }
    // Spin between 5-10 full rotations plus random additional degrees
    const extraSpin = Math.floor(Math.random() * 360);
    const totalSpin = 5 * 360 + extraSpin; // 5 full rotations + random
    setRotation(totalSpin);
    setSpun(true);

    // Reset after spin animation completes
    setTimeout(() => {
      setRotation(extraSpin); // Keep just the visual rotation
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
          alt="Vibrant food market scene"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white text-shadow">
          <h1 className="text-2xl font-bold md:text-3xl">Spin the Wheel</h1>
          <p className="text-sm opacity-90">Win coins, discounts & free items.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex-col">
        <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">

            {/* Wheel Container */}
            <div className="relative">
              <div className="w-64 h-64 mx-auto rounded-full border-4 border-amber-200 bg-white shadow-2xl overflow-hidden">
                <div className={`w-full h-full transition-transform duration-300 ease-out`} style={{ transform: `rotate(${rotation}deg)` }}>
                  {[0,60,120,180,240,300].map((d,i)=>(
                    <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${d}deg)` }}>
                      <div className={`absolute top-0 left-0 w-full h-1/2
                                    bg-gradient-to-b ${mockRewards[i].color}
                                    opacity-90`}
                           style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Wheel Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-xl border-4 border-amber-200 flex items-center justify-center z-10">
                    <Zap size={28} className="text-amber-500 animate-spin-slow" />
                  </div>
                </div>
                {/* Wheel Pointer */}
                <div className="absolute bottom-full left-1/2 -mb-2 -mt-0.5 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-4 border-transparent border-r-4 border-transparent border-b-6 border-amber-500" />
                </div>
              </div>
            </div>

            {/* Spin Button */}
            {!spun ? (
              <Button
                onClick={handleSpin}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-4 px-8 text-xl rounded-full shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Sparkles size={20} className="mr-2" />
                SPIN NOW
              </Button>
            ):(
              <div className="space-y-4 text-center">
                <div className="text-4xl font-bold text-amber-600 animate-pulse">
                  {res?.label}
                </div>
                <div className="text-lg font-bold text-slate-800">
                  {res?.value ? `You won ${res.label}!` : 'Better luck next time!'}
                </div>
                <Button
                  onClick={() => {
                    setSpun(false);
                    setRes(null);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <RefreshCcw size={18} className="mr-2" />
                  Spin Again
                </Button>
              </div>
            )}

            {/* Rewards Grid */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-slate-900">
                Possible Rewards
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockRewards.map((r) => (
                  <Card
                    key={r.id}
                    className="text-center p-4 border-slate-100 hover:border-amber-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full
                                bg-gradient-to-br ${r.color}
                                flex items-center justify-center text-white
                                shadow-lg`}>
                      <r.icon size={18} />
                    </div>
                    <div className="font-bold text-slate-800">{r.label}</div>
                    <div className="text-xs text-slate-500">{Math.round(r.prob*100)}%</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};