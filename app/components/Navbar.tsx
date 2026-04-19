'use client';

import { useState, useEffect } from 'react';
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
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-black text-teal-600 italic">YAM</div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase tracking-wider">Professional Services</span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-semibold transition-colors ${pathname === '/' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}>
              Home
            </Link>
            <Link href="/discover" className={`text-sm font-semibold transition-colors ${pathname === '/discover' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}>
              Browse
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className={`text-sm font-semibold transition-colors ${pathname === '/dashboard' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}>
                  Dashboard
                </Link>
                <Link href="/admin" className={`text-sm font-semibold transition-colors ${pathname === '/admin' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}>
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-600">{user.email?.split('@')[0]}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                  Sign In
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:opacity-90 transition-all">
                  Become Pro
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-200 pt-4">
            <Link href="/" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors">
              Home
            </Link>
            <Link href="/discover" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors">
              Browse
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors">
                  Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded transition-colors"
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
