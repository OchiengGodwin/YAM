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
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 border-b border-slate-800">
        <span className="text-2xl font-extrabold tracking-tight text-blue-400">YAM</span>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full border border-slate-600 text-slate-300 text-sm font-medium hover:border-slate-400 transition">
            Pro Login
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition">
            Join as Pro
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
          Your City. Your Pros.
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Any service, anywhere,
          <br />
          <span className="text-blue-400">in minutes.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
          Connect with verified local professionals instantly — like ordering a ride, but for skilled services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/client"
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition shadow-lg shadow-blue-900/50"
          >
            I Need a Service
          </Link>
          <Link
            href="/signup"
            className="px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg hover:bg-slate-700 border border-slate-600 transition"
          >
            I&apos;m a Professional
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-center text-slate-500 text-sm uppercase tracking-widest mb-8">
          Services Available
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.label}
              className="p-5 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 transition cursor-pointer group"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <p className="font-bold text-white group-hover:text-blue-400 transition">{s.label}</p>
              <p className="text-slate-400 text-sm mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-800 py-16 px-6">
        <h2 className="text-center text-2xl font-bold mb-12">How It Works</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((item) => (
            <div key={item.step}>
              <div className="text-blue-400 font-mono text-4xl font-bold mb-3">{item.step}</div>
              <p className="font-bold text-lg mb-2">{item.title}</p>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Are you a skilled professional?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Join hundreds of pros already earning more by connecting with clients near them.
        </p>
        <Link
          href="/signup"
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition"
        >
          Start Earning Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} YAM Pro-Connect · Built for Nairobi and beyond.
      </footer>
    </main>
  );
}