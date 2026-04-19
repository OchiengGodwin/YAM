'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BookingClient() {
  const searchParams = useSearchParams();
  const professionalId = searchParams.get('professional');

  const [step, setStep] = useState(1);
  const [professional, setProfessional] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '1',
    location: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

  useEffect(() => {
    if (professionalId) {
      const fetchProfessional = async () => {
        try {
          const res = await fetch(`${API_URL}/all-pros`);
          const result = await res.json();
          if (result.status === 'success') {
            const found = result.data.find((p: any) => p.id === parseInt(professionalId, 10));
            setProfessional(found);
          }
        } catch (error) {
          console.error('Failed to fetch professional:', error);
        }
      };
      fetchProfessional();
    }
  }, [professionalId, API_URL]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert('Booking confirmed! You will receive a confirmation email shortly.');
    }
  };

  const calculateTotal = () => {
    const hourlyRate = professional?.hourly_rate || 120;
    const hours = parseInt(formData.duration, 10);
    return hourlyRate * hours;
  };

  const steps = [
    { number: 1, title: 'Service Details', description: 'When and where' },
    { number: 2, title: 'Your Details', description: 'Contact information' },
    { number: 3, title: 'Confirm Booking', description: 'Review and book' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={professional ? `/professional/${professional.id}` : '/discover'}
            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {professional ? `Back to ${professional.full_name}` : 'Back to browse'}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      s.number <= step
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s.number}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`text-sm font-semibold ${s.number <= step ? 'text-orange-600' : 'text-gray-500'}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500">{s.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 mt-[-20px] ${
                      s.number < step ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Service Details</h2>
                    <p className="text-gray-600">Tell us when and where you need service</p>
                  </div>

                  {professional && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {professional.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Booking with {professional.full_name}</p>
                          <p className="text-sm text-gray-600">{professional.profession}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                      <input
                        title="Booking Date"
                        aria-label="Booking Date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                      <input
                        title="Booking Time"
                        aria-label="Booking Time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                    <select
                      title="Duration"
                      aria-label="Duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="5">5 hours</option>
                      <option value="6">6 hours</option>
                      <option value="7">7 hours</option>
                      <option value="8">8+ hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Location</label>
                    <input
                      title="Service Location"
                      aria-label="Service Location"
                      type="text"
                      placeholder="Enter your address"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Task</label>
                    <textarea
                      placeholder="Describe what you need help with..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">Be specific about what you need done</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
                    <p className="text-gray-600">We need this information to confirm your booking</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      title="Full Name"
                      aria-label="Full Name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      title="Email Address"
                      aria-label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      title="Phone Number"
                      aria-label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">We'll use these details to:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Send booking confirmations</li>
                          <li>• Contact you about your service</li>
                          <li>• Share your details with the professional</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Booking</h2>
                    <p className="text-gray-600">Review your details and confirm your booking</p>
                  </div>

                  <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Date:</span>
                      <span className="font-semibold text-gray-900">{formData.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Start Time:</span>
                      <span className="font-semibold text-gray-900">{formData.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{formData.duration} hour{formData.duration !== '1' ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold text-gray-900">{formData.location}</span>
                    </div>
                    {formData.description && (
                      <div>
                        <span className="text-gray-600 block mb-1">Description:</span>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border">{formData.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-600 mt-0.5">check_circle</span>
                      <div>
                        <p className="text-sm font-semibold text-green-900 mb-1">What happens next?</p>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Professional will confirm within 2 hours</li>
                          <li>• You'll receive booking confirmation via email</li>
                          <li>• Payment is collected after service completion</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {step === 3 ? 'Confirm Booking' : 'Continue'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Summary</h3>

              {professional && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {professional.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{professional.full_name}</p>
                    <p className="text-sm text-gray-600">{professional.profession}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-semibold">${professional?.hourly_rate || 120}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{formData.duration} hour{formData.duration !== '1' ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">$0</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${calculateTotal()}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">verified</span>
                  <span>Background checked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">schedule</span>
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">security</span>
                  <span>Secure payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
