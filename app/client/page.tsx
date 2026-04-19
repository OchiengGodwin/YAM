'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';

const professionals = [
  {
    id: 1,
    name: 'Marcus Chen',
    title: 'Master Electrician',
    rating: 4.9,
    hourly: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC_DQu8E5zDR6uWp3-nCtrO5QLDFgtwchccgdaBZii5lRPM8_QRgHzJ0HHcCm8x88HdA6Ot8hYD1frEl5QGG2cuYDWIpUF_7NflKOpiVhZsZ22COiIA4NwYDBl_FOXg6H_C0A5j_5pmdtn0z6U_xBaY1jJ73_5tsk8XS9ZRYxP674wBwrYnwMZ1ft3M1M9_BJAXsvT0V99wqR3y7P0RMjuHDwBLoKQxGqRa2KKLWCuqKiypeoqCRCjPvo-iaWYtQ7PNKQRWzBbBwlq',
    quote: 'Providing high-end smart home integration and electrical safety audits for over 15 years.',
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    title: 'Interior Architect',
    rating: 5.0,
    hourly: 185,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW9z3TgCbDX5E2PfCyOAsXNRT0fPs8sVQs8b7XauSzEbdhcfE-brWLTDy1QbR9MOg-lkEGPbBIKG9a3fesd68wyeoZDTIabMiXQ4wNlNQ1Ec5x4Dl8x3gIbRJhB_oCG2EFwGInvrYTSuPknbDDimsV4dmZV9cJvxDn1vSssruNakvVZb5Xe-BZQ0GTLqCF6XnC4EH8TbnFPzvMQtMziGAfvYMFwYYZGtXVXpAJQO9d4-BbpVaENoQ97drBchKo0dvoNfoRuETgkZIC',
    quote: 'Specializing in sustainable space optimization and high-end residential renovations.',
    featured: true,
  },
  {
    id: 3,
    name: 'Julian Voss',
    title: 'Custom Cabinetry',
    rating: 4.8,
    hourly: 95,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmivu-6zvzcDxaHRjZ7w83YsgI3APMCqRN6Bse8glmDoElMNKxZf9j8dvGQ3tBwYiJZDfP4AcD_P06VDOVD3GkUZD7DwC645Lp29BWZSvAgfILEpKUvmaYuzQeB4XUuj4JzY03PAaY6xcj2edtw2j-M-2JOsXxqib3S1AYEyg51cIvnDjYNvGxrczDAySrIVZQa4S1HMMpS6zGA7mAA83lPJdyQXlgutSt885ODGCbDNZzZ9z9JtRgKyTzvdveJ8dlTfUNbY9QJome',
    quote: 'Artisanal woodwork and bespoke furniture repairs for discerning homeowners.',
  },
  {
    id: 4,
    name: 'Sarah Sterling',
    title: 'Landscape Designer',
    rating: 4.9,
    hourly: 150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6YaWDIxLw3E5Q51pBSdyoDDRFqQAAKCCexD5Ie9cdTm-1v2iRU__9A3ZeVPoYk5KGL0T1YDiU33RYGiLzPBWjgiDeBapKLhdgEmtvHBiuftpQfwQ5CJz8G9Jc3mb5Q2sRotVsGdFW1AhdffdmQq4g6wLS3R1yFBoeaE--3GchXNC3U1OlqMr2Gzr8ZXeXKG0sa_aYT4iZme6JJsGmwROpxSdk-n00iuHIkO3-jQSgoxigNFZgn3pI0fHFxavPG-c0FYbO2zOwLQAp',
    quote: 'Curating exterior sanctuaries that blend modern aesthetics with local ecology.',
  },
];

export default function FindAProfessional() {
  const [sortBy, setSortBy] = useState('top-rated');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-teal-600 italic">YAM</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a className="text-blue-700 border-b-2 border-blue-600 pb-1 font-semibold" href="#">Find a Pro</a>
            <a className="text-slate-600 hover:text-blue-600 font-semibold transition-colors" href="#">Services</a>
            <a className="text-slate-600 hover:text-blue-600 font-semibold transition-colors" href="#">How It Works</a>
          </nav>
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text"
                placeholder="Search pros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-600 w-64"
              />
            </div>
            <button className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-10 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-72 flex-shrink-0 space-y-10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Filters</h2>
            
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Service Type</h3>
              <div className="space-y-3">
                <label className="flex items-center group cursor-pointer">
                  <input checked type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 h-5 w-5 mr-3" />
                  <span className="text-slate-900 group-hover:text-teal-600 transition-colors">Home Maintenance</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 h-5 w-5 mr-3" />
                  <span className="text-slate-900 group-hover:text-teal-600 transition-colors">Business Consulting</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 h-5 w-5 mr-3" />
                  <span className="text-slate-900 group-hover:text-teal-600 transition-colors">Wellness & Care</span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Rating</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-full text-xs font-bold shadow-sm">4+ Stars</button>
                <button className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors">All Ratings</button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Price Range</h3>
              <div className="px-2">
                <input type="range" min="20" max="500" title="Price range filter" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
                  <span>$20</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Availability</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 border-b-2 border-transparent hover:border-blue-600 transition-all text-left">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-blue-600 mr-2 text-sm">bolt</span>
                    <span className="text-sm font-medium">Same day</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 border-b-2 border-transparent hover:border-blue-600 transition-all text-left">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-amber-700 mr-2 text-sm">calendar_today</span>
                    <span className="text-sm font-medium">Scheduled</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-100 p-6 rounded-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black text-amber-900 text-lg mb-2 leading-tight">Become a Pro</h4>
              <p className="text-amber-900/80 text-sm mb-4">Join our elite network of verified consultants and specialists.</p>
              <button className="text-amber-900 font-bold text-xs underline underline-offset-4 decoration-2 decoration-amber-700">Apply Now</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-amber-900/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">verified</span>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Results in "Home Maintenance"</h1>
              <p className="text-slate-500 font-medium">Found {professionals.length} professionals near you</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500">Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} title="Sort professionals by rating, price, or distance" className="bg-slate-100 border-none rounded-xl text-sm font-bold py-2 pl-4 pr-10 focus:ring-2 focus:ring-blue-600 cursor-pointer">
                <option value="top-rated">Top Rated</option>
                <option value="lowest-price">Lowest Price</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {professionals.map((pro) => (
              <div 
                key={pro.id} 
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow group relative flex flex-col sm:flex-row gap-6 ${pro.featured ? 'border-l-4 border-amber-600' : ''}`}
              >
                <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    alt="Professional portrait"
                    src={pro.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {pro.featured && (
                    <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-black px-2 py-1 rounded uppercase tracking-tighter shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{pro.name}</h3>
                      <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{pro.title}</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg flex items-center text-xs font-bold">
                      ⭐
                      {pro.rating}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed italic">"{pro.quote}"</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-slate-500 font-bold block uppercase tracking-tighter">Starting at</span>
                      <span className="text-2xl font-black text-slate-900">${pro.hourly}<span className="text-sm font-normal text-slate-500">/hr</span></span>
                    </div>
                    <button className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center">
                      View Profile
                      <span className="material-symbols-outlined text-sm ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors font-bold">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors font-bold">3</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors font-bold">8</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-slate-50 w-full py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="font-black text-2xl text-slate-900 italic mb-4">YAM</div>
            <p className="text-sm text-slate-500 max-w-sm">© {new Date().getFullYear()} YAM Professional Services. All rights reserved. Connecting elite talent with exceptional opportunities.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
            <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4 transition-all" href="#">Privacy Policy</a>
            <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4 transition-all" href="#">Terms of Service</a>
            <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4 transition-all font-bold" href="#">Become a Pro</a>
            <a className="text-sm text-slate-500 hover:text-blue-600 underline decoration-amber-400 underline-offset-4 transition-all" href="#">Support</a>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center p-3 pb-safe bg-white shadow-lg rounded-t-xl z-50">
        <a className="flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined text-sm">home</span>
          <span className="text-xs font-bold uppercase tracking-wider">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-blue-700 bg-amber-50 rounded-xl px-4 py-1 active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined text-sm">search</span>
          <span className="text-xs font-bold uppercase tracking-wider">Search</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          <span className="text-xs font-bold uppercase tracking-wider">Bookings</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined text-sm">person</span>
          <span className="text-xs font-bold uppercase tracking-wider">Profile</span>
        </a>
      </nav>
    </main>
  );
}
