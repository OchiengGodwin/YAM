'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BookPage() {
  const [step, setStep] = useState(1);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert('Booking confirmed! You will receive a confirmation email shortly.');
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    s <= step
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Service Details</span>
            <span>Your Details</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
          {/* Step 1: Service Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Service Details</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                <input
                  title="Booking Date"
                  aria-label="Booking Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                  <input
                    title="Booking Time"
                    aria-label="Booking Time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (hrs)</label>
                  <select
                    title="Duration"
                    aria-label="Duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5+ hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input
                  title="Service Location"
                  aria-label="Service Location"
                  type="text"
                  placeholder="Enter service location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe what you need..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 2: Your Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Details</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  title="Full Name"
                  aria-label="Full Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  title="Email Address"
                  aria-label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  title="Phone Number"
                  aria-label="Phone Number"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <p className="text-sm text-teal-900">
                  <span className="font-semibold">We'll use these details</span> to send you booking confirmations and updates
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Confirm Booking</h2>
              </div>

              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-slate-600">Date & Time:</span>
                  <span className="font-semibold text-slate-900">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-semibold text-slate-900">{formData.duration} hour(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-semibold text-slate-900">{formData.location}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="font-semibold text-slate-900">Estimated Total:</span>
                  <span className="text-xl font-bold text-teal-600">${parseInt(formData.duration) * 120}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ✓ Your booking request will be sent to the professional. You'll receive a confirmation within 2 hours.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className={`flex-1 py-3 text-white font-semibold rounded-lg transition-all ${
                step === 3
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90'
              }`}
            >
              {step === 3 ? 'Confirm Booking' : 'Continue'}
            </button>
          </div>
        </form>

        {/* footer CTA */}
        {step === 3 && (
          <div className="text-center">
            <Link href="/discover" className="text-teal-600 hover:text-teal-700 font-semibold">
              ← Browse more professionals
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
