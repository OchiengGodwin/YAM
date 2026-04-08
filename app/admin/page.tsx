'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Leaflet needs to be loaded dynamically for Next.js SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function AdminDashboard() {
  const [pros, setPros] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  useEffect(() => {
    const fetchAllPros = async () => {
      const res = await fetch(`${API_URL}/all-pros`);
      const result = await res.json();
      if (result.status === "success") setPros(result.data);
    };
    fetchAllPros();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pro-Connect Admin Console</h1>
        <p className="text-green-400 font-mono">{pros.length} Pros Online</p>
      </header>

      <div className="flex-1">
        {/* Default center is Nairobi (-1.2921, 36.8219) */}
        <MapContainer center={[-1.2921, 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {pros.map((pro) => {
            // Extract coordinates from PostGIS point string "POINT(lng lat)"
            const coords = pro.location.match(/\((.*)\)/)[1].split(' ');
            return (
              <Marker key={pro.id} position={[parseFloat(coords[1]), parseFloat(coords[0])]}>
                <Popup>
                  <div className="font-sans">
                    <p className="font-bold">{pro.full_name}</p>
                    <p className="text-blue-600">{pro.profession}</p>
                    <p className="text-xs text-slate-400">ID: {pro.id.slice(0,8)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}