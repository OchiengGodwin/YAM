'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FEATURED_PROS = [
  {
    id: 1,
    name: 'Marcus Chen',
    title: 'Master Electrician',
    rating: 4.9,
    reviews: 324,
    price: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC_DQu8E5zDR6uWp3-nCtrO5QLDFgtwchccgdaBZii5lRPM8_QRgHzJ0HHcCm8x88HdA6Ot8hYD1frEl5QGG2cuYDWIpUF_7NflKOpiVhZsZ22COiIA4NwYDBl_FOXg6H_C0A5j_5pmdtn0z6U_xBaY1jJ73_5tsk8XS9ZRYxP674wBwrYnwMZ1ft3M1M9_BJAXsvT0V99wqR3y7P0RMjuHDwBLoKQxGqRa2KKLWCuqKiypeoqCRCjPvo-iaWYtQ7PNKQRWzBbBwlq',
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    title: 'Interior Architect',
    rating: 5.0,
    reviews: 512,
    price: 185,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW9z3TgCbDX5E2PfCyOAsXNRT0fPs8sVQs8b7XauSzEbdhcfE-brWLTDy1QbR9MOg-lkEGPbBIKG9a3fesd68wyeoZDTIabMiXQ4wNlNQ1Ec5x4Dl8x3gIbRJhB_oCG2EFwGInvrYTSuPknbDDimsV4dmZV9cJvxDn1vSssruNakvVZb5Xe-BZQ0GTLqCF6XnC4EH8TbnFPzvMQtMziGAfvYMFwYYZGtXVXpAJQO9d4-BbpVaENoQ97drBchKo0dvoNfoRuETgkZIC',
  },
  {
    id: 3,
    name: 'Julian Voss',
    title: 'Custom Cabinetry',
    rating: 4.8,
    reviews: 287,
    price: 95,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmivu-6zvzcDxaHRjZ7w83YsgI3APMCqRN6Bse8glmDoElMNKxZf9j8dvGQ3tBwYiJZDfP4AcD_P06VDOVD3GkUZD7DwC645Lp29BWZSvAgfILEpKUvmaYuzQeB4XUuj4JzY03PAaY6xcj2edtw2j-M-2JOsXxqib3S1AYEyg51cIvnDjYNvGxrczDAySrIVZQa4S1HMMpS6zGA7mAA83lPJdyQXlgutSt885ODGCbDNZzZ9z9JtRgKyTzvdveJ8dlTfUNbY9QJome',
  },
  {
    id: 4,
    name: 'Sarah Sterling',
    title: 'Landscape Designer',
    rating: 4.9,
    reviews: 401,
    price: 150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6YaWDIxLw3E5Q51pBSdyoDDRFqQAAKCCexD5Ie9cdTm-1v2iRU__9A3ZeVPoYk5KGL0T1YDiU33RYGiLzPBWjgiDeBapKLhdgEmtvHBiuftpQfwQ5CJz8G9Jc3mb5Q2sRotVsGdFW1AhdffdmQq4g6wLS3R1yFBoeaE--3GchXNC3U1OlqMr2Gzr8ZXeXKG0sa_aYT4iZme6JJsGmwROpxSdk-n00iuHIkO3-jQSgoxigNFZgn3pI0fHFxavPG-c0FYbO2zOwLQAp',
  },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [profession, setProfession] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (profession) params.append('profession', profession);
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 text-center">YAM</h1>
          <p className="text-xl text-teal-100 mb-12 text-center">Professional services on demand</p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">What do you need?</label>
                <input
                  type="text"
                  placeholder="Electrician, Plumber, Designer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Profession</label>
                <select
                  title="Profession"
                  aria-label="Profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="">All professions</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Professionals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Professionals</h2>
          <p className="text-slate-600">Highly rated experts ready to help</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PROS.map((pro) => (
            <Link
              key={pro.id}
              href={`/professional/${pro.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                {/* Image */}
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img
                    src={pro.image}
                    alt={pro.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{pro.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{pro.title}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                      <span className="text-sm font-semibold text-slate-900">{pro.rating}</span>
                      <span className="text-xs text-slate-500">({pro.reviews})</span>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-slate-900">${pro.price}<span className="text-xs text-slate-600 font-normal">/hr</span></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">How It Works</h2>
            <p className="text-slate-600">Get professional help in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Search', desc: 'Find the right professional for your needs' },
              { step: '2', title: 'Review', desc: 'Check ratings, reviews, and availability' },
              { step: '3', title: 'Book', desc: 'Schedule and confirm your appointment' },
              { step: '4', title: 'Complete', desc: 'Get work done and rate the experience' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/discover"
            className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Browse Professionals
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all"
          >
            Become a Professional
          </Link>
        </div>
      </div>
    </main>
  );
}
