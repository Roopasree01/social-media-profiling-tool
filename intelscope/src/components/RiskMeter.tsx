import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { RiskAssessment } from "../types";
import { motion } from "motion/react";

export default function RiskMeter({ assessment }: { assessment: RiskAssessment }) {
  const { riskScore, level, factors, recommendations } = assessment;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score < 65) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Risk Gauge */}
      <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col items-center justify-center text-center cyber-glow-red">
        <h4 className="font-display text-sm font-semibold tracking-wide text-slate-400 uppercase mb-4">
          Digital Exposure Index
        </h4>

        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Arc */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="427"
              strokeDashoffset="100"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <motion.circle
              cx="80"
              cy="80"
              r="68"
              stroke={riskScore < 30 ? "#10b981" : riskScore < 65 ? "#f59e0b" : "#ef4444"}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="427"
              initial={{ strokeDashoffset: 427 }}
              animate={{ strokeDashoffset: 427 - (327 * riskScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-white leading-none">
              {riskScore}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
              {level} Risk
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-xs mt-2">
          This indicator measures the exposure weight of publicly available metadata, open repository logs, and contact vectors across social networks.
        </p>
      </div>

      {/* Threat Factors */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-white mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-red-400" />
            Detected Vector Vulnerabilities
          </h3>

          <div className="space-y-3">
            {factors.map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/60 border border-slate-800/60 rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-900/40"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${getRiskBadgeColor(item.risk)}`}>
                      {item.risk}
                    </span>
                    <span className="text-sm text-slate-200 font-medium">{item.factor}</span>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {expandedIndex === index && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-sans bg-slate-950/40">
                    {item.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Countermeasures */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-emerald-400" />
            Recommended Threat Hardening
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3.5 flex items-start space-x-3"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
