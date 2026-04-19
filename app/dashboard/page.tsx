'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Chat from '../components/Chat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [proProfile, setProProfile] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [incomingJob, setIncomingJob] = useState<any>(null);
  const [activeJob, setActiveJob] = useState<any>(null);

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? '';
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: proData } = await supabase
        .from('pro_services')
        .select('*')
        .eq('id', user.id)
        .single();
      if (proData) {
        setProProfile(proData);
        setIsOnline(proData.is_available);
      }

      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('pro_id', user.id)
        .eq('status', 'accepted')
        .single();
      if (jobData) setActiveJob(jobData);
      setLoading(false);
    };

    init();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const poll = async () => {
      const token = await getAccessToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, activeRes] = await Promise.all([
        fetch(`${API_URL}/jobs/pro/me/pending`, { headers }),
        fetch(`${API_URL}/jobs/pro/me/active`, { headers }),
      ]);

      if (activeRes.ok) {
        const activePayload = await activeRes.json();
        setActiveJob(activePayload.data ?? null);
      }

      if (pendingRes.ok) {
        const pendingPayload = await pendingRes.json();
        setIncomingJob(pendingPayload.data ?? null);
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleStatus = async () => {
    if (toggling) return;
    setToggling(true);
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    try {
      const token = await getAccessToken();
      await fetch(`${API_URL}/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pro_id: user.id, is_available: newStatus }),
      });
    } catch {
      await supabase.from('pro_services').update({ is_available: newStatus }).eq('id', user.id);
    }
    setToggling(false);
  };

  const handleAcceptJob = async (job: any) => {
    const token = await getAccessToken();
    await fetch(`${API_URL}/jobs/${job.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: 'accepted' }),
    });
    setActiveJob(job);
    setIncomingJob(null);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${job.customer_lat},${job.customer_lng}&travelmode=driving`,
      '_blank'
    );
  };

  const handleDeclineJob = async (job: any) => {
    const token = await getAccessToken();
    await fetch(`${API_URL}/jobs/${job.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: 'declined' }),
    });
    setIncomingJob(null);
  };

  const completeJob = async () => {
    if (!activeJob) return;
    const token = await getAccessToken();
    await fetch(`${API_URL}/jobs/${activeJob.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: 'completed' }),
    });
    setActiveJob(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-blue-50">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full animate-spin mx-auto mb-3 border-4 border-slate-300 border-t-blue-700" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black tracking-tight text-blue-700 italic">YAM</span>
            <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
              <a href="#">Find a Pro</a>
              <a href="#">Services</a>
              <a href="#">How It Works</a>
            </div>
          </div>
          <button className="rounded-xl px-4 py-2 text-blue-600 font-semibold hover:bg-slate-50 transition" onClick={signOut}>
            Sign Out
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-12">
            <section className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-end md:items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                  <img
                    className="relative w-48 h-48 rounded-full object-cover border-4 border-slate-100 shadow-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr85I6Xg-KS7knOThXGJjM8_YBRSfBLIW_k0-Spev4dH7GSh701X-ACCLxoOvF7k_wqcYBOcUnaX9w6yTWqLIQ7j-10069VdiGVBlEq90gYMBkNY-vtha4gYeWDQIKA6IJrtKgZORJY8KCv5DIQh2VSetdygjG6taCBmJ_fOYRSbkAkjOk_Cfoui-z2kI5yZ2KPvAidiSZQ8hq6kD2WN33VdBHO_HctMwtQeFRU7xzyYxjwdClS3STCI8gH8x89y6ZBHuWCfxGIIP6"
                    alt="Professional profile"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">{proProfile?.full_name ?? 'Professional'}</h1>
                    <div className="bg-emerald-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="text-xs font-bold uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                  <p className="text-xl text-slate-500 font-light max-w-lg">
                    {proProfile?.summary ?? 'Master Diagnostic Technician with 15+ years specializing in European and Luxury imports.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-blue-600">star</span>
                      <span className="font-bold text-lg">{proProfile?.rating ?? '4.9'}</span>
                      <span className="text-sm">({proProfile?.reviews_count ?? 248} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[20px] text-slate-500">location_on</span>
                      <span className="text-sm font-medium">{proProfile?.location ?? 'Downtown, San Francisco'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">The Consultant&apos;s Approach</h2>
              <div className="relative">
                <span className="absolute -left-8 top-0 text-6xl text-slate-100 font-serif italic select-none">“</span>
                <p className="text-2xl font-light text-slate-900 leading-relaxed italic font-serif">
                  {proProfile?.quote ?? 'Modern automotive care is as much about precision engineering as it is about transparent communication. My goal is to bridge the gap between complex mechanics and the driver’s peace of mind.'}
                </p>
              </div>
              <p className="text-slate-500 leading-loose max-w-2xl">
                {proProfile?.bio ?? 'With a career spanning over a decade at high-performance centers, Marcus J. provides a boutique maintenance experience for discerning owners. He specializes in intricate electrical diagnostics, precision brake systems, and performance tuning for Audi, BMW, and Porsche. Every service begins with a digital health report—no jargon, just clarity.'}
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Expertise & Services</h2>
                <span className="text-sm font-medium text-blue-600">View Full Rate Sheet</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-8 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-blue-600 mb-4 block text-[2.5rem]">precision_manufacturing</span>
                  <h3 className="text-xl font-bold mb-2">Engine Diagnostics</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Comprehensive computer analysis and physical inspection of powertrain systems for peak efficiency.</p>
                </div>
                <div className="p-8 rounded-full bg-amber-100 border border-slate-200 hover:bg-amber-50 transition-colors">
                  <span className="material-symbols-outlined text-amber-700 mb-4 block text-[2.5rem]">settings_input_component</span>
                  <h3 className="text-xl font-bold mb-2">Brake Repair</h3>
                  <p className="text-sm text-slate-900">Performance pad and rotor replacement with sensor calibration.</p>
                </div>
                <div className="p-8 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-blue-600 mb-4 block text-[2.5rem]">oil_barrel</span>
                  <h3 className="text-xl font-bold mb-2">Oil Service</h3>
                  <p className="text-sm text-slate-500">Synthetic fluid management including filter and gasket inspection.</p>
                </div>
                <div className="md:col-span-2 p-8 rounded-full bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors">
                  <div className="flex items-start gap-6">
                    <span className="material-symbols-outlined text-emerald-600 text-4xl">security</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Pre-Purchase Inspection</h3>
                      <p className="text-sm text-slate-500">A 120-point digital inspection designed for classic and luxury vehicle acquisitions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8 pt-12">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Client Testimonials</h2>
              <div className="space-y-6">
                <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">EL</div>
                      <div>
                        <h4 className="font-bold text-slate-900">Eleanor L.</h4>
                        <p className="text-xs text-slate-500">Tesla Model S Owner</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className="material-symbols-outlined text-amber-700 text-sm">star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 italic">"Marcus is the only person I trust with my vehicle. He explained the suspension issue in a way that actually made sense, and the repair was flawless."</p>
                </div>
                <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-700">RJ</div>
                      <div>
                        <h4 className="font-bold text-slate-900">Robert J.</h4>
                        <p className="text-xs text-slate-500">Porsche 911 Collector</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className="material-symbols-outlined text-amber-700 text-sm">star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 italic">"Exceptional attention to detail. The workshop was pristine and the digital report provided after the oil service was the most detailed I've ever seen."</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 sticky top-28">
            <div className="bg-white p-8 rounded-full border border-slate-200 shadow-2xl space-y-8">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-blue-700">$145</span>
                  <span className="text-sm text-slate-500 font-medium">/ hour</span>
                </div>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">event_available</span>
                  Available Next: {proProfile?.next_available ?? 'Oct 24, 9:00 AM'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="service-type" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Service Type</label>
                  <select id="service-type" title="Choose a service type" className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 border-t-0 border-x-0 p-3 text-sm focus:outline-none focus:ring-0">
                    <option>Major Diagnostic ($250)</option>
                    <option>General Maintenance</option>
                    <option>Brake Inspection</option>
                  </select>
                </div>
                <div className="group">
                  <label htmlFor="vehicle-model" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Vehicle Make/Model</label>
                  <input
                    id="vehicle-model"
                    className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 border-t-0 border-x-0 p-3 text-sm focus:outline-none focus:ring-0"
                    placeholder="e.g. 2021 Audi A6"
                    type="text"
                    title="Enter the vehicle make and model"
                  />
                </div>
              </div>
              <button className="w-full py-5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                Book This Pro
              </button>
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span>Fully Insured & Bonded</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-emerald-600">workspace_premium</span>
                  <span>ASE Master Certified</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-emerald-600">verified_user</span>
                  <span>90-Day Service Guarantee</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-100 border border-amber-200">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="block mb-1">New Client Offer:</strong>
                  Book your first Diagnostic and receive a complimentary fluid top-off.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {activeJob && (
          <section className="mt-12 space-y-6">
            <div className="p-6 rounded-3xl glass-effect border-2 border-emerald-200 bg-emerald-100/70">
              <p className="font-bold text-sm text-center mb-2 text-emerald-700">✓ JOB IN PROGRESS</p>
              {activeJob.customer_name && (
                <p className="text-sm text-slate-900">Client: <span className="font-semibold">{activeJob.customer_name}</span></p>
              )}
              {activeJob.issue_description && (
                <p className="mt-1 text-sm italic text-slate-600">“{activeJob.issue_description}”</p>
              )}
            </div>
            <Chat jobId={activeJob.id} userId={user.id} />
            <button onClick={completeJob} className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
              Mark as Completed
            </button>
          </section>
        )}

        {incomingJob && (
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔔</div>
                <h3 className="text-2xl font-bold text-slate-900">New Job Request!</h3>
                {incomingJob.customer_name && (
                  <p className="mt-1 text-sm text-slate-600">
                    From: <span className="font-semibold text-slate-900">{incomingJob.customer_name}</span>
                  </p>
                )}
                {incomingJob.issue_description && (
                  <div className="mt-3 p-3 rounded-xl text-sm bg-slate-100 text-slate-600">
                    “{incomingJob.issue_description}”
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAcceptJob(incomingJob)}
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold mb-3 transition hover:bg-blue-700"
              >
                Accept & Navigate
              </button>
              <button
                onClick={() => handleDeclineJob(incomingJob)}
                className="w-full py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-slate-50 w-full py-12">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <span className="font-black text-xl text-slate-900">YAM</span>
            <p className="text-sm text-slate-500 max-w-sm">The world's most trusted platform for high-end professional services and local expertise.</p>
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} YAM Professional Services. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-8 md:justify-end items-start">
            <div className="flex flex-col gap-3">
              <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4" href="#">Privacy Policy</a>
              <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4" href="#">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-3">
              <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4" href="#">Become a Pro</a>
              <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4" href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
