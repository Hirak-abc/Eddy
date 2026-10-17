import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

type GuideSection = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

const guideSections: GuideSection[] = [
  {
    id: "account",
    title: "1. Create an account",
    summary: "Start with the Eddy account type that matches how you want to use the platform.",
    steps: [
      "Open Eddy and choose the business-owner or customer experience, if both options are available.",
      "Follow the sign-in or sign-up flow displayed in the app.",
      "Enter accurate details and keep your sign-in method secure.",
      "Complete any onboarding steps shown after registration.",
    ],
  },
  {
    id: "business",
    title: "2. Set up your business profile",
    summary: "Business owners should review their profile before preparing promotions.",
    steps: [
      "Open your business profile or account settings.",
      "Check the business name and other details for accuracy.",
      "Upload only logos, photos, and content you have permission to use.",
      "Save the changes if the interface provides a save action.",
    ],
  },
  {
    id: "flyers",
    title: "3. Prepare promotional content",
    summary: "Use the available content tools to prepare a draft for your campaign.",
    steps: [
      "Open the flyer or content-generation feature, if it is enabled for your account.",
      "Describe the promotion and include the details customers need to know.",
      "Review the generated draft carefully and edit inaccurate or unsuitable content.",
      "Check prices, dates, offer conditions, spelling, and image rights before sharing.",
    ],
  },
  {
    id: "hashtags",
    title: "4. Generate hashtag ideas",
    summary: "Use hashtag suggestions as a starting point, not a guarantee of reach.",
    steps: [
      "Open the hashtag suggestion tool, if available.",
      "Enter the campaign topic or product details.",
      "Review suggestions for relevance and remove misleading or unrelated tags.",
      "Follow the rules and character limits of the social platform where you plan to post.",
    ],
  },
  {
    id: "social",
    title: "5. Connect social accounts",
    summary: "Connected social features depend on the integrations enabled in your Eddy release.",
    steps: [
      "Open the supported social-account connection flow.",
      "Review the permissions requested by the social platform before approving them.",
      "If publishing or analytics are unavailable, check the connection status and account eligibility.",
      "Do not share your social account password or API credentials with support.",
    ],
  },
  {
    id: "offers",
    title: "6. Use QR codes, coupons, and rewards",
    summary: "Follow the conditions shown for each participating business offer.",
    steps: [
      "Open the relevant QR, offer, coupon, or reward experience in Eddy, if available.",
      "Read the offer’s expiry date, eligibility rules, and usage limits.",
      "Follow the on-screen steps to scan or redeem the offer.",
      "If a reward appears incorrect, contact support with the offer details and a non-sensitive reference.",
    ],
  },
  {
    id: "privacy",
    title: "7. Manage privacy and account data",
    summary: "Use the published privacy resources for questions about your information.",
    steps: [
      "Read the Privacy Policy to understand the information Eddy may process.",
      "For account or personal-data deletion, visit the Data Deletion page.",
      "Use the published contact method for access, correction, or other privacy requests.",
      "Never include passwords, one-time codes, API keys, or full payment-card details in a request.",
    ],
  },
];

export const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState("account");
  const activeGuide = guideSections.find((section) => section.id === activeSection) ?? guideSections[0];

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
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
            Eddy Documentation
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            A guide to getting started with Eddy.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Follow these guides to understand the main workflows. The options you see can vary by account,
            integration status, and the version of Eddy you use.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Guides
          </p>
          <nav aria-label="Documentation sections" className="space-y-1">
            {guideSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                aria-current={activeSection === section.id ? "page" : undefined}
                className={`w-full rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === section.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">Need assistance?</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If a step does not match your screen, contact the Eddy team.
            </p>
            <Link to="/contact" className="mt-3 inline-block text-sm font-semibold text-indigo-700 underline underline-offset-4">
              Contact support →
            </Link>
          </div>
        </aside>

        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Getting started</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">{activeGuide.title}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">{activeGuide.summary}</p>
          <div className="mt-8 space-y-5">
            {activeGuide.steps.map((step, index) => (
              <div key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                  {index + 1}
                </span>
                <p className="pt-1 leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-950">Please note</h3>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              This guide describes general workflows. It does not confirm that every feature is currently enabled
              in your deployment. Keep the instructions aligned with the actual Eddy interface before publishing.
            </p>
          </div>
        </article>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:px-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            {[
              ["Features", "/features"], ["Pricing", "/pricing"], ["About", "/about"],
              ["Help Center", "/help-center"], ["Privacy", "/privacy"], ["Terms", "/terms"],
              ["Data Deletion", "/data-deletion"], ["Cookies", "/cookies"],
            ].map(([label, href]) => (
              <Link key={href} to={href} className="hover:text-indigo-700">{label}</Link>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Eddy. Documentation should be updated when product workflows change.
          </p>
        </div>
      </footer>
    </main>
  );
};
