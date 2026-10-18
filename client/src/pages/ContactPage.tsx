import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

type ContactForm = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  topic: "General enquiry",
  message: "",
};

export const ContactPage = () => {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState("");

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // This form opens the visitor's email app; it does not send/store data on a server.
    const subject = encodeURIComponent(`Eddy enquiry — ${form.topic}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:info@eddy.com?subject=${subject}&body=${body}`;
    setStatus(
      "Your email app should open with your message prepared. If it does not open, email info@eddy.com directly."
    );
  }

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
            Contact Eddy
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Let’s talk about your business.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Have a question, an idea, or feedback? Send us a message and tell us how we can help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-700">
              ✉
            </div>
            <h2 className="mt-4 text-lg font-semibold">Email us</h2>
            <p className="mt-2 leading-7 text-slate-600">
              For product questions, business enquiries, or general feedback, contact the Eddy team.
            </p>
            <a
              href="mailto:info@eddy.com"
              className="mt-3 inline-block font-semibold text-indigo-700 underline underline-offset-4"
            >
              info@eddy.com
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700">
              ?
            </div>
            <h2 className="mt-4 text-lg font-semibold">Need technical help?</h2>
            <p className="mt-2 leading-7 text-slate-600">
              If something is not working, visit the Support page for troubleshooting steps.
            </p>
            <Link to="/support" className="mt-3 inline-block font-semibold text-indigo-700 underline underline-offset-4">
              Visit Support →
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <h2 className="text-lg font-semibold">Privacy or deletion request?</h2>
            <p className="mt-2 leading-7 text-slate-300">
              Use our dedicated page for instructions on requesting account and data deletion.
            </p>
            <Link to="/data-deletion" className="mt-3 inline-block font-semibold text-white underline underline-offset-4">
              Account &amp; Data Deletion →
            </Link>
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Fill in the details below. Your email app will open with the message prepared for you to review and send.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-topic" className="mb-2 block text-sm font-semibold text-slate-700">
                What is this about?
              </label>
              <select
                id="contact-topic"
                name="topic"
                value={form.topic}
                onChange={(event) => updateField("topic", event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>General enquiry</option>
                <option>Business partnership</option>
                <option>Product feedback</option>
                <option>Technical support</option>
                <option>Pricing and billing</option>
                <option>Privacy or data deletion</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              Prepare email →
            </button>

            {status && (
              <p role="status" className="rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
                {status}
              </p>
            )}

            <p className="text-xs leading-5 text-slate-500">
              Please do not include passwords, one-time codes, API keys, or full payment-card details.
              This form does not submit information to an Eddy server.
            </p>
          </form>
        </section>
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
            © {new Date().getFullYear()} Eddy. Please confirm the contact email is active before launch.
          </p>
        </div>
      </footer>
    </main>
  );
};
