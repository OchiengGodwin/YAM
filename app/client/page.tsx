'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

type Pro = {
  id: string;
  full_name: string;
  profession: string;
  phone?: string;
  distance_km?: number;
};

type JobPayload = {
  id: number;
  pro_id: string;
  customer_name: string;
  issue_description?: string;
  customer_lat: number;
  customer_lng: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-amber-300 bg-amber-950/40 border-amber-700',
  accepted: 'text-green-300 bg-green-950/40 border-green-700',
  declined: 'text-red-300 bg-red-950/40 border-red-700',
  completed: 'text-blue-300 bg-blue-950/40 border-blue-700',
  cancelled: 'text-slate-300 bg-slate-700 border-slate-600',
};

export default function ClientPortal() {
  const [profession, setProfession] = useState(PROFESSIONS[0]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [searching, setSearching] = useState(false);
  const [pros, setPros] = useState<Pro[]>([]);
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [requesting, setRequesting] = useState(false);

  const [activeJob, setActiveJob] = useState<JobPayload | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError('Enable location access so we can find nearby professionals.');
      }
    );
  }, []);

  useEffect(() => {
    if (!activeJob) return;

    const poll = async () => {
      const res = await fetch(`${API_URL}/jobs/${activeJob.id}`);
      if (!res.ok) return;
      const payload = await res.json();
      if (payload.status === 'success' && payload.data) {
        setActiveJob(payload.data);
      }
    };

    poll();
    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [activeJob?.id]);

  const statusLabel = useMemo(() => {
    if (!activeJob) return null;
    switch (activeJob.status) {
      case 'pending':
        return 'Waiting for professional to accept...';
      case 'accepted':
        return 'Professional accepted. They are on the way.';
      case 'declined':
        return 'Request declined. Please choose another professional.';
      case 'completed':
        return 'Job completed. Thanks for using YAM.';
      default:
        return `Status: ${activeJob.status}`;
    }
  }, [activeJob]);

  const handleFindPros = async () => {
    if (!location) {
      setLocationError('Location is required. Please enable GPS and retry.');
      return;
    }

    setSearching(true);
    setPros([]);

    try {
      const res = await fetch(
        `${API_URL}/find-pro?lat=${location.lat}&lng=${location.lng}&profession=${encodeURIComponent(profession)}`
      );
      const payload = await res.json();
      if (payload.status === 'success') {
        setPros(payload.data ?? []);
      }
    } finally {
      setSearching(false);
    }
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPro || !location || !customerName.trim()) return;

    setRequesting(true);

    try {
      const res = await fetch(`${API_URL}/jobs/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pro_id: selectedPro.id,
          customer_name: customerName,
          issue_description: issueDescription,
          customer_lat: location.lat,
          customer_lng: location.lng,
        }),
      });

      const payload = await res.json();
      if (res.ok && payload.status === 'success' && payload.data) {
        setActiveJob(payload.data as JobPayload);
        setSelectedPro(null);
        setIssueDescription('');
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <main 
      className="min-h-screen"
      style={{ background: 'linear-gradient(140deg, #FEFDFB 0%, #F5F0E8 50%, rgba(37, 99, 235, 0.16) 100%)' }}
    >
      <header className="px-6 py-6 border-b-2 flex items-center justify-between lyft-topbar" style={{ borderColor: 'rgba(37, 99, 235, 0.26)' }}>
        <Link href="/" className="text-3xl font-bold" style={{ color: '#A0826D' }}>
          YAM
        </Link>
        <Link 
          href="/login" 
          className="text-sm font-medium smooth-transition hover:opacity-70"
          style={{ color: '#A0826D' }}
        >
          Pro Login
        </Link>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {activeJob && (
          <div 
            className="p-4 rounded-2xl border smooth-transition"
            style={{
              backgroundColor: activeJob.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 
                               activeJob.status === 'accepted' ? 'rgba(59, 130, 246, 0.1)' :
                               'rgba(245, 158, 11, 0.1)',
              borderColor: activeJob.status === 'completed' ? '#10B981' : 
                          activeJob.status === 'accepted' ? '#3B82F6' : '#F59E0B',
              color: activeJob.status === 'completed' ? '#10B981' : 
                     activeJob.status === 'accepted' ? '#3B82F6' : '#D97706'
            }}
          >
            <p className="font-bold mb-1">Current Request</p>
            <p className="text-sm">{statusLabel}</p>
          </div>
        )}

        {locationError && (
          <div 
            className="p-4 rounded-2xl border text-sm"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#EF4444',
              color: '#DC2626'
            }}
          >
            {locationError}
          </div>
        )}

        <div 
          className="rounded-3xl p-6 lyft-panel"
          style={{ background: 'rgba(255, 255, 255, 0.7)' }}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>
            Find professionals
          </h1>
          <p className="text-sm mb-6" style={{ color: '#5F4A42' }}>
            Pick a service and request the closest available provider.
          </p>

          <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
            Service Type
          </label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full p-3 rounded-xl mb-4 border-2 focus:outline-none smooth-transition"
            style={{ 
              borderColor: '#A0826D',
              backgroundColor: '#FEFDFB',
              color: '#333333'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#A0826D'}
          >
            {PROFESSIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={handleFindPros}
            disabled={searching}
            className="w-full py-3 rounded-xl font-bold text-white smooth-transition hover:shadow-lg lyft-primary-btn"
            style={{ 
              opacity: searching ? 0.7 : 1
            }}
          >
            {searching ? 'Searching...' : `Find ${profession}`}
          </button>
        </div>

        <div className="space-y-3">
          {pros.map((pro) => (
            <div 
              key={pro.id} 
              className="rounded-2xl p-4 glass-effect flex items-center justify-between smooth-transition hover:shadow-lg"
              style={{ background: 'rgba(255, 255, 255, 0.6)' }}
            >
              <div>
                <p className="font-semibold" style={{ color: '#333333' }}>
                  {pro.full_name}
                </p>
                <p className="text-sm" style={{ color: '#3B82F6' }}>
                  {pro.profession}
                </p>
                {typeof pro.distance_km === 'number' && (
                  <p className="text-xs" style={{ color: '#5F4A42' }}>
                    {pro.distance_km.toFixed(1)} km away
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedPro(pro)}
                className="px-4 py-2 rounded-full text-sm font-bold text-white smooth-transition hover:shadow-lg"
                  style={{ backgroundColor: '#1E40AF', border: '2px solid rgba(37, 99, 235, 0.45)' }}
              >
                Request
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedPro && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}
        >
          <div 
            className="w-full max-w-md rounded-3xl p-6 lyft-panel"
            style={{ background: 'rgba(255, 255, 255, 0.9)' }}
          >
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#333333' }}>
              Request {selectedPro.full_name}
            </h2>
            <p className="text-sm mb-4" style={{ color: '#5F4A42' }}>
              {selectedPro.profession}
            </p>

            <form onSubmit={submitRequest} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                  Your Name
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                  style={{ 
                    borderColor: '#A0826D',
                    backgroundColor: '#FEFDFB',
                    color: '#333333'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#A0826D'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#5F4A42' }}>
                  Issue Description
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 focus:outline-none smooth-transition"
                  style={{ 
                    borderColor: '#A0826D',
                    backgroundColor: '#FEFDFB',
                    color: '#333333'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#A0826D'}
                />
              </div>

              <button
                type="submit"
                disabled={requesting}
                className="w-full py-3 rounded-xl font-bold text-white smooth-transition hover:shadow-lg lyft-primary-btn"
                style={{ 
                  opacity: requesting ? 0.7 : 1
                }}
              >
                {requesting ? 'Sending request...' : 'Send Request'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPro(null)}
                className="w-full py-2 font-medium smooth-transition hover:opacity-60"
                style={{ color: '#5F4A42' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
