'use client';

import React, { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-orange-600 text-2xl">person_off</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Professional not found</h1>
          <Link href="/discover" className="text-orange-600 hover:text-orange-700 font-semibold">
            ← Back to browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/discover"
            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to results
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                  {pro.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">{pro.full_name}</h1>
                      <p className="text-xl text-orange-600 font-semibold mb-2">{pro.profession}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-yellow-400">star</span>
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
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${pro.hourly_rate || 'N/A'}
                        <span className="text-sm text-gray-500 font-normal">/hr</span>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        pro.is_available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          pro.is_available ? 'bg-green-600' : 'bg-gray-600'
                        }`}></span>
                        {pro.is_available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  {pro.is_available && (
                    <Link
                      href={`/book?professional=${pro.id}`}
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {pro.full_name.split(' ')[0]}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Highly experienced {pro.profession} with a commitment to delivering quality work and excellent customer service.
                Available for both residential and commercial projects with flexible scheduling options.
                {pro.profession === 'Electrician' && ' Specializing in residential and commercial electrical work, including installations, repairs, and safety inspections.'}
                {pro.profession === 'Plumber' && ' Expert in plumbing repairs, installations, and maintenance for homes and businesses.'}
                {pro.profession === 'Carpenter' && ' Skilled in custom woodworking, furniture making, and home renovations.'}
                {pro.profession === 'Designer' && ' Creative professional specializing in interior design and space planning.'}
                {pro.profession === 'Mechanic' && ' Automotive expert with years of experience in repairs and maintenance.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-orange-600">verified</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Background Checked</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-orange-600">schedule</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Quick Response</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-orange-600">location_on</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Local Service</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-orange-600">star</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Highly Rated</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Emergency Repairs',
                  'Scheduled Maintenance',
                  'Installations',
                  'Inspections',
                  'Consultations',
                  'Custom Work'
                ].map((service) => (
                  <div key={service} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews ({pro.reviews || 0})</h2>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-400">star</span>
                  <span className="font-semibold text-lg">{pro.rating || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    author: 'John D.',
                    rating: 5,
                    date: '2 weeks ago',
                    text: 'Excellent work! Very professional and completed the job on time. Highly recommend for any electrical work.'
                  },
                  {
                    author: 'Sarah M.',
                    rating: 5,
                    date: '1 month ago',
                    text: 'Outstanding service. Arrived on time, explained everything clearly, and did a fantastic job. Will definitely hire again.'
                  },
                  {
                    author: 'Mike T.',
                    rating: 4,
                    date: '6 weeks ago',
                    text: 'Great service overall. Professional, knowledgeable, and fair pricing. Minor delay but otherwise perfect.'
                  },
                ].map((review, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-sm font-semibold text-orange-600">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm text-yellow-400">star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book {pro.full_name.split(' ')[0]}</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-semibold text-lg">${pro.hourly_rate || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold text-lg">$0</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">${pro.hourly_rate || 'N/A'}</span>
                </div>
              </div>

              {pro.is_available ? (
                <Link
                  href={`/book?professional=${pro.id}`}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Book Now
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                Free cancellation up to 24 hours before
              </p>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">location_on</span>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">schedule</span>
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="font-medium text-gray-900">Within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">language</span>
                  <div>
                    <p className="text-sm text-gray-600">Languages</p>
                    <p className="font-medium text-gray-900">English, Swahili</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-gray-600">chat</span>
                  <span className="font-medium text-gray-900">Send Message</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-gray-600">call</span>
                  <span className="font-medium text-gray-900">Call Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
