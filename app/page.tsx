import Link from 'next/link';

const services = [
  { icon: '🔧', label: 'Mechanic', desc: 'Car repairs & diagnostics' },
  { icon: '⚡', label: 'Electrician', desc: 'Wiring & installations' },
  { icon: '🔩', label: 'Plumber', desc: 'Pipes, leaks & fittings' },
  { icon: '🪛', label: 'Carpenter', desc: 'Furniture & woodwork' },
  { icon: '🎨', label: 'Painter', desc: 'Interior & exterior' },
  { icon: '❄️', label: 'HVAC', desc: 'AC installs & repairs' },
];

const steps = [
  { step: '01', title: 'Choose a service', desc: 'Pick what you need from our list of verified professionals.' },
  { step: '02', title: 'Get matched instantly', desc: 'We find the nearest available pro using your GPS location.' },
  { step: '03', title: 'Job done', desc: 'Your pro arrives, fixes the issue, and you rate the experience.' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen lyft-gradient-bg">
      <nav className="lyft-topbar sticky top-0 z-40 flex justify-between items-center px-6 md:px-12 py-5">
        <span className="text-3xl font-bold text-[var(--primary-brown)]">YAM</span>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="smooth-transition lyft-secondary-btn px-6 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5"
          >
            Pro Login
          </Link>
          <Link 
            href="/signup" 
            className="smooth-transition lyft-primary-btn px-6 py-2.5 rounded-full text-sm font-bold hover:-translate-y-0.5"
          >
            Join as Pro
          </Link>
        </div>
      </nav>

      <section className="px-6 pt-16 pb-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="lyft-pill text-xs font-semibold uppercase tracking-wider mb-4 inline-flex px-3 py-1">
          ✨ On-Demand Professional Services
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-[var(--foreground)]">
            Book skilled pros
            <br />
            in minutes,
            <br />
            <span className="text-[var(--deep-blue)]">right near you</span>
          </h1>
          <p className="text-lg max-w-xl mb-10 text-[var(--dark-brown)]">
            Lyft-style speed for home and field services. Clients request instantly, professionals accept and navigate in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/client"
              className="smooth-transition lyft-primary-btn px-8 py-4 rounded-full font-semibold text-lg text-center hover:-translate-y-0.5"
            >
              I Need a Service
            </Link>
            <Link
              href="/signup"
              className="smooth-transition lyft-secondary-btn px-8 py-4 rounded-full font-semibold text-lg text-center hover:-translate-y-0.5"
            >
              I&apos;m a Professional
            </Link>
          </div>
        </div>

        <div className="lyft-panel p-6">
          <div className="rounded-2xl p-5 bg-[rgba(37,99,235,0.1)] border-2 border-[rgba(37,99,235,0.4)] mb-4">
            <p className="text-xs uppercase tracking-wider font-bold text-[var(--deep-blue)]">Live Demand</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-2">27 requests in your area</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl p-3 bg-[rgba(160,130,109,0.12)] border border-[rgba(160,130,109,0.3)]">
              <p className="text-[var(--dark-brown)]">Avg match time</p>
              <p className="font-bold text-lg text-[var(--foreground)]">1m 42s</p>
            </div>
            <div className="rounded-xl p-3 bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.35)]">
              <p className="text-[var(--deep-blue)]">Verified pros</p>
              <p className="font-bold text-lg text-[var(--foreground)]">1,200+</p>
            </div>
          </div>
          <Link href="/map" className="mt-4 block text-center py-3 rounded-xl font-bold lyft-secondary-btn smooth-transition hover:-translate-y-0.5">
            Open Live Map
          </Link>
        </div>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <h2 className="text-center text-sm uppercase tracking-widest mb-12 font-bold text-[var(--primary-brown)]">
          Available Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.label}
              className="smooth-transition lyft-panel p-6 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <p className="font-bold text-lg mb-1 text-[var(--foreground)]">{s.label}</p>
              <p className="text-sm text-[var(--dark-brown)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-[rgba(160,130,109,0.08)] border-y-2 border-[rgba(37,99,235,0.22)]">
        <h2 className="text-center text-4xl font-bold mb-16 text-[var(--foreground)]">How It Works</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 font-bold text-xl text-white bg-[var(--deep-blue)] border-4 border-[rgba(37,99,235,0.3)]">
                {item.step}
              </div>
              <p className="font-bold text-xl mb-3 text-[var(--foreground)]">{item.title}</p>
              <p className="text-base text-[var(--dark-brown)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6 text-[var(--foreground)]">
          Skilled and ready to earn?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-10 text-[var(--dark-brown)]">
          Join verified professionals already growing their income by connecting with nearby clients.
        </p>
        <Link
          href="/signup"
          className="inline-block smooth-transition lyft-primary-btn px-8 py-4 rounded-full font-bold text-lg hover:-translate-y-0.5"
        >
          Start Earning Today
        </Link>
      </section>

      <footer className="text-center py-10 text-sm border-t-2 border-[rgba(37,99,235,0.22)] text-[var(--primary-brown)]">
        © {new Date().getFullYear()} YAM · Professionals & clients, matched instantly
      </footer>
    </main>
  );
}