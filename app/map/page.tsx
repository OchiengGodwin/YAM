'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function CustomerMap() {
  const [pros, setPros] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  const fetchOnlinePros = async () => {
    const res = await fetch(`${API_URL}/all-pros`);
    const result = await res.json();
    if (result.status === "success") {
      // Only show pros who are actually online
      setPros(result.data.filter((p: any) => p.is_available));
    }
  };

  useEffect(() => {
    fetchOnlinePros();
    const interval = setInterval(fetchOnlinePros, 30000); // Refresh pins every 30s
    return () => clearInterval(interval);
  }, []);

  const filteredPros = filter === 'All' ? pros : pros.filter(p => p.profession === filter);

  return (
    <div className="h-screen w-full relative lyft-gradient-bg">
      {/* --- Overlay UI --- */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] p-4 rounded-full shadow-2xl flex gap-2 lyft-panel"
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(37, 99, 235, 0.32)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {['All', 'Mechanic', 'Electrician', 'Plumber'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className="px-6 py-2 rounded-full text-sm font-bold transition smooth-transition"
            style={{
              backgroundColor: filter === type ? '#1E40AF' : 'rgba(37, 99, 235, 0.1)',
              color: filter === type ? 'white' : '#1E40AF',
              border: filter === type ? '2px solid rgba(37, 99, 235, 0.45)' : '2px solid rgba(37, 99, 235, 0.3)'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <MapContainer center={[-1.2921, 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {filteredPros.map((pro) => {
          const coords = pro.location.match(/\((.*)\)/)[1].split(' ');
          return (
            <Marker key={pro.id} position={[parseFloat(coords[1]), parseFloat(coords[0])]}>
              <Popup>
                <div className="p-2" style={{ fontFamily: "'Georgia', serif" }}>
                  <p className="font-bold text-lg" style={{ color: '#333333' }}>
                    {pro.full_name}
                  </p>
                  <p className="font-medium" style={{ color: '#A0826D' }}>
                    {pro.profession}
                  </p>
                  <a
                    href="/client"
                    className="mt-2 block w-full py-2 rounded font-bold text-center text-white smooth-transition hover:shadow-lg"
                    style={{ backgroundColor: '#1E40AF', border: '2px solid rgba(37, 99, 235, 0.45)' }}
                  >
                    Request Now
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}