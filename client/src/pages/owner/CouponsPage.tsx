import { FormEvent, useCallback, useEffect, useState } from "react";
import { CircleCheck, Clock, Ticket, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  couponService,
  type CouponBalanceTransaction,
  type CouponUseRequest,
} from "@/services/coupon.service";

const formatInr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const CouponsPage = () => {
  const [requests, setRequests] = useState<CouponUseRequest[]>([]);
  const [transactions, setTransactions] = useState<CouponBalanceTransaction[]>(
    [],
  );
  const [balance, setBalance] = useState(0);
  const [billAmounts, setBillAmounts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [requestResponse, balanceResponse] = await Promise.all([
      couponService.listOwnerRequests(),
      couponService.balance(),
    ]);
    if (!requestResponse.success || !requestResponse.data) {
      toast.error(
        requestResponse.error?.message || "Could not load coupon requests.",
      );
    } else {
      setRequests(requestResponse.data.requests);
    }
    if (!balanceResponse.success || !balanceResponse.data) {
      toast.error(
        balanceResponse.error?.message || "Could not load coupon balance.",
      );
    } else {
      setBalance(balanceResponse.data.balance);
      setTransactions(balanceResponse.data.transactions);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleApprove = async (
    event: FormEvent<HTMLFormElement>,
    request: CouponUseRequest,
  ) => {
    event.preventDefault();
    const billAmount = Number(billAmounts[request.id]);
    if (!Number.isFinite(billAmount) || billAmount <= 0) {
      toast.error("Enter the total amount for the customer's purchase.");
      return;
    }
    setBusyId(request.id);
    const response = await couponService.approve(request.id, billAmount);
    if (!response.success || !response.data) {
      toast.error(response.error?.message || "Could not approve this request.");
    } else {
      toast.success(
        `${formatInr(response.data.redemption.discountAmount)} discount approved and added to your coupon balance.`,
      );
      setBillAmounts((current) => {
        const next = { ...current };
        delete next[request.id];
        return next;
      });
      await refresh();
    }
    setBusyId(null);
  };

  const handleReject = async (id: string) => {
    setBusyId(id);
    const response = await couponService.reject(id);
    if (!response.success) {
      toast.error(response.error?.message || "Could not reject this request.");
    } else {
      toast.success("Coupon request rejected.");
      await refresh();
    }
    setBusyId(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Coupons and Deals
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Flyer coupon requests
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Flyer codes are generated automatically. Verify each customer's bill
          before approving a one-time discount.
        </p>
      </header>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
          Coupon balance credited from approved discounts
        </p>
        <p className="mt-2 text-3xl font-black text-emerald-900">
          {formatInr(balance)}
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Pending customer requests
          </h2>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
            {requests.length}
          </span>
        </div>
        {isLoading ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No coupon requests are waiting for approval.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {request.customerName || "Customer"}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {request.discountPercent}% off · {request.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {request.businessName}
                      {request.requestedAt
                        ? ` · Requested ${new Date(request.requestedAt).toLocaleString("en-IN")}`
                        : ""}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                    <Clock size={12} /> Needs review
                  </span>
                </div>
                <form
                  onSubmit={(event) => void handleApprove(event, request)}
                  className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row"
                >
                  <label className="sr-only" htmlFor={`bill-${request.id}`}>
                    Total bill amount in rupees
                  </label>
                  <input
                    id={`bill-${request.id}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={billAmounts[request.id] || ""}
                    onChange={(event) =>
                      setBillAmounts((current) => ({
                        ...current,
                        [request.id]: event.target.value,
                      }))
                    }
                    placeholder="Enter total purchase amount (₹)"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                  <Button
                    type="submit"
                    disabled={busyId === request.id}
                    className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    <CircleCheck size={15} className="mr-1.5" />
                    Accept and apply
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busyId === request.id}
                    onClick={() => void handleReject(request.id)}
                    className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <X size={15} className="mr-1.5" />
                    Reject
                  </Button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          Approved discount history
        </h2>
        {transactions.length === 0 ? (
          <p className="rounded-xl bg-white p-5 text-sm text-slate-500">
            Approved flyer discounts will be recorded here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Bill total</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Balance credit</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(transaction.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">{formatInr(transaction.billAmount)}</td>
                    <td className="px-4 py-3">{transaction.discountPercent}%</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">
                      {formatInr(transaction.discountAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
