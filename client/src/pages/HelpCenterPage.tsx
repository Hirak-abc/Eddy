import { useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

type HelpArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
};

const articles: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting started with Eddy",
    category: "Account & setup",
    summary: "A quick path for setting up your business workspace.",
    steps: [
      "Create an account using one of the sign-in methods available in your Eddy deployment.",
      "Complete your business profile with accurate details.",
      "Choose your preferred language if that option is available.",
      "Open the relevant tool from your dashboard and follow the on-screen instructions.",
    ],
  },
  {
    id: "create-content",
    title: "Create a promotional post",
    category: "Posts & campaigns",
    summary: "Prepare a promotional creative for your shop or campaign.",
    steps: [
      "Open the post or flyer creation area in your dashboard.",
      "Enter the campaign goal, offer details, and any required business information.",
      "Review the generated content carefully and correct any inaccurate details.",
      "Preview the result before downloading or publishing it, if those actions are enabled.",
    ],
  },
  {
    id: "hashtags",
    title: "Get hashtag ideas",
    category: "Posts & campaigns",
    summary: "Use suggested hashtags to help organize your post.",
    steps: [
      "Open the hashtag suggestion tool, if enabled in your version of Eddy.",
      "Describe the product, service, event, or audience for your post.",
      "Review suggestions and keep only relevant, accurate hashtags.",
      "Check each social platform's current rules and limits before posting.",
    ],
  },
  {
    id: "social-accounts",
    title: "Connect or publish to social media",
    category: "Social media",
    summary: "Understand what to check before connecting a social account.",
    steps: [
      "Open the social accounts or publishing section, if it is available.",
      "Follow the platform's authorization flow and review the permissions requested.",
      "Confirm that the selected account or page is the correct one.",
      "If publishing is unavailable, use the download or copy option if provided and publish directly on the platform.",
    ],
  },
  {
    id: "qr-rewards",
    title: "QR codes, coupons, and rewards",
    category: "Offers & rewards",
    summary: "Prepare an in-store offer and explain its terms clearly.",
    steps: [
      "Open the QR code or offer tool if it is enabled for your account.",
      "Set clear offer details, eligibility, validity dates, and redemption conditions.",
      "Test the QR code and redemption flow before displaying it to customers.",
      "Explain any reward or coupon restrictions at the point of use.",
    ],
  },
  {
    id: "billing",
    title: "Plans and billing",
    category: "Account & setup",
    summary: "Check plan details before paying or upgrading.",
    steps: [
      "Review the plan and price shown inside your current Eddy deployment.",
      "Check the billing period, included features, renewal terms, and cancellation rules.",
      "Do not rely on example prices shown in mockups or drafts as an active offer.",
      "Contact the Eddy team through the official support channel if a payment looks incorrect.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy and deleting your data",
    category: "Privacy & security",
    summary: "Find out how to request help with account data.",
    steps: [
      "Use the privacy or data-deletion page linked on the website, if available.",
      "Submit a request through the official contact channel published by Eddy.",
      "Include the account identifier needed to locate your account, but never send your password or verification codes.",
      "Wait for confirmation and ask what information will be deleted and whether any records must be retained.",
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshoot a page or feature",
    category: "Troubleshooting",
    summary: "Try a few safe checks when something is not working.",
    steps: [
      "Refresh the page and check your internet connection.",
      "Make sure you are signed in to the correct account and try again.",
      "If appropriate, try a current version of another browser.",
      "Record the page name, what you clicked, the error message, and the approximate time before contacting support.",
    ],
  },
];

const categories = [
  "All topics",
  "Account & setup",
  "Posts & campaigns",
  "Social media",
  "Offers & rewards",
  "Privacy & security",
  "Troubleshooting",
];

export const HelpCenterPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All topics");
  const [openArticle, setOpenArticle] = useState<string | null>("getting-started");

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All topics" || article.category === activeCategory;
      const searchableText = [
        article.title,
        article.category,
        article.summary,
        ...article.steps,
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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

      <main>
        <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white">
          <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-20">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-indigo-100">
              Eddy Help Center
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              How can we help?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Browse step-by-step guides for setting up your business, creating
              promotions, and troubleshooting common issues.
            </p>
            <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 shadow-xl">
              <span className="pl-3 text-xl text-slate-400" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search help articles..."
                aria-label="Search help articles"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-slate-900 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                Browse by topic
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                {categories.map((category) => {
                  const selected = category === activeCategory;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                        selected
                          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                          : "text-slate-600 hover:bg-white hover:text-indigo-700"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </aside>

            <div>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Help articles
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Practical answers for common Eddy tasks.
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                  {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <h3 className="text-lg font-bold">No articles found</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Try a different search phrase or choose another topic.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All topics");
                    }}
                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Show all articles
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => {
                    const isOpen = openArticle === article.id;
                    return (
                      <article
                        key={article.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenArticle(isOpen ? null : article.id)}
                          className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                        >
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                              {article.category}
                            </span>
                            <h3 className="mt-1 text-lg font-bold">{article.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {article.summary}
                            </p>
                          </div>
                          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-100 px-5 pb-6 pt-4 sm:px-6">
                            <ol className="space-y-3">
                              {article.steps.map((step, index) => (
                                <li key={`${article.id}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-700">
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                                    {index + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
          <div className="rounded-3xl bg-slate-900 px-6 py-10 text-center text-white sm:px-10">
            <h2 className="text-2xl font-bold">Still need a hand?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-300">
              If these guides do not solve your issue, send the Eddy team a message
              with the page name and any error you see.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-indigo-50"
            >
              Contact support
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Eddy. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="hover:text-indigo-700" to="/documentation">Documentation</Link>
            <Link className="hover:text-indigo-700" to="/support">Support</Link>
            <Link className="hover:text-indigo-700" to="/privacy">Privacy</Link>
            <Link className="hover:text-indigo-700" to="/terms">Terms</Link>
            <Link className="hover:text-indigo-700" to="/data-deletion">Data deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
