/// <reference types="node" />

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
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
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold text-blue-400">YAM</Link>
          <p className="text-slate-400 mt-2">Professional Sign In</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-6">Welcome back</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            New professional?{' '}
            <Link href="/signup" className="text-blue-400 font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-700 text-center">
            <p className="text-slate-500 text-sm">Looking for a service instead?</p>
            <Link href="/client" className="text-blue-400 text-sm font-medium hover:underline">
              Go to Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
