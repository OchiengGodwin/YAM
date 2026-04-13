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
    <main 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #FEFDFB 0%, #F5F0E8 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold" style={{ color: '#A0826D' }}>
            YAM
          </Link>
          <p className="mt-2 text-lg" style={{ color: '#5F4A42' }}>Become a Professional</p>
        </div>

        <div 
          className="rounded-3xl p-8 glass-effect"
          style={{ background: 'rgba(255, 255, 255, 0.8)' }}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>Join the network</h1>
          <p className="text-sm mb-6" style={{ color: '#5F4A42' }}>
            Start earning by receiving jobs from clients near you.
          </p>

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

          {step === 'locating' ? (
            <div className="text-center py-10">
              <div 
                className="w-12 h-12 rounded-full animate-spin mx-auto mb-4 border-4"
                style={{ 
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  borderTopColor: '#3B82F6'
                }}
              />
              <p className="font-semibold" style={{ color: '#333333' }}>Detecting your location...</p>
              <p className="text-sm mt-2" style={{ color: '#5F4A42' }}>Please allow location access when prompted.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                  style={{ 
                    borderColor: '#A0826D',
                    backgroundColor: '#FEFDFB',
                    color: '#333333'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = '#A0826D'}
                  placeholder="e.g. John Kamau"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                  style={{ 
                    borderColor: '#A0826D',
                    backgroundColor: '#FEFDFB',
                    color: '#333333'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = '#A0826D'}
                  placeholder="+254 712 345 678"
                />
              </div>

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
                  minLength={6}
                  className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                  style={{ 
                    borderColor: '#A0826D',
                    backgroundColor: '#FEFDFB',
                    color: '#333333'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = '#A0826D'}
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label htmlFor="profession" className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                  Your Profession
                </label>
                <select
                  id="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                  style={{ 
                    borderColor: '#A0826D',
                    backgroundColor: '#FEFDFB',
                    color: '#333333'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = '#A0826D'}
                >
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white smooth-transition hover:shadow-lg mt-2"
                style={{ 
                  backgroundColor: '#A0826D',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Creating account...' : 'Create Account & Go Live'}
              </button>

              <p className="text-xs text-center" style={{ color: '#5F4A42' }}>
                By signing up, you allow YAM to use your GPS location to match you with nearby clients.
              </p>
            </form>
          )}

          <p className="text-center text-sm mt-6" style={{ color: '#5F4A42' }}>
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold smooth-transition hover:underline"
              style={{ color: '#3B82F6' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}