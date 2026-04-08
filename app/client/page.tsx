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
    <main className="min-h-screen bg-slate-900 text-white">
      <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-blue-400">YAM</Link>
        <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Pro Login</Link>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {activeJob && (
          <div className={`p-4 rounded-2xl border ${STATUS_STYLES[activeJob.status]}`}>
            <p className="font-bold mb-1">Current Request</p>
            <p className="text-sm">{statusLabel}</p>
          </div>
        )}

        {locationError && (
          <div className="p-4 rounded-2xl border border-red-700 bg-red-950/40 text-red-300 text-sm">
            {locationError}
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
          <h1 className="text-2xl font-bold mb-2">Find nearby professionals</h1>
          <p className="text-slate-400 text-sm mb-5">Pick a service and request the closest available provider.</p>

          <label className="block text-sm text-slate-300 mb-2">Service Type</label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl mb-4"
          >
            {PROFESSIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={handleFindPros}
            disabled={searching}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 font-bold"
          >
            {searching ? 'Searching...' : `Find ${profession}`}
          </button>
        </div>

        <div className="space-y-3">
          {pros.map((pro) => (
            <div key={pro.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{pro.full_name}</p>
                <p className="text-blue-400 text-sm">{pro.profession}</p>
                {typeof pro.distance_km === 'number' && (
                  <p className="text-xs text-slate-500">{pro.distance_km.toFixed(1)} km away</p>
                )}
              </div>
              <button
                onClick={() => setSelectedPro(pro)}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-full text-sm font-bold"
              >
                Request
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedPro && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-1">Request {selectedPro.full_name}</h2>
            <p className="text-sm text-slate-400 mb-4">{selectedPro.profession}</p>

            <form onSubmit={submitRequest} className="space-y-3">
              <div>
                <label className="block text-sm mb-1 text-slate-300">Your Name</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-slate-300">Issue Description</label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={requesting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 font-bold"
              >
                {requesting ? 'Sending request...' : 'Send Request'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPro(null)}
                className="w-full py-2 text-slate-400 hover:text-white"
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
