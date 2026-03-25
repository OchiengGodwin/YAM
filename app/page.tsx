'use client';

import { useState } from 'react';

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [profession, setProfession] = useState('Mechanic');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const findNearbyPros = () => {
    setLoading(true);
    // 1. Get User Location from Browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          // 2. Call your FastAPI Backend
          const response = await fetch(
            `https://yam-mg62.onrender.com/find-pro?lat=${latitude}&lng=${longitude}&profession=${profession}`
          );
          const result = await response.json();
          
          if (result.status === "success") {
            setResults(result.data);
            console.log("Found Pros:", result.data);
          }
        } catch (error) {
          console.error("Connection error:", error);
          alert("Could not connect to the backend. Make sure Uvicorn is running!");
        } finally {
          setLoading(false);
        }
      }, (error) => {
        setLoading(false);
        alert("Location access denied. Please enable GPS to find pros near you.");
      });
    } else {
      setLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-slate-50">
      <h1 className="text-4xl font-bold mb-8 text-slate-900 mt-10">Pro-Connect</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <label className="block mb-2 font-medium text-slate-700">What do you need?</label>
        <select 
          className="w-full p-3 border rounded-lg mb-4 bg-white text-slate-900"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        >
          <option>Mechanic</option>
          <option>Electrician</option>
          <option>Plumber</option>
        </select>

        <button 
          onClick={findNearbyPros}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Searching...' : `Find Nearest ${profession}`}
        </button>
      </div>

      {/* --- Results Section --- */}
      <div className="mt-10 w-full max-w-md">
        {results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Available Professionals</h2>
            {results.map((pro) => (
              <div key={pro.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-center transition hover:border-blue-300">
                <div>
                  <p className="font-bold text-lg text-slate-900">{pro.full_name}</p>
                  <p className="text-sm text-blue-600 font-medium">{pro.profession}</p>
                  <p className="text-xs text-slate-400 mt-1">Ready for service</p>
                </div>
                <button className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-700">
                  Request
                </button>
              </div>
            ))}
          </div>
        ) : (
          location && !loading && (
            <p className="text-center text-slate-500 italic mt-4">
              No {profession}s found in your immediate area.
            </p>
          )
        )}
      </div>
    </main>
  );
}