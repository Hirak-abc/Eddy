import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CalendarDays, ListOrdered, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_SECTIONS } from '@/data/privacy';

export const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-slate-50">
    {/* Hero */}
    <div className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">Eddy · Legal</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Privacy Policy</h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-300">
          This Privacy Policy explains how Eddy collects, uses, stores, and shares information when you use the
          Eddy platform — for business owners and customers alike.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/15">
          <CalendarDays size={13} />
          Effective date: {PRIVACY_EFFECTIVE_DATE}
        </p>
      </div>
    </div>

    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 sm:px-8">
      {/* Contents */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-500">
            <ListOrdered size={15} />
            Contents · {PRIVACY_SECTIONS.length} sections
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {PRIVACY_SECTIONS.map((section, i) => (
              <a
                key={section.title}
                href={`#section-${i + 1}`}
                className="group flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100 transition-all hover:bg-indigo-50 hover:ring-indigo-200"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-black text-white transition-colors group-hover:bg-indigo-600">
                  {i + 1}
                </span>
                <span className="truncate text-xs font-bold text-slate-700 group-hover:text-indigo-900">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      {PRIVACY_SECTIONS.map((section, i) => (
        <section key={section.title} id={`section-${i + 1}`} className="scroll-mt-6">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{section.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      ))}

      {/* Contact */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-white">
        <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Mail size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-slate-900">Questions about your data?</h2>
            <p className="text-sm text-slate-600">
              Reach the Eddy team at{' '}
              <a href="mailto:info@eddy.com" className="font-bold text-indigo-700 hover:underline">
                info@eddy.com
              </a>{' '}
              for access, correction, or deletion requests.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-xs leading-6 text-slate-400">
        Draft notice: this page mirrors the product privacy-policy draft and should be reviewed and finalized for
        Eddy’s legal entity, jurisdiction, contact details, and actual data practices before being published as the
        official legal policy.
      </p>

      <p className="pb-4 text-center text-xs text-slate-400">© 2026 Eddy. All rights reserved.</p>
    </div>
  </div>
);
