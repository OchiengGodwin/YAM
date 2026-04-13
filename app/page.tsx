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
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFDFB 0%, #F5F0E8 100%)' }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b" style={{ borderColor: 'rgba(160, 130, 109, 0.2)' }}>
        <span className="text-3xl font-bold" style={{ color: '#A0826D' }}>YAM</span>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="smooth-transition px-6 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              color: '#A0826D',
              border: '2px solid #A0826D',
            }}
          >
            Pro Login
          </Link>
          <Link 
            href="/signup" 
            className="smooth-transition px-6 py-2.5 rounded-full text-white text-sm font-bold hover:shadow-lg"
            style={{ 
              backgroundColor: '#A0826D',
            }}
          >
            Join as Pro
          </Link>
        </div>
      </nav>

      {/* Hero with Map Focus */}
      <section className="px-6 pt-16 pb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#3B82F6' }}>
          ✨ On-Demand Professional Services
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: '#333333' }}>
          Any service,
          <br />
          <span style={{ color: '#A0826D' }}>anywhere,</span>
          <br />
          <span style={{ color: '#3B82F6' }}>instantly</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-12" style={{ color: '#5F4A42' }}>
          Connect with verified local professionals instantly — like ordering a ride, but for skilled services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/client"
            className="smooth-transition px-8 py-4 rounded-full font-semibold text-lg text-white shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: '#A0826D',
            }}
          >
            I Need a Service
          </Link>
          <Link
            href="/signup"
            className="smooth-transition px-8 py-4 rounded-full font-semibold text-lg glass-effect"
            style={{ 
              color: '#333333',
            }}
          >
            I&apos;m a Professional
          </Link>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div 
          className="rounded-3xl h-96 flex items-center justify-center text-center glass-effect"
          style={{ background: 'rgba(59, 130, 246, 0.08)' }}
        >
          <div>
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-lg font-semibold" style={{ color: '#5F4A42' }}>
              Local professionals near you
            </p>
            <p className="text-sm" style={{ color: '#A0826D' }}>
              Sign in to see availability in your area
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-center text-sm uppercase tracking-widest mb-12 font-bold" style={{ color: '#A0826D' }}>
          Available Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.label}
              className="smooth-transition p-6 rounded-2xl hover:shadow-lg cursor-pointer glass-effect"
              style={{ background: 'rgba(160, 130, 109, 0.08)' }}
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <p className="font-bold text-lg mb-1" style={{ color: '#333333' }}>{s.label}</p>
              <p className="text-sm" style={{ color: '#5F4A42' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6" style={{ background: 'rgba(160, 130, 109, 0.06)' }}>
        <h2 className="text-center text-4xl font-bold mb-16" style={{ color: '#333333' }}>How It Works</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 font-bold text-xl text-white"
                style={{ backgroundColor: '#A0826D' }}
              >
                {item.step}
              </div>
              <p className="font-bold text-xl mb-3" style={{ color: '#333333' }}>{item.title}</p>
              <p className="text-base" style={{ color: '#5F4A42' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6" style={{ color: '#333333' }}>
          Skilled and ready to earn?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#5F4A42' }}>
          Join hundreds of verified professionals already growing their income by connecting with clients near them.
        </p>
        <Link
          href="/signup"
          className="inline-block smooth-transition px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#A0826D' }}
        >
          Start Earning Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-sm border-t" style={{ borderColor: 'rgba(160, 130, 109, 0.2)', color: '#A0826D' }}>
        © {new Date().getFullYear()} YAM · Connect Professionals with Clients Instantly
      </footer>
    </main>
  );
}