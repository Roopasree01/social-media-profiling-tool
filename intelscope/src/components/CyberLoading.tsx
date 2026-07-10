import React, { useEffect, useState } from "react";
import { Shield, Cpu, Binary, Search, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const steps = [
  "Initializing Ethical Reconnaissance protocols...",
  "Querying public GitHub user endpoints...",
  "Searching public Reddit user JSON endpoints...",
  "Cross-referencing digital footprint markers with Google Grounding...",
  "Querying public profiles on StackOverflow and YouTube...",
  "Searching public Medium developer handles...",
  "Inferring developer technologies and portfolio URLs...",
  "Aggregating public datasets...",
  "Structuring digital footprint risk metrics...",
  "Generating real-time intelligence profile..."
];

export default function CyberLoading({ username }: { username: string }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
      <div className="relative mb-8">
        {/* Animated outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-dashed border-cyan-500/30 flex items-center justify-center"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-dashed border-blue-500/50 flex items-center justify-center"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-slate-900/90 border border-cyan-400 flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>
      </div>

      <h3 className="font-display text-xl text-white font-medium tracking-tight mb-2">
        Scanning footprint of <span className="text-cyan-400">@{username}</span>
      </h3>
      <p className="text-xs font-mono text-slate-400 max-w-md h-8 flex items-center justify-center">
        <Terminal className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep]}
          </motion.span>
        </AnimatePresence>
      </p>

      {/* Progress slider bar */}
      <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 25, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg w-full text-left">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
          <Cpu className="w-5 h-5 text-cyan-400 mb-1" />
          <h4 className="text-xs font-semibold text-slate-300">Targeting</h4>
          <p className="text-[10px] font-mono text-slate-500">Public data only</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
          <Binary className="w-5 h-5 text-blue-400 mb-1" />
          <h4 className="text-xs font-semibold text-slate-300">Mechanism</h4>
          <p className="text-[10px] font-mono text-slate-500">Secure APIs & AI</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
          <Search className="w-5 h-5 text-green-400 mb-1" />
          <h4 className="text-xs font-semibold text-slate-300">Scope</h4>
          <p className="text-[10px] font-mono text-slate-500">Ethical Audit</p>
        </div>
      </div>
    </div>
  );
}
