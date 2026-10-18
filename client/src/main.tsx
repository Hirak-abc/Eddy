// App entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import { CLERK_PUBLISHABLE_KEY } from './lib/constants';

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (!CLERK_PUBLISHABLE_KEY) {
  root.render(
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900">
      <section className="max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold">Clerk is not configured</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Set VITE_CLERK_PUBLISHABLE_KEY in the root .env file, then restart
          the client with <code>docker compose up -d --force-recreate client</code>.
        </p>
      </section>
    </main>,
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>,
  );
}
