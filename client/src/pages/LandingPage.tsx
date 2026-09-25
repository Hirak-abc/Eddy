import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  QrCode,
  TrendingUp,
  Gift,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              E
            </div>
            <span className="font-bold text-xl">Eddy</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            Marketing Automation for SMBs
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Turn Trends into{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Customers
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            AI-powered flyers, social publishing, and customer rewards—all in one platform.
            Built for local businesses who want to grow without the marketing headache.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/signin">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need to Grow</h2>
          <p className="text-lg text-muted-foreground">
            From flyer creation to customer retention, all on autopilot
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950/40">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI Flyers</h3>
              <p className="text-sm text-muted-foreground">
                Trend-based promotional content generated automatically. No design skills needed.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950/40">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">QR Rewards</h3>
              <p className="text-sm text-muted-foreground">
                One QR code. Instant rewards. Turn walk-ins into repeat customers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 text-sky-600 dark:bg-sky-950/40">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Real social reach, engagement, and ROI. See what's working.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-lg bg-amber-100 p-3 text-amber-600 dark:bg-amber-950/40">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customer Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Coins, discounts, streaks. Gamified loyalty that actually works.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-y border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Loved by Local Businesses</h2>
            <p className="text-lg text-muted-foreground">
              Real results from real business owners
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Rajesh Kumar',
                business: 'Kumar Sweets, Mumbai',
                review:
                  'Eddy tripled my Instagram reach in 2 weeks. Customers now come in asking about our flyers!',
              },
              {
                name: 'Priya Sharma',
                business: 'Glow Salon, Bangalore',
                review:
                  'QR rewards brought back 40% more repeat customers. Setup took 10 minutes.',
              },
              {
                name: 'Amit Patel',
                business: 'Cafe Aroma, Delhi',
                review:
                  "Finally, marketing that doesn't take hours. The AI knows what's trending before I do.",
              },
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">"{testimonial.review}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Simple. Automated. Effective.</h2>
          <p className="text-lg text-muted-foreground">
            Three steps to better marketing
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-8">
          {[
            {
              step: '1',
              title: 'Set Up Your Business',
              description:
                'Add your business details, upload 3 photos, connect Instagram/Facebook. Takes 5 minutes.',
            },
            {
              step: '2',
              title: 'AI Creates & Publishes',
              description:
                'Our AI finds trending topics, generates flyers, and publishes them automatically.',
            },
            {
              step: '3',
              title: 'Customers Engage & Return',
              description:
                'QR codes give instant rewards. Customers earn coins, you get repeat visits.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {item.step}
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Grow Your Business?</h2>
          <p className="mb-2 text-lg text-muted-foreground">
            Join hundreds of local businesses using Eddy
          </p>
          <p className="mb-8 text-3xl font-bold">₹299/month</p>
          <div className="mb-8 flex flex-col items-center gap-2">
            {[
              'AI-generated flyers',
              'Automatic social publishing',
              'QR rewards & customer wallet',
              'Real-time analytics',
              'Unlimited customers',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button size="lg" asChild>
            <Link to="/auth/signup">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Eddy. Built for local businesses, by local business lovers.</p>
        </div>
      </footer>
    </div>
  );
}
