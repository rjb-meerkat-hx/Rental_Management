
import React from 'react';
import { Box, ArrowRight, Shield, Zap, Layout, Star, CheckCircle2, Menu, Sparkles, Globe, BarChart3, Users } from 'lucide-react';

interface LandingPageProps {
  onStartAuth: (isAdmin?: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAuth }) => {
  const featuresRef = React.useRef<HTMLElement | null>(null);
  const pricingRef = React.useRef<HTMLElement | null>(null);
  const [showDemo, setShowDemo] = React.useState(false);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300">
              <Box size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">RentFlow<span className="text-indigo-600">Pro</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollTo(featuresRef)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Features</button>
            <button onClick={() => scrollTo(featuresRef)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Solutions</button>
            <button onClick={() => scrollTo(pricingRef)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onStartAuth(false)}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onStartAuth(false)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-indigo-50 rounded-full blur-3xl opacity-60 translate-y-[-600px]"></div>
          <div className="absolute top-[200px] left-[10%] w-[300px] h-[300px] bg-violet-100 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] bg-sky-100 rounded-full blur-[120px] opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> New: Rental Analytics v2.0
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600">
              The OS for Modern Rentals.
            </h1>
            <p className="text-xl text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
              RentFlow Pro empowers businesses to manage inventory, track orders, and delight customers with a sleek, automated platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onStartAuth(false)}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
              >
                Start Free Trial <ArrowRight size={20} />
              </button>
              <button onClick={() => setShowDemo(true)} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-slate-400">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">Trusted by 500+ rental agencies worldwide</p>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="bg-slate-50 rounded-2xl p-6 aspect-square lg:aspect-auto lg:h-[500px] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="w-32 h-4 bg-slate-200 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Active Rentals</div>
                    <div className="text-2xl font-black text-indigo-600 tracking-tight">1,284</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Utilization</div>
                    <div className="text-2xl font-black text-emerald-500 tracking-tight">92%</div>
                  </div>
                </div>
                
                <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-slate-100 border-dashed flex flex-col items-center justify-center text-center">
                  <BarChart3 className="text-indigo-100 mb-4" size={64} />
                  <p className="text-slate-400 font-medium text-sm">Dashboard Preview</p>
                </div>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400 rounded-3xl -z-10 rotate-12 blur-2xl opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-600 rounded-full -z-10 blur-3xl opacity-10"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" ref={featuresRef as any} className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Ecosystem</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Built for speed and scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Real-time Tracking", desc: "Monitor equipment location and status across multiple branch locations instantly." },
              { icon: Shield, title: "Automated Invoicing", desc: "Generate invoices, handle deposits, and process payments automatically via Stripe." },
              { icon: Users, title: "Client Management", desc: "Modern self-service portal for customers to book, extend, or return gear." },
              { icon: Layout, title: "Inventory Master", desc: "Dynamic pricing models for hourly, daily, and long-term rental contracts." },
              { icon: Globe, title: "Omnichannel Access", desc: "Manage your business from your desktop, tablet, or phone anywhere in the world." },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Deep insights into inventory utilization, peak seasons, and revenue forecasting." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" ref={pricingRef as any} className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
              Ready to automate your <br /> <span className="text-indigo-400">rental empire?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              Join thousands of businesses already scaling with RentFlow Pro. Setup takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => onStartAuth(false)}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-100 hover:-translate-y-1 transition-all"
              >
                Try RentFlow Pro Free
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40">
              <div className="flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 size={16} /> No credit card
              </div>
              <div className="flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 size={16} /> Cancel anytime
              </div>
              <div className="flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 size={16} /> 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md px-4">
          <div className="relative w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-950/30 border border-white/10 bg-slate-900">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 z-20 rounded-full bg-white/90 text-slate-900 p-3 shadow-lg shadow-slate-950/10 hover:bg-white transition-colors"
            >
              Close
            </button>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-900 opacity-80" />
              <div className="relative p-10 text-white">
                <div className="max-w-2xl">
                  <p className="uppercase text-xs font-semibold tracking-[0.3em] text-indigo-200 mb-4">Featured Demo</p>
                  <h3 className="text-4xl font-black mb-4">Watch the RentFlow experience in action.</h3>
                  <p className="text-slate-200/90 leading-relaxed mb-8">See how India-focused rentals, inventory, and customer workflows come together in a polished, modern dashboard.</p>
                </div>
              </div>
              <div className="aspect-video relative">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-b-[2rem]"
                  src="https://www.youtube.com/embed/qQujA8u1zGI"
                  title="Sushant KC - Parkha Na ft. Jhuma Limbu (Official Music Video)"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-slate-900 p-2 rounded-xl text-white">
                <Box size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter">RentFlow<span className="text-indigo-600">Pro</span></span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed mb-8">
              The complete operating system for modern equipment rental businesses. Scalable, secure, and smart.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium tracking-tight">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium tracking-tight">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              <li><button onClick={() => onStartAuth(true)} className="hover:text-indigo-600 transition-colors text-left uppercase text-[10px] tracking-widest font-black opacity-50">Admin Login</button></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 text-xs font-bold uppercase tracking-[0.2em]">
          <p>© 2024 RentFlow Global Systems</p>
          <div className="flex items-center gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
