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
    <main 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(140deg, #FEFDFB 0%, #F5F0E8 50%, rgba(37, 99, 235, 0.16) 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold" style={{ color: '#A0826D' }}>
            YAM
          </Link>
          <p className="mt-2 text-lg" style={{ color: '#1E40AF' }}>Professional Sign In</p>
        </div>

        <div 
          className="rounded-3xl p-8 lyft-panel"
          style={{ background: 'rgba(255, 255, 255, 0.8)' }}
        >
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#333333' }}>Welcome back</h1>

          {error && (
            <div 
              className="mb-4 p-4 rounded-xl text-sm border"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#EF4444',
                color: '#DC2626'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                style={{ 
                  borderColor: '#A0826D',
                  backgroundColor: '#FEFDFB',
                  color: '#333333'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#A0826D'}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                style={{ 
                  borderColor: '#A0826D',
                  backgroundColor: '#FEFDFB',
                  color: '#333333'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#A0826D'}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white smooth-transition hover:shadow-lg mt-2 lyft-primary-btn"
              style={{ 
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#5F4A42' }}>
            New professional?{' '}
            <Link 
              href="/signup" 
              className="font-semibold smooth-transition hover:underline"
              style={{ color: '#1E40AF' }}
            >
              Create an account
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(160, 130, 109, 0.2)' }}>
            <p className="text-sm text-center mb-2" style={{ color: '#5F4A42' }}>
              Looking for a service instead?
            </p>
            <Link 
              href="/client" 
              className="text-sm font-semibold smooth-transition hover:underline text-center block"
              style={{ color: '#1E40AF' }}
            >
              Go to Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
