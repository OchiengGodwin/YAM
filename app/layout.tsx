import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pro-Connect | Expert Services on Demand',
    template: '%s | Pro-Connect'
  },
  description: 'The elite platform connecting top-tier professionals with clients in Nairobi.',
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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* You can wrap {children} in a <Navbar /> here later */}
        <main className="flex-grow">
          {children}
        </main>
        {/* You can add a <Footer /> here later */}
      </body>
    </html>
  );
}