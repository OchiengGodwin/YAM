'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="material-symbols-outlined text-7xl text-teal-600 block mb-4">
            error_outline
          </span>
          <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
          <p className="text-xl text-slate-600">Page not found</p>
        </div>

        <p className="text-slate-600 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 transition-all text-center"
          >
            Go Home
          </Link>
          <Link
            href="/client"
            className="block w-full py-3 rounded-xl font-bold text-teal-600 border-2 border-teal-600 hover:bg-teal-50 transition-colors text-center"
          >
            Find a Professional
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Need help?</p>
          <Link href="/help" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
            Contact Support →
          </Link>
        </div>
      </div>
    </main>
  );
}
