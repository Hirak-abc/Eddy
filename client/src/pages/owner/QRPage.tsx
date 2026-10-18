import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Check, CircleDollarSign, Copy, FileDown, Printer, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { businessService, type OwnerBusiness, type RedeemableOffer } from '@/services/business.service';
import { redemptionService, type Redemption } from '@/services/redemption.service';
import { settlementService, type OwnerSettlementSummary } from '@/services/settlement.service';

const formatRupees = (paise: number) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(paise / 100);

const rupeesToPaise = (value: string) => {
  const match = value.trim().match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
};

export const QRPage = () => {
  const [business, setBusiness] = useState<OwnerBusiness | null>(null);
  const [offers, setOffers] = useState<RedeemableOffer[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [settlements, setSettlements] = useState<OwnerSettlementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerCoins, setOfferCoins] = useState('50');
  const [offerValueRupees, setOfferValueRupees] = useState('50');
  const [qrPng, setQrPng] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);

  const shopUrl = useMemo(() => {
    if (!business) return null;
    const url = new URL('/customer/scan', window.location.origin);
    url.searchParams.set('qrToken', business.qrToken);
    return url.toString();
  }, [business]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [businessResponse, offersResponse, redemptionResponse, settlementResponse] =
      await Promise.all([
        businessService.getMine(),
        businessService.getMyOffers(),
        redemptionService.listOwner(),
        settlementService.getMine(),
      ]);
    const failed = [businessResponse, offersResponse, redemptionResponse, settlementResponse]
      .find((response) => !response.success);
    if (failed) {
      setError(failed.error?.message ?? 'Shop rewards data could not be loaded.');
      setLoading(false);
      return;
    }
    let ownerBusiness = businessResponse.data;
    if (ownerBusiness && !ownerBusiness.qrEnabled && ownerBusiness.verificationStatus !== 'VERIFIED') {
      const activationResponse = await businessService.activateLegacyQr();
      if (!activationResponse.success || activationResponse.data === null) {
        setError(activationResponse.error?.message ?? 'Shop QR could not be activated.');
        setLoading(false);
        return;
      }
      ownerBusiness = activationResponse.data;
    }
    setBusiness(ownerBusiness);
    setOffers(offersResponse.data ?? []);
    setRedemptions(redemptionResponse.data ?? []);
    setSettlements(settlementResponse.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    let cancelled = false;
    if (!shopUrl) {
      setQrPng(null);
      setQrSvg(null);
      return;
    }
    void Promise.all([
      QRCode.toDataURL(shopUrl, { width: 800, margin: 2, errorCorrectionLevel: 'H' }),
      QRCode.toString(shopUrl, { type: 'svg', width: 800, margin: 2, errorCorrectionLevel: 'H' }),
    ]).then(([png, svg]) => {
      if (!cancelled) {
        setQrPng(png);
        setQrSvg(svg);
      }
    }).catch((qrError: unknown) => {
      console.error('QR generation failed:', qrError);
      if (!cancelled) setError('Could not generate the shop QR. Please retry.');
    });
    return () => {
      cancelled = true;
    };
  }, [shopUrl]);

  const handleCreateShop = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const response = await businessService.create({
      name: shopName,
      category,
      address,
    });
    if (!response.success || response.data === null) {
      toast.error(response.error?.message ?? 'Could not save shop details.');
    } else {
      setBusiness(response.data);
      toast.success('Shop profile saved. An administrator must verify it before its QR becomes active.');
      await loadData();
    }
    setSaving(false);
  };

  const handleCreateOffer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const settlementValuePaise = rupeesToPaise(offerValueRupees);
    const coinsCost = Number(offerCoins);
    if (!Number.isInteger(coinsCost) || coinsCost < 50 || coinsCost > 100 || settlementValuePaise === null) {
      toast.error('Enter a 50–100 Coin cost and a rupee value with at most two decimal places.');
      return;
    }
    setSaving(true);
    const response = await businessService.createOffer({
      name: offerName,
      description: offerDescription || undefined,
      coinsCost,
      settlementValuePaise,
    });
    if (!response.success) {
      toast.error(response.error?.message ?? 'Could not create the reward offer.');
    } else {
      setOfferName('');
      setOfferDescription('');
      setOfferCoins('50');
      setOfferValueRupees('50');
      toast.success('Redeemable offer created.');
      await loadData();
    }
    setSaving(false);
  };

  const handleReview = async (redemptionId: string, decision: 'APPROVED' | 'REJECTED') => {
    const response = await redemptionService.review(redemptionId, decision);
    if (!response.success) {
      toast.error(response.error?.message ?? 'Could not update redemption.');
    } else {
      toast.success(`Redemption ${decision.toLowerCase()}.`);
      await loadData();
    }
  };

  const handleSettlementBatch = async () => {
    const response = await settlementService.createBatch();
    if (!response.success || response.data === null) {
      toast.error(response.error?.message ?? 'No eligible settlement batch could be created.');
    } else {
      toast.success(`Settlement batch ${response.data.reference} submitted for review; no payment has been made.`);
      await loadData();
    }
  };

  const handleQrDisable = async () => {
    const response = await businessService.disableQr();
    if (!response.success) {
      toast.error(response.error?.message ?? 'Could not disable the shop QR.');
    } else {
      toast.success('Shop QR disabled.');
      await loadData();
    }
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (format === 'png' && qrPng) {
      const anchor = document.createElement('a');
      anchor.href = qrPng;
      anchor.download = `${business?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-eddy-qr.png`;
      anchor.click();
      return;
    }
    if (format === 'svg' && qrSvg) {
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(new Blob([qrSvg], { type: 'image/svg+xml' }));
      anchor.download = `${business?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-eddy-qr.svg`;
      anchor.click();
      URL.revokeObjectURL(anchor.href);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500" role="status">Loading shop rewards…</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">In-store rewards</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Shop QR & settlement</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          One permanent QR per shop. Scan eligibility, rewards, wallet changes, and settlement amounts are validated by Eddy.
        </p>
      </header>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-rose-700">{error}</p>
            <Button variant="outline" onClick={() => void loadData()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {!business ? (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Create your shop profile</h2>
              <p className="mt-1 text-sm text-slate-500">Use your actual shop details. The generated QR will stay bound to this profile.</p>
            </div>
            <form onSubmit={handleCreateShop} className="grid gap-3 sm:grid-cols-2">
              <Input required minLength={2} maxLength={120} value={shopName} onChange={(event) => setShopName(event.target.value)} placeholder="Shop name" aria-label="Shop name" />
              <Input required minLength={2} maxLength={80} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" aria-label="Shop category" />
              <Input required minLength={3} maxLength={240} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Shop address" aria-label="Shop address" className="sm:col-span-2" />
              <Button type="submit" disabled={saving} className="sm:col-span-2">{saving ? 'Saving…' : 'Save shop and create permanent QR'}</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{business.name}</h2>
                      {business.qrEnabled && <ShieldCheck size={18} className="text-emerald-600" aria-label="Active shop QR" />}
                    </div>
                    <p className="text-sm text-slate-500">{business.category} · {business.address}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    business.qrEnabled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {business.qrEnabled ? 'QR ACTIVE' : 'QR DISABLED'}
                  </span>
                </div>

                {shopUrl && qrPng ? (
                  <>
                    <div id="eddy-standee" className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-gradient-to-b from-slate-950 to-indigo-950 p-7 text-center text-white print:bg-white print:text-black print:shadow-none">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black">E</div>
                      <div>
                        <p className="text-2xl font-black">Eddy</p>
                        <h3 className="mt-1 text-lg font-extrabold">{business.name}</h3>
                        <p className="text-xs opacity-80">{business.address}</p>
                      </div>
                      <p className="text-base font-bold text-amber-300 print:text-black">Scan & Spin to Win Eddy Coins</p>
                      <img src={qrPng} alt={`Permanent QR for ${business.name}`} className="h-56 w-56 rounded-xl bg-white p-2" />
                      <p className="font-bold">1 Eddy Coin = ₹1</p>
                      <p className="text-xs">Open Eddy, scan this code, sign in, and spin to receive your reward.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 print:hidden">
                      <Button onClick={() => window.print()} disabled={!business.qrEnabled}><Printer size={16} className="mr-2" />Print standee</Button>
                      <Button variant="outline" onClick={() => handleDownload('png')}><FileDown size={16} className="mr-2" />PNG</Button>
                      <Button variant="outline" onClick={() => handleDownload('svg')}><FileDown size={16} className="mr-2" />SVG</Button>
                      <Button variant="outline" onClick={() => {
                        void navigator.clipboard.writeText(shopUrl);
                        toast.success('Permanent QR link copied.');
                      }}><Copy size={16} className="mr-2" />Copy link</Button>
                      {business.qrEnabled && <Button variant="outline" onClick={() => void handleQrDisable()}>Disable QR</Button>}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Preparing your QR…</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Redeemable shop offers</h2>
                  <p className="text-sm text-slate-500">The server stores the Coin cost and fixed settlement value in paise.</p>
                </div>
                {!business.qrEnabled && (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Enable the shop QR before adding offers.</p>
                )}
                <form onSubmit={handleCreateOffer} className="space-y-3">
                  <Input required minLength={2} maxLength={100} value={offerName} onChange={(event) => setOfferName(event.target.value)} placeholder="Reward item name" aria-label="Reward item name" />
                  <Input maxLength={300} value={offerDescription} onChange={(event) => setOfferDescription(event.target.value)} placeholder="Description (optional)" aria-label="Offer description" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input required type="number" min={50} max={100} step={1} value={offerCoins} onChange={(event) => setOfferCoins(event.target.value)} aria-label="Coin cost" />
                    <Input required inputMode="decimal" pattern="[0-9]+(\\.[0-9]{1,2})?" value={offerValueRupees} onChange={(event) => setOfferValueRupees(event.target.value)} aria-label="Settlement value in rupees" placeholder="Settlement value ₹" />
                  </div>
                  <Button type="submit" disabled={saving || !business.qrEnabled}>Add offer</Button>
                </form>
                <ul className="divide-y divide-slate-100">
                  {offers.map((offer) => (
                    <li key={offer._id} className="flex justify-between gap-3 py-3 text-sm">
                      <span className="font-bold text-slate-800">{offer.name}</span>
                      <span className="shrink-0 text-right text-slate-600">{offer.coinsCost} Coins · ₹{formatRupees(offer.settlementValuePaise)}</span>
                    </li>
                  ))}
                  {!offers.length && <li className="py-3 text-sm text-slate-500">No active offers yet.</li>}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Redemption requests</h2>
                  <p className="text-sm text-slate-500">Coins are reserved at request time and finalized only after your decision.</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {redemptions.map((redemption) => (
                  <div key={redemption._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-bold text-slate-800">{redemption.offerName} · {redemption.coinsCost} Coins</p>
                      <p className="text-xs text-slate-500">{redemption.reference} · ₹{formatRupees(redemption.settlementValuePaise)} receivable · {redemption.status}</p>
                    </div>
                    {redemption.status === 'REQUESTED' && (
                      <div className="flex gap-2">
                        <Button onClick={() => void handleReview(redemption._id, 'APPROVED')}><Check size={15} className="mr-1" />Approve</Button>
                        <Button variant="outline" onClick={() => void handleReview(redemption._id, 'REJECTED')}>Reject</Button>
                      </div>
                    )}
                  </div>
                ))}
                {!redemptions.length && <p className="py-3 text-sm text-slate-500">No redemption requests.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="text-emerald-600" size={20} />
                <h2 className="text-lg font-extrabold text-slate-900">Two-week settlement tracking</h2>
              </div>
              {settlements ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ['Approved value', settlements.approvedTotalPaise],
                      ['Pending', settlements.pendingPaise],
                      ['Eligible now', settlements.eligiblePaise],
                      ['Paid', settlements.paidPaise],
                    ].map(([label, amount]) => (
                      <div key={label} className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
                        <p className="mt-1 text-lg font-black text-slate-900">₹{formatRupees(Number(amount))}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    Next eligibility: {settlements.nextSettlementAt ? new Date(settlements.nextSettlementAt).toLocaleString('en-IN') : 'No future settlements scheduled'}.
                    Approved redemptions become eligible 14 days after approval.
                  </p>
                  <Button onClick={() => void handleSettlementBatch()} disabled={settlements.eligiblePaise <= 0}>
                    Request eligible settlement batch
                  </Button>
                  <p className="text-xs text-slate-500">A batch request is not a payment. An administrator must verify and record any actual transfer reference.</p>
                  <ul className="divide-y divide-slate-100">
                    {settlements.batches.map((batch) => (
                      <li key={batch._id} className="flex justify-between gap-3 py-2 text-sm">
                        <span className="font-semibold">{batch.reference} · {batch.status}</span>
                        <span>₹{formatRupees(batch.totalPaise)} {batch.paymentReference ? `· ${batch.paymentReference}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-slate-500">Settlement data is unavailable.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
