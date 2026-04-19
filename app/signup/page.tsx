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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

const PROFESSIONS = [
  'Mechanic',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'HVAC Technician',
  'Welder',
  'Mason',
];

export default function ProSignup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState(PROFESSIONS[0]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'locating'>('form');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStep('locating');

    // 1. Create Supabase Auth user
    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      setStep('form');
      return;
    }

    const user = data.user;
    if (!user) {
      setError('Signup failed. Please try again.');
      setLoading(false);
      setStep('form');
      return;
    }

    // 2. Get GPS location then register pro profile
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      setStep('form');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const res = await fetch(`${API_URL}/register-pro`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
            },
            body: JSON.stringify({
              pro: {
                full_name: fullName,
                profession,
                phone,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
              user_id: user.id,
            }),
          });

          if (res.ok) {
            router.push('/dashboard');
          } else {
            setError('Account created but profile sync failed. Please log in and contact support.');
            router.push('/login');
          }
        } catch {
          setError('Network error. Your account was created — please log in.');
          router.push('/login');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied. Enable GPS to complete registration.');
        setLoading(false);
        setStep('form');
      }
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-cyan-50 to-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-4">
            <span className="text-4xl font-black text-teal-600 italic">YAM</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Join the Pro Network</h1>
          <p className="text-slate-500">Start earning from clients near you</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-teal-900/10 p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-lg mt-0.5 flex-shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {step === 'locating' ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin mb-4"></div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Detecting your location...</h2>
              <p className="text-sm text-slate-500">Please allow location access when prompted</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="John Kamau"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email-signup" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email-signup"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password-signup" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Profession */}
              <div>
                <label htmlFor="profession-select" className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Profession
                </label>
                <select
                  id="profession-select"
                  title="Choose your profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors bg-slate-50 text-slate-900"
                >
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account & Go Live'
                )}
              </button>

              {/* Legal Note */}
              <p className="text-xs text-center text-slate-500 leading-relaxed">
                By signing up, you allow YAM to use your GPS location to match you with nearby clients. Last login and availability are shared with verified clients.
              </p>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-500 space-y-2">
          <p>
            <Link href="/help" className="hover:text-teal-600">Help</Link>
            {' • '}
            <Link href="/privacy" className="hover:text-teal-600">Privacy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-teal-600">Terms</Link>
          </p>
          <p>© {new Date().getFullYear()} YAM Professional Services</p>
        </div>
      </div>
    </main>
  );
}