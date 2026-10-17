import { useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

const faqItems = [
  {
    question: "I can’t sign in to my Eddy account. What should I do?",
    answer:
      "Check that you are using the correct sign-in method and account details. Refresh the page and try again. If your account uses a third-party authentication provider, check that the provider is available. Never send your password or one-time code to support.",
  },
  {
    question: "The flyer or hashtag generator is not working.",
    answer:
      "Check your internet connection, refresh the page, and try again with a shorter prompt. If the issue continues, contact support and include the feature name, the approximate time, and any non-sensitive error message.",
  },
  {
    question: "Why can’t I publish to a social platform?",
    answer:
      "Publishing depends on the integration being enabled, your account being connected, the permissions granted, and the social platform’s own requirements. Reconnect the account if the app offers that option, then try again.",
  },
  {
    question: "A coupon or reward is not working.",
    answer:
      "Review the offer’s expiry date, eligibility rules, usage limits, and redemption status in the app. If it still appears incorrect, contact support with the offer name and a non-sensitive transaction reference, if available.",
  },
  {
    question: "How do I ask for account or data deletion?",
    answer:
      "Visit the Data Deletion page and follow the request instructions. Do not include passwords, authentication codes, API keys, or full payment-card details in your request.",
  },
  {
    question: "How do I report a security or privacy concern?",
    answer:
      "Contact Eddy through the published support email. Describe the concern without sharing secrets or sensitive information that is not necessary to investigate it.",
  },
];

export const SupportPage = () => {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = faqItems.filter((item) => {
    const search = query.trim().toLowerCase();
    return (
      !search ||
      item.question.toLowerCase().includes(search) ||
      item.answer.toLowerCase().includes(search)
    );
  });

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
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <p className="mt-6 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
            Eddy Support
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            We’re here to help you keep moving.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Find troubleshooting steps for your account, campaign tools, connected services, and customer offers.
          </p>
          <div className="mt-8 max-w-2xl">
            <label htmlFor="support-search" className="mb-2 block text-sm font-semibold text-slate-700">
              Search support questions
            </label>
            <input
              id="support-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “sign in”, “flyer”, or “rewards”"
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Troubleshooting</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Common questions</h2>
            </div>
            <span className="text-sm text-slate-500">{filteredFaqs.length} results</span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((item) => {
              const originalIndex = faqItems.indexOf(item);
              const isOpen = openFaq === originalIndex;
              return (
                <article key={item.question} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : originalIndex)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="font-semibold leading-6">{item.question}</span>
                    <span className={`text-xl text-indigo-600 transition ${isOpen ? "rotate-45" : ""}`}>＋</span>
                  </button>
                  {isOpen && <p className="px-5 pb-5 leading-7 text-slate-600 sm:px-6 sm:pb-6">{item.answer}</p>}
                </article>
              );
            })}
            {filteredFaqs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <h3 className="font-semibold">No matching questions</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Try another search term or contact the Eddy team.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-indigo-600 p-6 text-white">
            <div className="text-2xl">✉</div>
            <h2 className="mt-4 text-xl font-bold">Still need help?</h2>
            <p className="mt-2 leading-7 text-indigo-100">
              Send us a description of the issue and we’ll have the details needed to understand your question.
            </p>
            <Link to="/contact" className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 font-semibold text-indigo-700 transition hover:bg-indigo-50">
              Contact support
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Account and privacy</h2>
            <p className="mt-2 leading-7 text-slate-600">
              Need to manage your personal data or request account deletion?
            </p>
            <Link to="/data-deletion" className="mt-4 inline-block font-semibold text-indigo-700 underline underline-offset-4">
              Data deletion instructions →
            </Link>
            <Link to="/privacy" className="mt-3 block font-semibold text-indigo-700 underline underline-offset-4">
              Read Privacy Policy →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Stay safe</h2>
            <p className="mt-2 leading-7 text-slate-600">
              Never share your password, one-time codes, API keys, or full payment-card details with anyone claiming to be support.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:px-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            {[
              ["Features", "/features"],
              ["Pricing", "/pricing"],
              ["Documentation", "/documentation"],
              ["Help Center", "/help-center"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Data Deletion", "/data-deletion"],
              ["Cookies", "/cookies"],
            ].map(([label, href]) => (
              <Link key={href} to={href} className="hover:text-indigo-700">{label}</Link>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Eddy. Replace placeholder support contact details before launch if needed.
          </p>
        </div>
      </footer>
    </main>
  );
};
