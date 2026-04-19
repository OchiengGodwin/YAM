import './globals.css';
import type { Metadata, Viewport } from 'next';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'YAM | Your Professional Services Marketplace',
    template: '%s | YAM'
  },
  description: 'Connect with elite professionals and clients in your city. On-demand expert services, instantly available.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-slate-200 text-center py-8 text-xs text-slate-500">
          <p>© 2026 YAM. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}