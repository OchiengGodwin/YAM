'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Leaflet needs to be loaded dynamically for Next.js SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function AdminDashboard() {
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  useEffect(() => {
    const fetchAllPros = async () => {
      try {
        const res = await fetch(`${API_URL}/all-pros`);
        const result = await res.json();
        if (result.status === 'success') setPros(result.data);
      } catch (error) {
        console.error('Failed to fetch professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPros();
  }, []);

  const stats = [
    {
      label: 'Online Pros',
      value: pros.length,
      icon: 'person',
      gradient: 'from-teal-500 to-cyan-600',
    },
    {
      label: 'Total Professions',
      value: new Set(pros.map(p => p.profession)).size,
      icon: 'work',
      gradient: 'from-teal-400 to-teal-600',
    },
    {
      label: 'Coverage Area',
      value: 'Nairobi',
      icon: 'location_on',
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      label: 'System Status',
      value: 'Active',
      icon: 'check_circle',
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">YAM Admin Console</h1>
            <p className="text-sm text-slate-500 mt-1">System monitoring and professional network management</p>
          </div>
          <div className="flex items-center gap-3 bg-teal-50 px-4 py-2 rounded-xl border border-teal-200">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <span className="font-semibold text-slate-900">System Active</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-white text-xl">{stat.icon}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <p className="text-xs text-slate-500">
                {stat.label === 'Online Pros' && 'Currently active'}
                {stat.label === 'Total Professions' && 'Available services'}
                {stat.label === 'Coverage Area' && 'Primary region'}
                {stat.label === 'System Status' && 'All systems operational'}
              </p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined">location_on</span>
              Professional Network Map
            </h2>
            <p className="text-sm text-slate-500 mt-2">Real-time location of available professionals</p>
          </div>

          <div className="w-full h-96">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-700 font-semibold">Loading map...</p>
                </div>
              </div>
            ) : (
              <MapContainer center={[-1.2921, 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                
                {pros.map((pro) => {
                  // Extract coordinates from PostGIS point string "POINT(lng lat)"
                  const coords = pro.location.match(/\((.*)\)/)[1].split(' ');
                  return (
                    <Marker key={pro.id} position={[parseFloat(coords[1]), parseFloat(coords[0])]}>
                      <Popup>
                        <div className="space-y-2">
                          <p className="font-bold text-slate-900">{pro.full_name}</p>
                          <p className="text-blue-600 font-semibold text-sm">{pro.profession}</p>
                          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                            <p>ID: {pro.id.slice(0, 8)}</p>
                            <p>Phone: {pro.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Professional List */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined">people</span>
              Online Professionals ({pros.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            {pros.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Profession</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Phone</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">ID</th>
                    <th className="px-6 py-3 text-center font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pros.slice(0, 10).map((pro) => (
                    <tr key={pro.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{pro.full_name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                          {pro.profession}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{pro.phone || '—'}</td>
                      <td className="px-6 py-4 font-mono text-slate-500 text-xs">{pro.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-emerald-700 font-semibold">Online</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">person_off</span>
                <p className="text-slate-600">No professionals currently online</p>
              </div>
            )}
          </div>

          {pros.length > 10 && (
            <div className="px-6 py-4 bg-slate-50 text-center text-sm text-slate-600 border-t border-slate-200">
              Showing 10 of {pros.length} professionals. <a href="#" className="text-blue-600 font-semibold hover:underline">View all</a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 text-center text-xs text-slate-500">
          <p>YAM Admin Console • Last updated: {new Date().toLocaleTimeString()}</p>
          <p className="mt-2">© {new Date().getFullYear()} YAM Professional Services</p>
        </div>
      </div>
    </main>
  );
}