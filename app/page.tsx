'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SERVICES = [
  { name: 'Cleaning', icon: 'cleaning_services', color: 'bg-blue-500' },
  { name: 'Moving', icon: 'local_shipping', color: 'bg-green-500' },
  { name: 'Handyman', icon: 'build', color: 'bg-orange-500' },
  { name: 'Electrical', icon: 'bolt', color: 'bg-yellow-500' },
  { name: 'Plumbing', icon: 'plumbing', color: 'bg-cyan-500' },
  { name: 'Painting', icon: 'format_paint', color: 'bg-purple-500' },
  { name: 'Gardening', icon: 'grass', color: 'bg-green-600' },
  { name: 'Carpentry', icon: 'carpenter', color: 'bg-amber-600' },
];

const FEATURED_PROS = [
  {
    id: 1,
    name: 'Marcus Chen',
    title: 'Master Electrician',
    rating: 4.9,
    reviews: 324,
    price: 120,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true,
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    title: 'Interior Architect',
    rating: 5.0,
    reviews: 512,
    price: 185,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    verified: true,
  },
  {
    id: 3,
    name: 'Julian Voss',
    title: 'Custom Cabinetry',
    rating: 4.8,
    reviews: 287,
    price: 95,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true,
  },
  {
    id: 4,
    name: 'Sarah Sterling',
    title: 'Landscape Designer',
    rating: 4.9,
    reviews: 401,
    price: 150,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    verified: true,
  },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [profession, setProfession] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (profession) params.set('profession', profession);
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get help with<br />
              <span className="text-orange-100">life's tasks</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-2xl mx-auto">
              Connect with trusted local professionals for all your home and business needs
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 text-lg"
                  />
                </div>
                <div className="md:w-48">
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 border-0 focus:ring-0 bg-gray-50 rounded-lg"
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
                <button
                  onClick={handleSearch}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <Link
                key={service.name}
                href={`/discover?profession=${service.name}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200"
              >
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-white text-2xl">
                    {service.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {service.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Professionals
            </h2>
            <p className="text-lg text-gray-600">
              Meet some of our top-rated service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PROS.map((pro) => (
              <Link
                key={pro.id}
                href={`/professional/${pro.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={pro.image}
                    alt={pro.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                    {pro.verified && (
                      <span className="material-symbols-outlined text-green-600 text-sm" title="Verified">
                        verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pro.title}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                    <span className="font-semibold text-sm">{pro.rating}</span>
                    <span className="text-sm text-gray-500">({pro.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${pro.price}/hr</span>
                    <span className="text-orange-600 font-semibold group-hover:text-orange-700">
                      Book now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why choose YAM?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">verified_user</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Professionals</h3>
                <p className="text-gray-600">All our service providers are background-checked and verified</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">schedule</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">Book services at your convenience, 7 days a week</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">security</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600">Your payments are protected and only released after job completion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of satisfied customers who trust YAM for their service needs
          </p>
          <Link
            href="/discover"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </section>
    </div>
  );
}

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
