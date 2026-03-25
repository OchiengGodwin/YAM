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

  const fetchOnlinePros = async () => {
    const res = await fetch('http://127.0.0.1:8000/all-pros');
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
    <div className="h-screen w-full relative">
      {/* --- Overlay UI --- */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white p-4 rounded-full shadow-2xl flex gap-2 border border-slate-200">
        {['All', 'Mechanic', 'Electrician', 'Plumber'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
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
                <div className="p-2">
                  <p className="font-bold text-lg">{pro.full_name}</p>
                  <p className="text-blue-600 font-medium">{pro.profession}</p>
                  <button className="mt-2 w-full bg-green-600 text-white py-2 rounded font-bold">
                    Request Now
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}