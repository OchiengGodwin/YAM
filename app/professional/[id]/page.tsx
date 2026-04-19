'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProfessionalDetail() {
  const params = useParams();
  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  useEffect(() => {
    const fetchPro = async () => {
      try {
        const res = await fetch(`${API_URL}/all-pros`);
        const result = await res.json();
        if (result.status === 'success') {
          const found = result.data.find((p: any) => p.id === parseInt(params.id as string));
          setPro(found || null);
        }
      } catch (error) {
        console.error('Failed to fetch professional:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPro();
  }, [params.id]);

  if (loading) {
    return (
      <main className="bg-white min-h-screen py-12">
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading professional details...</p>
        </div>
      </main>
    );
  }

  if (!pro) {
    return (
      <main className="bg-white min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">person_off</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Professional not found</h1>
          <Link href="/discover" className="text-teal-600 hover:text-teal-700 font-semibold">
            Back to browse
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="h-64 bg-gradient-to-br from-teal-600 to-cyan-600 relative">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 -mt-24 relative z-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white">
                {pro.full_name.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-3">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{pro.full_name}</h1>
              <p className="text-xl text-teal-600 font-semibold mb-4">{pro.profession}</p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-600">Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-400">star</span>
                    <span className="text-2xl font-bold text-slate-900">{pro.rating || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Hourly Rate</p>
                  <p className="text-2xl font-bold text-slate-900">${pro.hourly_rate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${pro.is_available ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'}`}>
                    <span className={`w-2 h-2 rounded-full ${pro.is_available ? 'bg-teal-600' : 'bg-slate-600'}`}></span>
                    {pro.is_available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>

              {pro.is_available && (
                <Link
                  href="/book"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                >
                  Book Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed">
                Highly experienced {pro.profession} with a commitment to delivering quality work and excellent customer service. Available for both residential and commercial projects with flexible scheduling options.
              </p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Reliable', 'Punctual', 'Quality Work', 'Communication'].map((specialty) => (
                  <span key={specialty} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {[
                  { author: 'John D.', rating: 5, text: 'Excellent work! Highly recommend.' },
                  { author: 'Sarah M.', rating: 5, text: 'Very professional and on time.' },
                  { author: 'Mike T.', rating: 4, text: 'Great service, will hire again.' },
                ].map((review, idx) => (
                  <div key={idx} className="border-b border-slate-200 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-900">{review.author}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm text-yellow-400">star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600">📍 Location</p>
                  <p className="font-medium text-slate-900">Nairobi, Kenya</p>
                </div>
                <div>
                  <p className="text-slate-600">📞 Contact</p>
                  <p className="font-medium text-slate-900">{pro.phone || 'Available'}</p>
                </div>
                <div>
                  <p className="text-slate-600">⏰ Response Time</p>
                  <p className="font-medium text-slate-900">Within 2 hours</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/book"
              className="block w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold text-center rounded-lg hover:opacity-90 transition-all"
            >
              Book This Professional
            </Link>

            <button className="w-full py-2 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
