import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

type Feature = {
  icon: string;
  title: string;
  description: string;
  status: "Core workflow" | "Availability depends on integration" | "Planned / verify before launch";
};

const features: Feature[] = [
  {
    icon: "✦",
    title: "AI Flyer Generation",
    description:
      "Create promotional flyer drafts with AI assistance. Add your offer and campaign details, then review and edit the result before sharing it.",
    status: "Core workflow",
  },
  {
    icon: "#",
    title: "Hashtag Suggestions",
    description:
      "Get hashtag ideas for your campaign and social posts, helping you prepare promotional content more quickly.",
    status: "Core workflow",
  },
  {
    icon: "↗",
    title: "Social Media Publishing",
    description:
      "Prepare content for supported social platforms. Publishing availability depends on connected accounts, platform permissions, and integration status.",
    status: "Availability depends on integration",
  },
  {
    icon: "▥",
    title: "Campaign Insights",
    description:
      "Review the campaign and engagement information available through your connected services to help understand how promotions are performing.",
    status: "Availability depends on integration",
  },
  {
    icon: "▦",
    title: "Business QR Codes",
    description:
      "Let customers scan a business QR code to reach the relevant Eddy experience, offer, or promotion.",
    status: "Planned / verify before launch",
  },
  {
    icon: "◎",
    title: "Coupons and Rewards",
    description:
      "Encourage repeat visits with eligible offers, coupons, wallet coins, and reward-redemption experiences.",
    status: "Planned / verify before launch",
  },
];

function FeaturePageShell({ children }: { children: ReactNode }) {
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

      {children}

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
              <Link key={href} to={href} className="hover:text-indigo-700">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Eddy. Features and availability may vary by account,
            connected services, and product release.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-700">
        {feature.icon}
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{feature.title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
    </article>
  );
}

export const FeaturesPage = () => {
  return (
    <FeaturePageShell>
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
            <p className="mt-6 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
              Made for local businesses
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
              Everything you need to make your next promotion stand out.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Eddy brings promotional content creation and customer-engagement tools into one
              simple workspace, helping small businesses plan campaigns and connect with customers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/pricing"
                className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Explore pricing
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-1 shadow-xl">
            <div className="rounded-[1.35rem] bg-white/95 p-6 sm:p-8">
              <p className="text-sm font-semibold text-indigo-700">Your campaign workspace</p>
              <div className="mt-5 rounded-2xl bg-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Promotion preview</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Draft
                  </span>
                </div>
                <div className="mt-5 rounded-xl bg-gradient-to-br from-amber-100 to-pink-100 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                    Your business
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    A fresh offer.
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Create a promotion your customers will remember.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600">Flyer draft</span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600">Hashtag ideas</span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600">Customer offers</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Illustrative preview only. This is not a live campaign or a claim of campaign results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">What Eddy offers</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Tools to help you promote with confidence
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Spend less time switching between workflows and more time planning useful offers for your customers.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to plan your next promotion?
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Explore Eddy’s planned workflows and contact us if you want to learn more.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-indigo-50"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </FeaturePageShell>
  );
};
