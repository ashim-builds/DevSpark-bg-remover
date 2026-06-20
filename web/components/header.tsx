'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { logoutUser } from '@/lib/api';
import { useState } from 'react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-slate-800 bg-[#0f1115]/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-[#0f1115] font-bold text-lg">
            S
          </div>
          <span className="font-bold text-xl hidden sm:inline">SparkCut AI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm transition ${
                  isActive('/dashboard')
                    ? 'text-orange-500 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className={`text-sm transition ${
                  isActive('/pricing')
                    ? 'text-orange-500 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                API Pricing
              </Link>
              <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.credits} credits</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-lg bg-orange-500/20 px-4 py-2 text-sm text-orange-400 transition hover:bg-orange-500/30 disabled:opacity-50"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className={`text-sm transition ${
                  isActive('/pricing')
                    ? 'text-orange-500 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pricing
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <Link
                  href="/login"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-[#0f1115] transition hover:bg-orange-400"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
