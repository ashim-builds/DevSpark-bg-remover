'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser(data.email, data.password);
      const profile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        credentials: 'include',
      }).then((r) => r.json());

      setUser(profile.profile);
      setAccessToken('authenticated');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f1115] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-[#12151c] p-8 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500 text-[#0f1115] font-bold">
              S
            </div>
            <h1 className="text-2xl font-semibold text-white">SparkCut AI</h1>
            <p className="mt-2 text-sm text-slate-400">Remove backgrounds instantly</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-xl border border-slate-700 bg-[#0f1115] px-4 py-2.5 text-white placeholder-slate-500 transition focus:border-orange-500 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full rounded-xl border border-slate-700 bg-[#0f1115] px-4 py-2.5 text-white placeholder-slate-500 transition focus:border-orange-500 focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-2.5 font-semibold text-[#0f1115] transition hover:bg-orange-400 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-orange-400 hover:text-orange-300">
              Sign up
            </Link>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#12151c] px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`)}
            className="mt-6 w-full rounded-xl border border-slate-700 bg-[#0f1115] py-2.5 text-white transition hover:border-orange-500"
          >
            Google
          </button>
        </div>
      </div>
    </main>
  );
}
