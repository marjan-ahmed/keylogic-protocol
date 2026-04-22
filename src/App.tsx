import React from 'react';
import LandingHero from './components/LandingHero';
import PatternDashboard from './components/PatternDashboard';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-paper/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black flex items-center justify-center rounded-sm">
              <span className="text-white font-serif font-black text-xl italic uppercase">K</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">KeyLogic Protocol</span>
          </div>
          
          <div className="flex items-center gap-10">
             <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Archive</a>
             <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">System Stats</a>
             <button className="ink-button !py-2 !px-6 text-[10px] tracking-widest flex items-center gap-2">
                Sync Now <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </nav>

      <main>
        <LandingHero />
        <section id="predictor-dashboard" className="py-20">
          <PatternDashboard />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ink text-paper py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-32">
          <div className="space-y-10">
            <h2 className="text-6xl font-serif font-black italic">The Future of <br /> Pattern Integrity.</h2>
            <p className="opacity-40 max-w-sm text-lg leading-relaxed">
              Deciphering the statistical bias of educational assessments through advanced heuristic modelling.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Resources</span>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="opacity-60 hover:opacity-100 cursor-pointer">Documentation</li>
                  <li className="opacity-60 hover:opacity-100 cursor-pointer">API Access</li>
                  <li className="opacity-60 hover:opacity-100 cursor-pointer">Case Studies</li>
                </ul>
             </div>
             <div className="space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Legal</span>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="opacity-60 hover:opacity-100 cursor-pointer">Privacy Protocol</li>
                  <li className="opacity-60 hover:opacity-100 cursor-pointer">Terms of Sync</li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-30">
          <span>© 2026 KeyLogic Labs. All rights reserved.</span>
          <div className="flex gap-6">
             <Sparkles className="w-4 h-4" />
             <span>Sub-Neural Mapping Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
