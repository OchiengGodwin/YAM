import Link from 'next/link';

const serviceCards = [
  {
    icon: '🏛️',
    title: 'Strategic Consulting',
    description: 'Deep-dive market analysis and high-level strategy implementation for global scaling.',
  },
  {
    icon: '💼',
    title: 'Financial Management',
    description: 'Tailored asset protection and growth structures for high-net-worth ecosystems.',
  },
  {
    icon: '✅',
    title: 'Brand Sovereignty',
    description: 'Build a resilient identity that commands trust across markets and cultures.',
  },
  {
    icon: '⚙️',
    title: 'Digital Infrastructure',
    description: 'Digital systems and operational architecture designed for ambition and scale.',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'The Audition',
    description: 'A deep discovery session to align our values and identify your unique architectural needs.',
  },
  {
    step: '02',
    title: 'The Blueprint',
    description: 'Co-creating a bespoke strategy document that outlines every pivot and milestone for your ascent.',
  },
  {
    step: '03',
    title: 'The Signature',
    description: 'Seamless execution with high-touch monitoring and iterative refinement of your portfolio.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 md:px-10">
          <div className="text-2xl font-black tracking-tight text-emerald-700">Yam</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <Link href="#portfolio" className="hover:text-emerald-700 transition-colors">Portfolio</Link>
            <Link href="#strategy" className="hover:text-emerald-700 transition-colors">Strategy</Link>
            <Link href="#journal" className="hover:text-emerald-700 transition-colors">Journal</Link>
            <Link href="#vault" className="hover:text-emerald-700 transition-colors">Vault</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-700 hover:text-emerald-700 transition-colors">Notifications</button>
            <Link
              href="/signup"
              className="rounded-xl bg-emerald-700 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 hover:opacity-95 transition"
            >
              Consultation
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-slate-50 px-6 py-16 lg:px-20">
        <div className="mx-auto grid max-w-screen-2xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative z-10">
            <span className="block text-4xl font-semibold text-emerald-600">Yam Atelier</span>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
              Excellence
              <br />
              Handcrafted.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
              Bridging African expertise with global ambition. Bespoke advisory services tailored for the visionary elite.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#start"
                className="rounded-2xl bg-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 hover:scale-[1.01] transition-transform"
              >
                Start Journey
              </Link>
              <Link
                href="#method"
                className="rounded-2xl border border-emerald-700 px-8 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
              >
                Our Method
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-slate-200/50 blur-2xl"></div>
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-300/30 rotate-2 transition-transform duration-700 hover:rotate-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUPco_TgAPw0aloBqPDKvrvtOId4EtX_DZWMS849KhSU0R3CkCHFvvXikLK0hPt7zZ7fgq_DgUbJP8gSmkct1xBHwYj-03dG8g7fcANSvJpochWJPpjfXsLR_sJVyxxB4tUbUGOdB_7NfevaiHtBd__gchKccFN-l-CmGYV-W1P4zqLgpJn71QDjiwA6EjMD9apfmSU3uubxT94Z3fno6qEEV39Is8XH4X4NUfPZHgrpqIiwQ2EqcyL2IHDR_PimaXrvasYcR8L5-w"
                alt="Professional African consultant in a modern office"
                className="h-[620px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-10 right-0 z-20 max-w-xs rounded-[2rem] border-t-4 border-emerald-700 bg-white p-8 shadow-xl shadow-slate-300/30 -rotate-3">
              <p className="text-sm text-slate-500">The Personal Touch</p>
              <p className="mt-3 text-base italic text-slate-600">
                "Every strategy is a signature of our commitment to your growth."
              </p>
              <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <span className="inline-block h-[2px] w-8 bg-emerald-600"></span>
                Yam Advisory Team
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">Available Services</h2>
              <div className="mt-3 h-1 w-24 rounded-full bg-emerald-200"></div>
            </div>
            <p className="text-3xl font-semibold text-emerald-700">Bespoke Excellence</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4 md:grid-rows-2">
            {serviceCards.map((service) => (
              <article
                key={service.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-4xl">{service.icon}</div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="bg-slate-100 py-24 px-6">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="text-4xl font-black text-emerald-700 uppercase tracking-tight">The Atelier Workflow</h2>
          <p className="mt-4 text-2xl font-semibold text-slate-700">Meticulous in every detail</p>
        </div>
        <div className="relative mx-auto mt-16 grid max-w-screen-xl gap-12 px-4 md:grid-cols-3">
          <div className="hidden md:block absolute left-0 top-1/2 h-px w-full bg-slate-300/70 -translate-y-1/2"></div>
          {workflowSteps.map((step) => (
            <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-black text-emerald-700 shadow-lg shadow-slate-200/50 border-4 border-emerald-200">
                {step.step}
              </div>
              <h4 className="text-xl font-bold text-slate-900">{step.title}</h4>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto flex max-w-screen-2xl flex-col overflow-hidden rounded-[2.5rem] bg-emerald-700 text-white lg:flex-row">
          <div className="flex w-full flex-col justify-center p-12 lg:w-1/2 lg:p-20">
            <p className="text-4xl font-semibold text-emerald-200">Join the Circle</p>
            <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
              Are you a specialist
              <br />
              of African origin?
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-8 text-emerald-100/90">
              We are expanding our network of elite consultants. If you offer world-class expertise and a commitment to handcrafted excellence, we invite you to join Yam Atelier.
            </p>
            <Link
              href="/signup"
              className="mt-10 inline-flex w-fit rounded-xl bg-white px-10 py-5 text-lg font-black text-emerald-700 transition hover:opacity-90"
            >
              Apply for Partnership
            </Link>
          </div>

          <div className="relative h-[400px] lg:w-1/2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdUj_TIpTqpNFzgpreLQmqQNmdsRceWRVBI3DsinFCLKoS4gRbXxxi3Yg894TW1P-Z6zs_ijpXDRtrG6by85ZpSETmanYHFoEqcfI0GIdm5mrLGpiwYQI6knuN8GWx4lh29G7KsE2kHpg6paml8aorGRCIuaKehqThUmRFbZCtHQRdfKLLViVREmWkLsmZTehP144D6THnQ0qflKl_cgEaiBqW8AX8F0qQl8oDcYnycQXBSpZKjT_GcSY6tuo0n51KxXcTHTL6OTcj"
              alt="Diverse professionals discussing strategy in a bright minimalist space"
              className="absolute inset-0 h-full w-full object-cover brightness-75 transition duration-1000 hover:brightness-100"
            />
            <div className="absolute inset-0 bg-emerald-800/30"></div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-100 py-12 px-6 text-slate-600">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="text-3xl font-semibold text-emerald-700">Yam</div>
          <div className="flex flex-wrap items-center gap-8 text-xs font-light">
            <Link href="#" className="hover:underline underline-offset-4 decoration-emerald-200">Terms of Service</Link>
            <Link href="#" className="hover:underline underline-offset-4 decoration-emerald-200">Privacy Policy</Link>
            <Link href="#" className="hover:underline underline-offset-4 decoration-emerald-200">Methodology</Link>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Yam Advisory. Handcrafted for excellence.</p>
        </div>
      </footer>
    </main>
  );
}
