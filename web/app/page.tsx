'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen bg-[#0f1115] px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-orange-300">SparkCut AI by DevSpark</p>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Remove backgrounds instantly with AI.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Upload any image, get a clean transparent background in seconds. No AI needed – simple, fast,
              and effective background removal.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={user ? '/dashboard' : '/login'}
                className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-[#0f1115] transition hover:bg-orange-400"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-200 transition hover:border-orange-500"
              >
                API Pricing
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-800 bg-[#12151c] p-8 shadow-[0_30px_100px_rgba(255,122,0,0.08)]">
            <div className="flex items-center gap-3 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-500 text-[#0f1115] font-bold">
                S
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-orange-300">SparkCut AI</p>
                <p className="text-xs text-slate-400">By DevSpark</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[#0f1115] p-6">
                <p className="text-sm text-slate-400">📤 Upload Image</p>
                <p className="mt-3 text-xl font-semibold text-white">PNG, JPG, WEBP</p>
              </div>
              <div className="rounded-3xl bg-[#0f1115] p-6">
                <p className="text-sm text-slate-400">⚡ Process Instantly</p>
                <p className="mt-3 text-xl font-semibold text-white">Remove Background</p>
              </div>
              <div className="rounded-3xl bg-[#0f1115] p-6">
                <p className="text-sm text-slate-400">⬇️ Download HD</p>
                <p className="mt-3 text-xl font-semibold text-white">Transparent PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-[#12151c] p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-slate-400">Process images in seconds without external dependencies</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#12151c] p-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
            <p className="text-slate-400">All images processed on our servers with enterprise security</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#12151c] p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">API Available</h3>
            <p className="text-slate-400">Integrate our API into your application for batch processing</p>
          </div>
        </div>
      </section>
    </main>
  );
}
