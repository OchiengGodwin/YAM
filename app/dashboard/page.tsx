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
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FEFDFB 0%, #F5F0E8 100%)' }}
      >
        <div className="text-center">
          <div 
            className="w-10 h-10 rounded-full animate-spin mx-auto mb-3 border-4"
            style={{ 
              borderColor: 'rgba(59, 130, 246, 0.3)',
              borderTopColor: '#3B82F6'
            }}
          />
          <p style={{ color: '#5F4A42' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen p-4"
      style={{ background: 'linear-gradient(135deg, #FEFDFB 0%, #F5F0E8 100%)' }}
    >
      <header className="flex items-center justify-between mb-8 pt-2 max-w-2xl mx-auto">
        <div>
          <span className="text-3xl font-bold" style={{ color: '#A0826D' }}>YAM</span>
          <p className="text-sm mt-0.5" style={{ color: '#5F4A42' }}>Pro Dashboard</p>
        </div>
        <button 
          onClick={signOut} 
          className="text-sm font-medium smooth-transition hover:opacity-70"
          style={{ color: '#A0826D' }}
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Profile Card */}
        <div 
          className="rounded-3xl p-6 glass-effect flex items-center gap-4"
          style={{ background: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 text-white"
            style={{ backgroundColor: '#A0826D' }}
          >
            {proProfile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-lg truncate" style={{ color: '#333333' }}>
              {proProfile?.full_name ?? 'Professional'}
            </p>
            <p className="text-sm" style={{ color: '#3B82F6' }}>
              {proProfile?.profession ?? '—'}
            </p>
            <p className="text-xs truncate" style={{ color: '#5F4A42' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Status Toggle */}
        {!activeJob && (
          <div 
            className="rounded-3xl p-6 glass-effect flex items-center justify-between"
            style={{ background: 'rgba(255, 255, 255, 0.6)' }}
          >
            <div>
              <p className="font-bold text-lg flex items-center gap-2" style={{ color: '#333333' }}>
                <span 
                  className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: isOnline ? '#10B981' : '#A0826D' }}
                />
                {isOnline ? 'Online' : 'Offline'}
              </p>
              <p className="text-sm" style={{ color: '#5F4A42' }}>
                {isOnline ? 'Clients can find and request you' : 'You are hidden from clients'}
              </p>
            </div>
            <button
              onClick={toggleStatus}
              disabled={toggling}
              className="w-14 h-8 rounded-full relative transition-colors smooth-transition"
              style={{ 
                backgroundColor: isOnline ? '#10B981' : '#D1D5DB',
                opacity: toggling ? 0.6 : 1
              }}
            >
              <div 
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all"
                style={{ left: isOnline ? '28px' : '4px' }}
              />
            </button>
          </div>
        )}

        {/* Waiting State */}
        {!activeJob && isOnline && (
          <div 
            className="rounded-3xl p-5 glass-effect flex items-center gap-3"
            style={{ background: 'rgba(59, 130, 246, 0.08)' }}
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#3B82F6' }}
            />
            <p className="text-sm" style={{ color: '#5F4A42' }}>
              Waiting for job requests...
            </p>
          </div>
        )}

        {/* Active Job */}
        {activeJob && (
          <div className="space-y-4">
            <div 
              className="p-4 rounded-2xl glass-effect border-2"
              style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderColor: '#10B981'
              }}
            >
              <p className="font-bold text-sm text-center mb-2" style={{ color: '#10B981' }}>
                ✓ JOB IN PROGRESS
              </p>
              {activeJob.customer_name && (
                <p className="text-sm" style={{ color: '#333333' }}>
                  Client: <span className="font-semibold">{activeJob.customer_name}</span>
                </p>
              )}
              {activeJob.issue_description && (
                <p className="text-sm mt-1 italic" style={{ color: '#5F4A42' }}>
                  &ldquo;{activeJob.issue_description}&rdquo;
                </p>
              )}
            </div>
            <Chat jobId={activeJob.id} userId={user.id} />
            <button 
              onClick={completeJob} 
              className="w-full py-4 rounded-2xl font-bold text-white smooth-transition hover:shadow-lg"
              style={{ backgroundColor: '#A0826D' }}
            >
              Mark as Completed
            </button>
          </div>
        )}
      </div>

      {/* Incoming Job Modal */}
      {incomingJob && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div 
            className="p-8 rounded-3xl shadow-2xl max-w-sm w-full glass-effect"
            style={{ background: 'rgba(255, 255, 255, 0.9)' }}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-2xl font-bold" style={{ color: '#333333' }}>
                New Job Request!
              </h3>
              {incomingJob.customer_name && (
                <p className="mt-1" style={{ color: '#5F4A42' }}>
                  From: <span className="text-base font-semibold" style={{ color: '#333333' }}>
                    {incomingJob.customer_name}
                  </span>
                </p>
              )}
              {incomingJob.issue_description && (
                <div 
                  className="mt-3 p-3 rounded-xl text-sm text-left glass-effect"
                  style={{ 
                    backgroundColor: 'rgba(160, 130, 109, 0.08)',
                    color: '#5F4A42'
                  }}
                >
                  &ldquo;{incomingJob.issue_description}&rdquo;
                </div>
              )}
            </div>
            <button 
              onClick={() => handleAcceptJob(incomingJob)} 
              className="w-full py-4 rounded-xl font-bold text-white smooth-transition hover:shadow-lg mb-3"
              style={{ backgroundColor: '#A0826D' }}
            >
              Accept &amp; Navigate
            </button>
            <button 
              onClick={() => handleDeclineJob(incomingJob)} 
              className="w-full py-3 font-medium smooth-transition text-sm hover:opacity-60"
              style={{ color: '#5F4A42' }}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
