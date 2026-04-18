'use client';

import { useState } from 'react';

export default function RequestService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotos(prev => [...prev, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-blue-700 italic">YAM</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a className="text-slate-600 hover:text-blue-600 font-semibold transition-colors" href="#">Find a Pro</a>
            <a className="text-slate-600 hover:text-blue-600 font-semibold transition-colors" href="#">Services</a>
            <a className="text-slate-600 hover:text-blue-600 font-semibold transition-colors" href="#">How It Works</a>
          </nav>
          <button className="px-6 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-all">
            Sign In
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-2">
            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Schedule' },
              { num: 3, label: 'Location' },
              { num: 4, label: 'Summary' }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white transition-all ${
                    step.num <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {step.num}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  step.num <= currentStep ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          <div className="relative z-10">
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {currentStep === 1 && 'Describe your issue'}
                {currentStep === 2 && 'Choose your schedule'}
                {currentStep === 3 && 'Your location'}
                {currentStep === 4 && 'Review your request'}
              </h1>
              <p className="text-slate-500 font-medium">
                {currentStep === 1 && 'Be as detailed as possible so our pros can provide an accurate estimate.'}
                {currentStep === 2 && 'Select your preferred date and time for the service.'}
                {currentStep === 3 && 'Enter the location where you need the service.'}
                {currentStep === 4 && 'Review all details before submitting your request.'}
              </p>
            </div>

            <form className="space-y-8">
              {currentStep === 1 && (
                <>
                  {/* Issue Description */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Problem Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us what needs fixing or what service you're looking for..."
                      rows={5}
                      className="w-full bg-slate-50 border-0 border-b-2 border-slate-300 focus:border-blue-600 focus:ring-0 transition-all rounded-t-xl px-6 py-4 placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  {/* Photo Upload Area */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Visual Reference (Optional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all group">
                        <input 
                          type="file" 
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-blue-600 mb-2">add_a_photo</span>
                        <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 text-center">Add Photo</span>
                      </label>

                      {photos.map((photo, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group">
                          <img 
                            src={photo}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))}

                      {photos.length < 5 && (
                        <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-300">
                          <p className="text-xs text-center px-4 text-slate-500 font-medium">
                            Upload up to {5 - photos.length} photo{5 - photos.length !== 1 ? 's' : ''} to help pros understand the scope.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reassurance Block */}
                  <div className="bg-emerald-50 rounded-2xl p-6 flex items-start gap-4 border border-emerald-200">
                    <span className="material-symbols-outlined text-emerald-600 flex-shrink-0">verified_user</span>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900 mb-1">YAM Trust Guarantee</h4>
                      <p className="text-xs text-emerald-700 leading-relaxed">Your description helps us match you with the right specialist. All YAM Pros are background-checked and vetted for quality.</p>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="preferred-date" className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Preferred Date</label>
                    <input
                      id="preferred-date"
                      type="date"
                      title="Select a preferred date for service"
                      className="w-full px-6 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="preferred-time" className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Preferred Time</label>
                    <select id="preferred-time" title="Select a preferred time for service" className="w-full px-6 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-0 transition-all">
                      <option>Morning (8:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 4:00 PM)</option>
                      <option>Evening (4:00 PM - 8:00 PM)</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Street Address</label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      className="w-full px-6 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">City</label>
                      <input
                        type="text"
                        placeholder="San Francisco"
                        className="w-full px-6 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-0 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">ZIP Code</label>
                      <input
                        type="text"
                        placeholder="94105"
                        className="w-full px-6 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-0 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">Description</h3>
                      <p className="text-sm text-slate-600">{description || 'No description provided'}</p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="text-sm font-bold text-slate-700 mb-2">Photos Attached</h3>
                      <p className="text-sm text-slate-600">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-lg shadow-xl hover:opacity-90 transition-all">
                    Submit Request
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className={`text-sm font-bold hover:text-slate-900 transition-colors ${
                    currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600'
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-10 py-3 rounded-full font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                    currentStep === 4
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:opacity-90'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90'
                  }`}
                >
                  {currentStep === 4 ? 'Submit' : 'Next Step'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Contextual Information */}
      <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lightbulb</span>
            Pro Tip
          </h3>
          <p className="text-sm text-amber-800">Include specific model numbers or brands if applicable. This allows pros to bring the correct parts on their first visit.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-100 border border-slate-300">
          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            Need Help?
          </h3>
          <p className="text-sm text-slate-600 italic">"We're here to guide you through the booking process if you're unsure about the service type."</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 w-full py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="font-black text-slate-900 text-2xl italic">YAM</div>
            <p className="text-slate-500 text-sm max-w-xs">Connecting elite professionals with premium residential and commercial needs since 2024.</p>
            <p className="text-slate-400 text-sm italic">© {new Date().getFullYear()} YAM Professional Services. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-3">
              <span className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-2">Company</span>
              <a className="text-slate-500 hover:text-blue-600 text-sm transition-all underline decoration-amber-400 underline-offset-4" href="#">Become a Pro</a>
              <a className="text-slate-500 hover:text-blue-600 text-sm transition-all underline decoration-amber-400 underline-offset-4" href="#">Support</a>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-2">Legal</span>
              <a className="text-slate-500 hover:text-blue-600 text-sm transition-all underline decoration-amber-400 underline-offset-4" href="#">Privacy Policy</a>
              <a className="text-slate-500 hover:text-blue-600 text-sm transition-all underline decoration-amber-400 underline-offset-4" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center p-3 pb-safe bg-white shadow-lg rounded-t-xl z-50">
        <a className="flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined text-sm">home</span>
          <span className="text-xs font-bold uppercase tracking-wider">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-blue-700 bg-amber-50 rounded-xl px-4 py-1 active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span className="text-xs font-bold uppercase tracking-wider">Request</span>
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
