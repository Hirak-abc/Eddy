import { FormEvent, useCallback, useEffect, useState } from "react";
import { Clock, Ticket, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  couponService,
  type CustomerCoupon,
} from "@/services/coupon.service";

export const CouponCodesPage = () => {
  const [code, setCode] = useState("");
  const [coupons, setCoupons] = useState<CustomerCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const loadCoupons = useCallback(async () => {
    const response = await couponService.listMine();
    if (!response.success || !response.data) {
      toast.error(response.error?.message || "Could not load your coupons.");
      setIsLoading(false);
      return;
    }
    setCoupons(response.data.coupons);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const handleClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim()) return;
    setIsClaiming(true);
    const response = await couponService.claim(code);
    if (!response.success || !response.data) {
      toast.error(response.error?.message || "Could not claim this flyer code.");
      setIsClaiming(false);
      return;
    }
    toast.success(
      `${response.data.coupon.discountPercent}% coupon added for ${response.data.coupon.businessName}.`,
    );
    setCode("");
    await loadCoupons();
    setIsClaiming(false);
  };

  const handleRequest = async (coupon: CustomerCoupon) => {
    setRequestingId(coupon.id);
    const response = await couponService.requestUse(coupon.id);
    if (!response.success) {
      toast.error(response.error?.message || "Could not request this coupon.");
    } else {
      toast.success("Request sent to the shop owner for approval.");
      await loadCoupons();
    }
    setRequestingId(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Ticket size={21} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            My Coupons
          </h1>
          <p className="text-sm text-slate-500">
            Claim a one-time code from a flyer, then request it at the shop.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleClaim}
        className="flex flex-col gap-3 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 sm:flex-row"
      >
        <label htmlFor="flyer-coupon-code" className="sr-only">
          Flyer coupon code
        </label>
        <input
          id="flyer-coupon-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter the 8-character code from a flyer"
          maxLength={32}
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-xl border border-violet-200 bg-white px-3 font-mono text-sm uppercase tracking-widest outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        <Button
          type="submit"
          disabled={isClaiming || !code.trim()}
          className="h-11 rounded-xl bg-violet-700 px-5 text-white hover:bg-violet-800"
        >
          {isClaiming ? "Checking..." : "Claim coupon"}
        </Button>
      </form>

      {isLoading ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          Loading coupons...
        </p>
      ) : coupons.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {coupons.map((coupon) => {
            const requested = coupon.status === "REQUESTED";
            return (
              <article
                key={coupon.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                      {coupon.businessName}
                    </p>
                    <h2 className="mt-1 font-bold text-slate-900">
                      {coupon.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                    {coupon.discountPercent}% OFF
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={13} />
                    Expires{" "}
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleString("en-IN")
                      : "soon"}
                  </p>
                  {requested ? (
                    <span className="text-xs font-bold text-amber-700">
                      Waiting for owner
                    </span>
                  ) : (
                    <Button
                      type="button"
                      disabled={requestingId === coupon.id}
                      onClick={() => void handleRequest(coupon)}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white hover:bg-slate-700"
                    >
                      {requestingId === coupon.id
                        ? "Sending..."
                        : coupon.status === "REJECTED"
                          ? "Request again"
                          : "Request"}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
          <SearchX size={26} className="text-slate-400" />
          <p className="font-bold text-slate-800">No active flyer coupons</p>
          <p className="text-sm text-slate-500">
            Enter a code from a participating shop's flyer above.
          </p>
        </div>
      )}
    </div>
  );
};
