'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
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
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const { data: proData } = await supabase
        .from('pro_services').select('*').eq('id', user.id).single();
      if (proData) { setProProfile(proData); setIsOnline(proData.is_available); }

      const { data: jobData } = await supabase
        .from('jobs').select('*').eq('pro_id', user.id).eq('status', 'accepted').single();
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
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.customer_lat},${job.customer_lng}&travelmode=driving`, '_blank');
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4">
      <header className="flex items-center justify-between mb-6 pt-2">
        <div>
          <span className="text-2xl font-extrabold text-blue-400">YAM</span>
          <p className="text-slate-500 text-xs mt-0.5">Pro Dashboard</p>
        </div>
        <button onClick={signOut} className="text-sm text-slate-400 hover:text-red-400 transition">
          Sign Out
        </button>
      </header>

      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0">
            {proProfile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-lg truncate">{proProfile?.full_name ?? 'Pro'}</p>
            <p className="text-blue-400 text-sm">{proProfile?.profession ?? '—'}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>

        {!activeJob && (
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-lg flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                {isOnline ? 'Online' : 'Offline'}
              </p>
              <p className="text-sm text-slate-400">
                {isOnline ? 'Clients can find and request you' : 'You are hidden from clients'}
              </p>
            </div>
            <button
              onClick={toggleStatus}
              disabled={toggling}
              className={`w-14 h-8 rounded-full transition-colors relative disabled:opacity-60 ${isOnline ? 'bg-green-500' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${isOnline ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        )}

        {!activeJob && isOnline && (
          <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <p className="text-slate-300 text-sm">Waiting for job requests...</p>
            </div>
          </div>
        )}

        {activeJob && (
          <div className="space-y-4">
            <div className="p-4 bg-green-900/30 border border-green-700 rounded-2xl">
              <p className="text-green-400 font-bold text-sm text-center mb-2">JOB IN PROGRESS</p>
              {activeJob.customer_name && (
                <p className="text-white text-sm">Client: <span className="font-semibold">{activeJob.customer_name}</span></p>
              )}
              {activeJob.issue_description && (
                <p className="text-slate-300 text-sm mt-1 italic">&ldquo;{activeJob.issue_description}&rdquo;</p>
              )}
            </div>
            <Chat jobId={activeJob.id} userId={user.id} />
            <button onClick={completeJob} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition">
              Mark as Completed
            </button>
          </div>
        )}
      </div>

      {incomingJob && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-600">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-2xl font-bold text-white">New Job Request!</h3>
              {incomingJob.customer_name && (
                <p className="text-slate-400 mt-1">From: <span className="text-white font-semibold">{incomingJob.customer_name}</span></p>
              )}
              {incomingJob.issue_description && (
                <div className="mt-3 p-3 bg-slate-700 rounded-xl text-sm text-slate-300 text-left">
                  &ldquo;{incomingJob.issue_description}&rdquo;
                </div>
              )}
            </div>
            <button onClick={() => handleAcceptJob(incomingJob)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 mb-3 transition">
              Accept &amp; Navigate
            </button>
            <button onClick={() => handleDeclineJob(incomingJob)} className="w-full py-3 text-slate-400 hover:text-red-400 font-medium transition text-sm">
              Decline
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
