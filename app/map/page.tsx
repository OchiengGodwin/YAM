'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const PROFESSIONS = ['All', 'Mechanic', 'Electrician', 'Plumber', 'Carpenter', 'Painter'];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Distance in km, rounded to 1 decimal
};

export default function CustomerMap() {
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortedPros, setSortedPros] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  const fetchOnlinePros = async () => {
    try {
      const res = await fetch(`${API_URL}/all-pros`);
      const result = await res.json();
      if (result.status === 'success') {
        const available = result.data.filter((p: any) => p.is_available);
        setPros(available);
      }
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
    }
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Nairobi if location access denied
          setUserLocation({
            lat: -1.2921,
            lng: 36.8219,
          });
        }
      );
    }
    
    fetchOnlinePros();
    const interval = setInterval(fetchOnlinePros, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sort professionals by distance from user
  useEffect(() => {
    if (userLocation && pros.length > 0) {
      const withDistance = pros.map((pro) => {
        const coords = pro.location.match(/\((.*)\)/)[1].split(' ');
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(coords[1]),
          parseFloat(coords[0])
        );
        return { ...pro, distance };
      });

      const filtered = filter === 'All' 
        ? withDistance 
        : withDistance.filter(p => p.profession === filter);

      setSortedPros(filtered.sort((a, b) => a.distance - b.distance));
    }

    setLoading(false);
  }, [pros, userLocation, filter]);

  const closestPro = sortedPros.length > 0 ? sortedPros[0] : null;

  return (
    <main className="min-h-screen w-full flex flex-col bg-white">
      {/* Filter Bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 mt-6 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2 flex flex-wrap gap-2 max-w-4xl">
          {PROFESSIONS.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              title={`Filter by ${type}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === type
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type}
              {filter === type && (
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-white opacity-50"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Closest Professional Card */}
      {closestPro && (
        <div className="absolute bottom-6 left-6 z-40 bg-white rounded-2xl shadow-lg border border-teal-200 p-6 max-w-xs">
          <div className="flex items-start justify-between mb-3">
            <span className="material-symbols-outlined text-teal-600 text-2xl flex-shrink-0">location_on</span>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">CLOSEST</span>
          </div>
          <h3 className="font-bold text-slate-900 mb-1">{closestPro.full_name}</h3>
          <p className="text-sm text-teal-600 font-semibold mb-2">{closestPro.profession}</p>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <span className="material-symbols-outlined text-base">straight</span>
            <span className="font-semibold">{closestPro.distance} km away</span>
          </div>
          <Link
            href="/request"
            className="block w-full py-2 rounded-lg font-bold text-center text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 transition-all text-sm"
          >
            Request Now
          </Link>
        </div>
      )}

      {/* Nearby Professionals Sidebar */}
      <div className="absolute bottom-6 right-6 z-40 bg-white rounded-2xl shadow-lg border border-slate-200 p-4 max-w-xs max-h-80 overflow-y-auto">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-600">people</span>
          Nearby ({sortedPros.length})
        </h3>
        <div className="space-y-2">
          {sortedPros.slice(0, 5).map((pro, idx) => (
            <div key={pro.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-teal-200 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-xs font-bold text-slate-900">{idx + 1}. {pro.full_name.split(' ')[0]}</p>
                  <p className="text-xs text-teal-600">{pro.profession}</p>
                </div>
                <span className="text-xs font-bold text-teal-600 whitespace-nowrap ml-2">{pro.distance}km</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative w-full">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-700 font-semibold">Loading professionals...</p>
            </div>
          </div>
        ) : (
          <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [-1.2921, 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {sortedPros.map((pro, idx) => {
              const coords = pro.location.match(/\((.*)\)/)[1].split(' ');
              const isClosest = idx === 0;
              return (
                <Marker 
                  key={pro.id} 
                  position={[parseFloat(coords[1]), parseFloat(coords[0])]}
                  title={pro.full_name}
                >
                  <Popup>
                    <div className="space-y-3 min-w-48">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{pro.full_name}</p>
                          <p className="text-teal-600 font-semibold text-sm">{pro.profession}</p>
                        </div>
                        {isClosest && <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-1 rounded">CLOSEST</span>}
                      </div>
                      
                      <div className="space-y-1 text-xs text-slate-600 border-t border-slate-200 pt-2">
                        {pro.phone && <p>📞 {pro.phone}</p>}
                        <p className="text-slate-500">📍 {pro.distance} km away</p>
                        <p className="text-slate-500">✓ Available now</p>
                      </div>

                      <Link
                        href="/request"
                        className="block w-full py-2 rounded-lg font-bold text-center text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 transition-all text-sm"
                      >
                        Request Service
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Mobile Help */}
      <div className="md:hidden absolute bottom-24 right-6 z-40">
        <div className="bg-white rounded-full shadow-lg p-3 text-teal-600 border border-teal-200">
          <span className="material-symbols-outlined">touch_app</span>
        </div>
      </div>
    </main>
  );
}