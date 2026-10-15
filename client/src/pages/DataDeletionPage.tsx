import { Link } from 'react-router-dom';
import {
  Trash2,
  ArrowLeft,
  CalendarDays,
  Mail,
  ShieldCheck,
  Clock,
  ExternalLink,
  ListChecks,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { FloatingThemeToggle } from '@/components/ThemeToggle';
import {
  DATA_DELETION_CONTACT_EMAIL,
  DATA_DELETION_EFFECTIVE_DATE,
  DATA_DELETION_MAILTO_BODY,
  DATA_DELETION_MAILTO_SUBJECT,
  DATA_DELETION_SECTIONS,
} from '@/data/dataDeletion';

const mailtoHref = `mailto:${DATA_DELETION_CONTACT_EMAIL}?subject=${encodeURIComponent(
  DATA_DELETION_MAILTO_SUBJECT,
)}&body=${encodeURIComponent(DATA_DELETION_MAILTO_BODY)}`;

const STEPS = [
  {
    title: 'Request',
    body: 'Use the email button below, in-app Settings, or remove Eddy from Meta Apps & Websites.',
  },
  {
    title: 'Verify',
    body: 'We confirm it is your account via signed-in session or reply to your login email.',
  },
  {
    title: 'Delete',
    body: 'Tokens revoked, personal & Meta-derived data deleted/anonymized within 30 days.',
  },
] as const;

export const DataDeletionPage = () => (
  <div className="min-h-screen bg-slate-50">
    <FloatingThemeToggle />
    {/* Hero */}
    <div className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-600/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl"
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
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
            <Trash2 size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
              Eddy · Legal
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              User Data Deletion
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-300">
          How to request deletion of your Eddy data — including data received from
          Instagram and Facebook. This page serves as Eddy&apos;s public Data Deletion
          Instructions for Meta App Review and for all users.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/15">
          <CalendarDays size={13} />
          Effective date: {DATA_DELETION_EFFECTIVE_DATE}
        </p>
      </div>
    </div>

    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 sm:px-8">
      {/* Quick actions */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-emerald-700" />
            <h2 className="font-extrabold text-slate-900">Request deletion in 1 click</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-emerald-100 bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                  {i + 1}
                </span>
                <p className="mt-2 text-sm font-bold text-slate-900">{step.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <Mail size={16} />
              Email deletion request
            </a>
            <Link
              to="/privacy"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ShieldCheck size={16} />
              Read Privacy Policy
            </Link>
          </div>
          <p className="text-xs leading-6 text-slate-500">
            Email opens with a pre-filled template to {DATA_DELETION_CONTACT_EMAIL}. Send it
            from your Eddy login email so we can verify ownership. Prefer in-app? Go to
            Settings &gt; Delete account / Request data deletion.
          </p>
        </CardContent>
      </Card>

      {/* Meta-specific note */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-emerald-700" />
            <h2 className="font-extrabold text-slate-900">Connected via Facebook or Instagram?</h2>
          </div>
          <p className="text-sm leading-7 text-slate-600">
            Disconnect anytime in Eddy under Owner &gt; Social &gt; Disconnect, or remove Eddy
            via Facebook Settings &gt; Apps and Websites / Instagram Settings &gt; Apps and
            Websites. Meta will also notify us automatically when you remove Eddy, and we
            treat that notification as a deletion request for Meta-derived data. To delete
            all stored Eddy data as well, still send the email request above.
          </p>
          <p className="text-xs leading-6 text-slate-500">
            Meta documentation:{' '}
            <a
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
              href="https://www.facebook.com/help/170585223002660"
              target="_blank"
              rel="noreferrer"
            >
              How to remove an app from Facebook <ExternalLink size={12} />
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      {DATA_DELETION_SECTIONS.map((section, i) => (
        <section key={section.title} id={`section-${i + 1}`} className="scroll-mt-6">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      ))}

      {/* Contact */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
        <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Mail size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-slate-900">Need help with deletion?</h2>
            <p className="text-sm text-slate-600">
              Email{' '}
              <a
                href={mailtoHref}
                className="font-bold text-emerald-700 hover:underline"
              >
                {DATA_DELETION_CONTACT_EMAIL}
              </a>{' '}
              with your account email and confirmation code (if any).
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-xs leading-6 text-slate-400">
        Draft notice: review with Eddy&apos;s legal owner for entity, jurisdiction, and
        retention obligations (wallet/transaction, Razorpay, audit logs) before relying on
        this as the final published policy.
      </p>

      <p className="pb-4 text-center text-xs text-slate-400">© 2026 Eddy. All rights reserved.</p>
    </div>
  </div>
);
