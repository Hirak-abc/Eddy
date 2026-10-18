import { useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

type CookieCategory = "necessary" | "preferences" | "analytics" | "marketing";

type CookieSettings = Record<CookieCategory, boolean>;

const defaultSettings: CookieSettings = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

const cookieCategories: {
  id: CookieCategory;
  title: string;
  description: string;
  required?: boolean;
}[] = [
  {
    id: "necessary",
    title: "Strictly necessary cookies",
    description:
      "Help core site functions work, such as security, session handling, and remembering your privacy choice. These cannot be switched off in this demo settings panel.",
    required: true,
  },
  {
    id: "preferences",
    title: "Preference cookies",
    description:
      "Remember choices such as language or display preferences, if these features are implemented.",
  },
  {
    id: "analytics",
    title: "Analytics cookies",
    description:
      "Help understand how visitors use the site, if an analytics service is enabled.",
  },
  {
    id: "marketing",
    title: "Marketing cookies",
    description:
      "May be used to measure campaigns or personalize marketing, if such tools are enabled.",
  },
];

export const CookiePolicyPage = () => {
  const [settings, setSettings] = useState<CookieSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const updateSetting = (category: CookieCategory, checked: boolean) => {
    if (category === "necessary") return;
    setSettings((current) => ({ ...current, [category]: checked }));
    setSaved(false);
  };

  const saveSettings = () => {
    // Demo only: this stores choices in component state, not persistent browser storage.
    setSaved(true);
    setShowSettings(false);
  };

  const acceptOptional = () => {
    setSettings({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });
    setSaved(true);
    setShowSettings(false);
  };

  const rejectOptional = () => {
    setSettings({ ...defaultSettings });
    setSaved(true);
    setShowSettings(false);
  };

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
          <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-indigo-100">Privacy preferences</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Cookie Policy</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-indigo-100">
              Learn what cookies and similar technologies may do on Eddy, and manage optional categories in this demo panel.
            </p>
            <p className="mt-5 text-sm text-indigo-100">
              Draft for review — confirm the cookies and tracking tools actually used by the live site before publishing.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="grid gap-5 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <span aria-hidden="true" className="text-xl">🍪</span>
              </div>
              <h2 className="mt-4 text-lg font-bold">What are cookies?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cookies are small pieces of data stored by a website in your browser. Similar technologies may store or access information on your device.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <span aria-hidden="true" className="text-xl">🛡️</span>
              </div>
              <h2 className="mt-4 text-lg font-bold">Why they may be used</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Depending on the implementation, cookies may support security, keep a session active, remember preferences, measure usage, or support marketing.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Cookie preferences</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Choose which optional cookie categories you want to allow. Necessary cookies remain enabled in this example.
                </p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {saved ? "Preferences selected" : "No preferences saved"}
              </span>
            </div>

            <div className="mt-6 divide-y divide-slate-200">
              {cookieCategories.map((category) => (
                <div key={category.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{category.title}</h3>
                      {category.required && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          Always active
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                  </div>
                  <label className={`inline-flex shrink-0 items-center gap-3 ${category.required ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
                    <span className="text-sm font-medium text-slate-600">
                      {settings[category.id] ? "On" : "Off"}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings[category.id]}
                      disabled={category.required}
                      onChange={(event) => updateSetting(category.id, event.target.checked)}
                      className="h-5 w-5 accent-indigo-600"
                      aria-label={category.title}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={saveSettings}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={rejectOptional}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reject optional
              </button>
              <button
                type="button"
                onClick={acceptOptional}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => setShowSettings((current) => !current)}
                className="rounded-xl px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                {showSettings ? "Hide settings note" : "About these settings"}
              </button>
            </div>

            {showSettings && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                This component is a UI example. Preferences currently live only in React component state and will reset on refresh. Before launch, connect consent choices to a consent manager or persistent storage and ensure optional scripts do not run before the required consent is obtained.
              </div>
            )}

            {saved && (
              <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                Your selection is shown for this session only. It has not been stored persistently or applied to tracking scripts.
              </p>
            )}
          </div>

          <div className="mt-8 space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">How to manage cookies in your browser</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Most browsers let you view, block, or delete cookies in their privacy or site-settings controls. Blocking some cookies may affect sign-in or other site features. Browser controls do not necessarily manage every type of local storage or tracking technology.
              </p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">Policy updates and questions</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Eddy may update this policy when its technology or legal requirements change. Before publishing, add the effective date and ensure the policy accurately lists the cookies, providers, purposes, and retention periods used by the live site.
              </p>
              <Link to="/contact" className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                Contact Eddy
              </Link>
            </section>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Eddy. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="hover:text-indigo-700" to="/privacy">Privacy Policy</Link>
            <Link className="hover:text-indigo-700" to="/terms">Terms of Service</Link>
            <Link className="hover:text-indigo-700" to="/data-deletion">Data deletion</Link>
            <Link className="hover:text-indigo-700" to="/help-center">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
