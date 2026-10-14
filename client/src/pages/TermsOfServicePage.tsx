import { Link } from 'react-router-dom';
import { ScrollText, ArrowLeft, CalendarDays, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { FloatingThemeToggle } from '@/components/ThemeToggle';
import { TERMS_EFFECTIVE_DATE, TERMS_SECTIONS } from '@/data/terms';

export const TermsOfServicePage = () => (
  <div className="min-h-screen bg-slate-50">
    <FloatingThemeToggle />
    {/* Hero */}
    <div className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-600/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl"
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
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
            <ScrollText size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">Eddy · Legal</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Terms of Service</h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-300">
          These Terms of Service govern your use of the Eddy platform — for business owners and customers alike.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/15">
          <CalendarDays size={13} />
          Effective date: {TERMS_EFFECTIVE_DATE}
        </p>
      </div>
    </div>

    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 sm:px-8">
      {/* Sections */}
      {TERMS_SECTIONS.map((section, i) => (
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
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
        <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white">
            <Mail size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-slate-900">Questions about these terms?</h2>
            <p className="text-sm text-slate-600">
              Reach the Eddy team at{' '}
              <a href="mailto:info@eddy.com" className="font-bold text-amber-700 hover:underline">
                thenightwingteam@gmail.com
              </a>{' '}
              for questions about your account, subscription, or these terms.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-xs leading-6 text-slate-400">
        Draft notice: this page mirrors a product terms-of-service draft and should be reviewed and finalized for
        Eddy’s legal entity, jurisdiction, contact details, and actual business practices before being published as the
        official legal terms.
      </p>

      <p className="pb-4 text-center text-xs text-slate-400">© 2026 Eddy. All rights reserved.</p>
    </div>
  </div>
);
