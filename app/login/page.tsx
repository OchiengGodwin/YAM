'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-cyan-50 to-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-4">
            <span className="text-4xl font-black text-teal-600 italic">YAM</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Sign in to your professional account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-teal-900/10 p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-lg mt-0.5 flex-shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs text-teal-600 hover:text-teal-700 font-semibold">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-medium">New here?</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Sign Up Link */}
          <div>
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Client Portal Link */}
        <div className="mt-8 p-4 rounded-xl bg-cyan-50 border border-teal-200">
          <p className="text-center text-sm text-slate-600 mb-2">
            Looking for a service?
          </p>
          <Link 
            href="/client"
            className="block text-center text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Go to Find a Pro →
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-500 space-y-2">
          <p>
            <Link href="/help" className="hover:text-blue-600">Help</Link>
            {' • '}
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-blue-600">Terms</Link>
          </p>
          <p>© {new Date().getFullYear()} YAM Professional Services</p>
        </div>
      </div>
    </main>
  );
}
