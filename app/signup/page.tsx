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
  const [profession, setProfession] = useState('Mechanic');
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
            // Account created but profile sync failed — still redirect to login
            setError('Account created but profile sync failed. Please log in and contact support.');
            router.push('/login');
          }
        } catch {
          setError('Network error syncing your profile. Your account was created — please log in.');
          router.push('/login');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please enable GPS to complete registration.');
        setLoading(false);
        setStep('form');
      }
    );
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold text-blue-400">YAM</Link>
          <p className="text-slate-400 mt-2">Register as a Professional</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-1">Join the network</h1>
          <p className="text-slate-400 text-sm mb-6">
            Start receiving jobs from clients in your area.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {step === 'locating' ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Detecting your location...</p>
              <p className="text-slate-400 text-sm mt-2">Please allow location access when prompted.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. John Kamau"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="+254 712 345 678"
                />
              </div>

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
                  minLength={6}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your Profession</label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating account...' : 'Create Account & Go Live'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By signing up, you allow YAM to use your GPS location to match you with nearby clients.
              </p>
            </form>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}