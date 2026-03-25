'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Chat from '@/components/Chat'; // Ensure you created this component

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incomingJob, setIncomingJob] = useState<any>(null);
  const [activeJob, setActiveJob] = useState<any>(null);

  // 1. Initial Auth and Status Check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Check for existing online status
        const { data: proData } = await supabase
          .from('pro_services')
          .select('is_available')
          .eq('id', user.id)
          .single();

        if (proData) setIsOnline(proData.is_available);

        // Check if there is an ongoing job already
        const { data: jobData } = await supabase
          .from('jobs')
          .select('*')
          .eq('pro_id', user.id)
          .eq('status', 'accepted')
          .single();
        
        if (jobData) setActiveJob(jobData);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // 2. Real-time Job Listener
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('job-requests')
      .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs',
          filter: `pro_id=eq.${user.id}`,
        },
        (payload) => {
          if (!activeJob) setIncomingJob(payload.new);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, activeJob]);

  // 3. Handlers
  const toggleStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    await fetch('http://127.0.0.1:8000/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pro_id: user.id, status: newStatus }),
    });
  };

  const handleAcceptJob = async (job: any) => {
    await supabase.from('jobs').update({ status: 'accepted' }).eq('id', job.id);
    setActiveJob(job);
    setIncomingJob(null);

    // Open Navigation
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${job.customer_lat},${job.customer_lng}&travelmode=driving`;
    window.open(mapUrl, '_blank');
  };

  const completeJob = async () => {
    if (!activeJob) return;
    await supabase.from('jobs').update({ status: 'completed' }).eq('id', activeJob.id);
    setActiveJob(null);
    alert("Job completed! You are ready for the next one.");
  };

  if (loading) return <div className="p-10 text-center">Loading Pro-Connect...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pro Dashboard</h1>
        <p className="text-slate-500 mb-8">{user?.email}</p>

        {/* Online Toggle */}
        {!activeJob && (
          <div className="flex items-center justify-between p-6 bg-slate-100 rounded-xl mb-6">
            <div>
              <p className="font-bold text-lg">{isOnline ? 'Online' : 'Offline'}</p>
              <p className="text-sm text-slate-500">Visible to customers</p>
            </div>
            <button 
              onClick={toggleStatus}
              className={`w-14 h-8 rounded-full transition-colors relative ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isOnline ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        )}

        {/* Active Job & Chat Area */}
        {activeJob ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-green-700 font-bold text-sm">JOB IN PROGRESS</p>
            </div>
            
            <Chat jobId={activeJob.id} userId={user.id} />
            
            <button 
              onClick={completeJob}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition"
            >
              Finish Job
            </button>
          </div>
        ) : (
          isOnline && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg animate-pulse text-center">
              <p className="text-blue-700 text-sm font-medium">📍 Waiting for requests...</p>
            </div>
          )
        )}
      </div>

      {/* Incoming Job Modal */}
      {incomingJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold mb-2">New Request!</h3>
            <p className="text-slate-500 mb-8">A customer needs assistance nearby.</p>
            <button 
              onClick={() => handleAcceptJob(incomingJob)}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mb-3"
            >
              Accept & Navigate
            </button>
            <button onClick={() => setIncomingJob(null)} className="text-slate-400 font-medium">Decline</button>
          </div>
        </div>
      )}
    </main>
  );
}