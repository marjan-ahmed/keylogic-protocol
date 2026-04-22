import React from 'react';
import { motion } from 'motion/react';
import { Brain, ShieldCheck, Zap } from 'lucide-react';

export default function LandingHero() {
  const scrollToTools = () => {
    const element = document.getElementById('predictor-dashboard');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-48 pb-32 overflow-hidden border-b border-black/5">
      <div className="grid-bg absolute inset-0 -z-20 opacity-40" />
      <div className="blob blob-1 !opacity-10 scale-150" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-[1px] w-12 bg-black/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Intelligence Protocol 2.1</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] font-serif font-black mb-12 tracking-[-0.04em] leading-[0.85]"
          >
            Predicting the <br />
            <span className="italic font-normal opacity-20">Statistical </span> <br />
            Unseen.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-xl md:text-2xl font-semibold opacity-60 leading-relaxed mb-16"
          >
            An advanced heuristic model designed to decode hidden examiner logic through past paper ingestion and sequence mapping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-10"
          >
            <button 
              onClick={scrollToTools}
              className="ink-button text-lg px-12 py-5"
            >
              Initialize Sync
            </button>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-paper border border-black/10 flex items-center justify-center text-[10px] font-bold">
                    0{i}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Active Nodes: 2.5k</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Strips */}
        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black/5">
          {[
            {
              title: "Heuristic Mapping",
              desc: "Deep neural analysis of MCQ option cycles.",
              icon: <Brain className="w-5 h-5" />
            },
            {
              title: "Temporal Logic",
              desc: "Mapping answer distribution over 12-month cycles.",
              icon: <Zap className="w-5 h-5" />
            },
            {
              title: "Strategic Edge",
              desc: "Calculated predictions for zero-bias results.",
              icon: <ShieldCheck className="w-5 h-5" />
            }
          ].map((feat, i) => (
            <div key={i} className="p-12 border-r last:border-r-0 border-black/5 hover:bg-black/[0.01] transition-colors group">
              <div className="mb-6 opacity-20 group-hover:opacity-100 transition-opacity">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-serif font-black mb-3">{feat.title}</h3>
              <p className="text-sm font-medium opacity-40 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
