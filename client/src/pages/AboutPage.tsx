import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

const values = [
  {
    number: "01",
    title: "Keep it simple",
    description:
      "Small businesses should be able to prepare promotions without needing a complicated collection of tools.",
  },
  {
    number: "02",
    title: "Make creativity accessible",
    description:
      "AI-assisted content workflows can help business owners get from an idea to a draft they can review and improve.",
  },
  {
    number: "03",
    title: "Bring engagement together",
    description:
      "Our product direction connects promotions with customer-facing experiences such as QR interactions, offers, and rewards.",
  },
];

export const AboutPage = () => {
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

      <section className="overflow-hidden bg-white">
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
              About Eddy
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
              Helping local businesses show up with confidence.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Eddy is being built to make digital promotion more approachable for small businesses.
              Our goal is to bring content creation and customer-engagement workflows into one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/features"
                className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Explore features
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-1 shadow-xl">
            <div className="rounded-[1.35rem] bg-white p-7 sm:p-9">
              <p className="text-sm font-semibold text-indigo-700">The idea behind Eddy</p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">
                Less tool-switching. More time for customers.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                From preparing a promotional draft to exploring customer offers, Eddy aims to make
                everyday marketing workflows easier to manage.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <span className="text-2xl">✦</span>
                  <p className="mt-2 font-semibold">Create</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Prepare campaign content.</p>
                </div>
                <div className="rounded-2xl bg-fuchsia-50 p-4">
                  <span className="text-2xl">◎</span>
                  <p className="mt-2 font-semibold">Engage</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Explore customer experiences.</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Product illustration. Feature availability depends on the current release and enabled integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Our purpose</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built around the needs of small businesses
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            We want everyday promotional work to feel more manageable, even for business owners
            who do not have a dedicated marketing team.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold tracking-widest text-indigo-600">{value.number}</p>
              <h3 className="mt-4 text-xl font-semibold">{value.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Have an idea or feedback for Eddy?
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                We’d like to hear what would make promoting your business easier.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-indigo-50"
            >
              Contact Eddy
            </Link>
          </div>
        </div>
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
              <Link key={href} to={href} className="hover:text-indigo-700">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Eddy. Product features and availability may evolve.
          </p>
        </div>
      </footer>
    </main>
  );
};
