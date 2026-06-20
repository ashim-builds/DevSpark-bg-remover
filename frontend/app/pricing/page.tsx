'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function PricingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const apiPlans = [
    {
      name: 'Starter',
      price: 'Rs. 999',
      requests: '1,000 API requests',
      features: [
        'Background removal API access',
        '1,000 monthly requests',
        'Standard support',
        'PNG output',
      ],
      cta: 'Get Started',
      featured: false,
    },
    {
      name: 'Professional',
      price: 'Rs. 2,999',
      requests: '10,000 API requests',
      features: [
        'Background removal API access',
        '10,000 monthly requests',
        'Priority support',
        'PNG + batch processing',
        'API documentation',
      ],
      cta: 'Get Started',
      featured: true,
    },
  ];

  const handlePurchase = (plan: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    // TODO: Implement payment flow
    alert(`${plan} plan selected. Payment coming soon.`);
  };

  return (
    <main className="min-h-screen bg-[#0f1115] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold">API Pricing</h1>
          <p className="mt-4 text-xl text-slate-400">
            Integrate our background removal API into your application
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {apiPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 transition-all ${
                plan.featured
                  ? 'border-2 border-orange-500 bg-[#1a1f2e] relative lg:scale-105'
                  : 'border border-slate-800 bg-[#12151c]'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 px-4 py-1 rounded-full text-sm font-semibold text-[#0f1115]">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-orange-500">{plan.price}</span>
                <p className="mt-2 text-slate-400">/month</p>
                <p className="mt-2 text-sm text-slate-300 font-semibold">{plan.requests}</p>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.name)}
                className={`w-full rounded-xl py-3 font-semibold transition ${
                  plan.featured
                    ? 'bg-orange-500 text-[#0f1115] hover:bg-orange-400'
                    : 'border border-slate-700 bg-[#0f1115] text-white hover:border-orange-500'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="rounded-3xl border border-slate-800 bg-[#12151c] p-12">
          <h2 className="mb-8 text-2xl font-bold">What's Included</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">REST API</h3>
              <p className="text-slate-400">Simple HTTP endpoints for background removal</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">Authentication</h3>
              <p className="text-slate-400">Secure API key management and usage tracking</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">Webhooks</h3>
              <p className="text-slate-400">Real-time notifications for processing status</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/10 p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-slate-400">
            Integrate our API and start removing backgrounds programmatically
          </p>
          {!user ? (
            <Link
              href="/register"
              className="inline-block rounded-xl bg-orange-500 px-8 py-3 font-semibold text-[#0f1115] transition hover:bg-orange-400"
            >
              Create Account
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block rounded-xl bg-orange-500 px-8 py-3 font-semibold text-[#0f1115] transition hover:bg-orange-400"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
