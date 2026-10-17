import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

const planFeatures = [
  "AI-assisted promotional flyer drafts",
  "Hashtag suggestions for campaigns",
  "Business promotion workspace",
  "QR-based customer engagement",
  "Coupons and reward experiences",
  "Social publishing and analytics (where integrations are available)",
];

export const PricingPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="shadow-sm" style={{ backgroundColor: '#F8E7C9' }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex h-16 items-center">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-2 py-1 transition-all hover:scale-105"
              aria-label="Eddy home"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg shadow-md"
                style={{ backgroundColor: '#3A0CA3' }}
              >
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight" style={{ color: '#23262F' }}>
                Eddy
              </span>
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <p className="mt-6 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
            Straightforward pricing
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Marketing tools for your next stage of growth.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Explore Eddy’s proposed starter plan for small businesses. Final pricing, included limits, and billing terms should be confirmed before subscribing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <article className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-xl shadow-indigo-100/50">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white sm:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-100">Proposed plan</p>
            <h2 className="mt-3 text-3xl font-bold">Eddy Starter</h2>
            <p className="mt-3 max-w-lg leading-7 text-indigo-100">
              A starting point for local businesses that want help preparing promotions and engaging customers.
            </p>
            <div className="mt-7 flex flex-wrap items-end gap-x-2 gap-y-1">
              <span className="text-5xl font-black tracking-tight">₹299</span>
              <span className="pb-1 text-indigo-100">/ month (proposed)</span>
            </div>
          </div>

          <div className="p-7 sm:p-9">
            <h3 className="text-lg font-semibold">Proposed plan features</h3>
            <ul className="mt-5 space-y-4">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-slate-700">
                  <span aria-hidden="true" className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>
                  <span className="leading-6">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-700">
              Ask about this plan
            </Link>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              This is a proposed price, not a live subscription offer. Confirm feature availability and usage limits before launch.
            </p>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-16 sm:px-8 md:grid-cols-3 sm:pb-20">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-2xl">⌁</div>
          <h2 className="mt-4 text-lg font-semibold">Clear plan details</h2>
          <p className="mt-2 leading-7 text-slate-600">Show the plan price, billing cycle, and feature limits clearly before a customer pays.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-2xl">↻</div>
          <h2 className="mt-4 text-lg font-semibold">Understand renewals</h2>
          <p className="mt-2 leading-7 text-slate-600">If recurring billing is enabled, explain renewal dates and cancellation steps at checkout.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-2xl">?</div>
          <h2 className="mt-4 text-lg font-semibold">Need a hand?</h2>
          <p className="mt-2 leading-7 text-slate-600">Contact the Eddy team with questions about the proposed plan or your business needs.</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Questions before choosing a plan?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">Talk to the Eddy team about availability, features, and pricing.</p>
            </div>
            <Link to="/contact" className="inline-flex justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-indigo-50">
              Contact Eddy
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:px-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            {[
              ["Features", "/features"], ["About", "/about"], ["Documentation", "/documentation"],
              ["Help Center", "/help-center"], ["Privacy", "/privacy"], ["Terms", "/terms"],
              ["Data Deletion", "/data-deletion"], ["Cookies", "/cookies"],
            ].map(([label, href]) => <Link key={href} to={href} className="hover:text-indigo-700">{label}</Link>)}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Eddy. Final plan details and availability should be confirmed before checkout.
          </p>
        </div>
      </footer>
    </main>
  );
};
