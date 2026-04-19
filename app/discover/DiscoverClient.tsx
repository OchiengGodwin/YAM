'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const DEFAULT_FILTERS = {
  minRating: 0,
  maxPrice: 500,
  profession: '',
  search: '',
};

function buildQuery(filters: typeof DEFAULT_FILTERS) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.profession) params.set('profession', filters.profession);
  if (filters.minRating !== 0) params.set('minRating', filters.minRating.toString());
  if (filters.maxPrice !== 500) params.set('maxPrice', filters.maxPrice.toString());

  return params.toString();
}

export default function DiscoverClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  useEffect(() => {
    const initialFilters = {
      minRating: parseFloat(searchParams.get('minRating') ?? '0') || 0,
      maxPrice: parseInt(searchParams.get('maxPrice') ?? '500') || 500,
      profession: searchParams.get('profession') ?? '',
      search: searchParams.get('search') ?? '',
    };

    setFilters(initialFilters);
  }, [searchParams]);

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
  }, [API_URL]);

  useEffect(() => {
    let result = professionals;

    if (filters.search) {
      result = result.filter(
        (p) =>
          p.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.profession.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.profession) {
      result = result.filter((p) => p.profession === filters.profession);
    }

    result = result.filter((p) => p.rating >= filters.minRating);
    setFiltered(result);
  }, [professionals, filters]);

  useEffect(() => {
    const query = buildQuery(filters);
    const newUrl = query ? `/discover?${query}` : '/discover';
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find a Professional</h1>
              <p className="text-gray-600 mt-1">{filtered.length} professionals available</p>
            </div>
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Filters</h3>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Name or profession..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Service Type
                  </label>
                  <select
                    title="Profession"
                    aria-label="Profession"
                    value={filters.profession}
                    onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="">All Services</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Designer">Designer</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Gardener">Gardener</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Minimum Rating: {filters.minRating.toFixed(1)} ★
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$20</span>
                    <span>$500</span>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="w-full py-3 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">search_off</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((pro) => (
                  <Link
                    key={pro.id}
                    href={`/professional/${pro.id}`}
                    className="block bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 p-6"
                  >
                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {pro.full_name.charAt(0)}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {pro.full_name}
                            </h3>
                            <p className="text-orange-600 font-medium mb-2">{pro.profession}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-yellow-400 text-lg">star</span>
                                <span className="font-semibold">{pro.rating || 'N/A'}</span>
                                <span>({pro.reviews || 0} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-green-600">verified</span>
                                <span>Verified</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              ${pro.hourly_rate || 'N/A'}
                              <span className="text-sm text-gray-500 font-normal">/hr</span>
                            </div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span>Serves your area</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>Available today</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Background checked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
