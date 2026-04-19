'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  // Hide navbar on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-amber-800 border-b border-amber-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-black text-white italic">YAM</div>
            <span className="hidden sm:inline text-xs font-semibold text-amber-100 uppercase tracking-wider">Professional Services</span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center bg-amber-700 rounded-lg p-1">
            <Link href="/" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${pathname === '/' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-100 hover:bg-amber-600 hover:text-white'}`}>
              Home
            </Link>
            <Link href="/discover" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${pathname === '/discover' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-100 hover:bg-amber-600 hover:text-white'}`}>
              Browse
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${pathname === '/dashboard' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-100 hover:bg-amber-600 hover:text-white'}`}>
                  Dashboard
                </Link>
                <Link href="/admin" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${pathname === '/admin' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-100 hover:bg-amber-600 hover:text-white'}`}>
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-amber-100">{user.email?.split('@')[0]}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-600 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline px-4 py-2 text-sm font-semibold text-amber-100 hover:text-white">
                  Sign In
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-amber-800 bg-white rounded-lg hover:bg-amber-50 transition-all">
                  Become Pro
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white hover:bg-amber-700 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-amber-700 pt-4">
            <Link href="/" className="block px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-700 rounded transition-colors">
              Home
            </Link>
            <Link href="/discover" className="block px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-700 rounded transition-colors">
              Browse
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-700 rounded transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin" className="block px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-700 rounded transition-colors">
                  Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-600 rounded transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
