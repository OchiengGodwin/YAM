'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 500,
    profession: searchParams.get('profession') || '',
    search: searchParams.get('search') || '',
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  useEffect(() => {
    const fetchPros = async () => {
      try {
        const res = await fetch(`${API_URL}/all-pros`);
        const result = await res.json();
        if (result.status === 'success') {
          setProfessionals(result.data.filter((p: any) => p.is_available));
        }
      } catch (error) {
        console.error('Failed to fetch professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPros();
  }, []);

  useEffect(() => {
    let result = professionals;

    if (filters.search) {
      result = result.filter(p => 
        p.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.profession.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.profession) {
      result = result.filter(p => p.profession === filters.profession);
    }

    result = result.filter(p => p.rating >= filters.minRating);

    setFiltered(result);
  }, [professionals, filters]);

  return (
    <main className="bg-white">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-6">Filters</h3>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Name or profession..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Profession</label>
                <select
                  title="Profession"
                  aria-label="Profession"
                  value={filters.profession}
                  onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="">All professions</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Designer">Designer</option>
                  <option value="Mechanic">Mechanic</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Minimum Rating: {filters.minRating.toFixed(1)}
                </label>
                <input
                  title="Minimum Rating"
                  aria-label="Minimum Rating"
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Max Hourly Rate: ${filters.maxPrice}
                </label>
                <input
                  title="Maximum Hourly Rate"
                  aria-label="Maximum Hourly Rate"
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Reset */}
              <button
                onClick={() => setFilters({ minRating: 0, maxPrice: 500, profession: '', search: '' })}
                className="w-full py-2 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Professionals</h1>
            <p className="text-slate-600">{filtered.length} professionals found</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading professionals...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">search_off</span>
              <p className="text-slate-600 font-semibold">No professionals match your criteria</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pro) => (
                <Link key={pro.id} href={`/professional/${pro.id}`}>
                  <div className="group h-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Header */}
                    <div className="h-32 bg-gradient-to-br from-teal-600 to-cyan-600 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                    </div>

                    {/* Content */}
                    <div className="relative px-6 pb-6 -mt-12">
                      {/* Avatar */}
                      <div className="mb-4">
                        <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 mx-auto flex items-center justify-center text-3xl font-bold text-teal-600">
                          {pro.full_name.charAt(0)}
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="font-semibold text-center text-slate-900 text-lg">{pro.full_name}</h3>
                      <p className="text-center text-teal-600 text-sm font-semibold mb-3">{pro.profession}</p>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <span className="material-symbols-outlined text-yellow-400 text-lg">star</span>
                        <span className="font-semibold text-slate-900">{pro.rating || 'N/A'}</span>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-4">
                        <p className="text-2xl font-bold text-slate-900">${pro.hourly_rate || 'N/A'}<span className="text-xs text-slate-600 font-normal">/hr</span></p>
                      </div>

                      {/* CTA */}
                      <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all group-hover:shadow-md">
                        View Profile
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
