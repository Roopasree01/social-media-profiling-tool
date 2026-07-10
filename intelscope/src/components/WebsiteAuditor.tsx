import React, { useState } from "react";
import { Link2, Globe, ShieldCheck, Mail, Cpu, Terminal, RefreshCw, AlertCircle } from "lucide-react";
import { WebsiteAnalysis } from "../types";
import { motion } from "motion/react";

export default function WebsiteAuditor({
  initialUrl,
  onAnalyze,
  isLoading,
  currentAnalysis,
  error,
}: {
  initialUrl?: string;
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  currentAnalysis: WebsiteAnalysis | null;
  error: string | null;
}) {
  const [url, setUrl] = useState(initialUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim());
  };

  return (
    <div className="space-y-6">
      {/* Search/Initiate Audit */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-white mb-2 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-cyan-400" />
          Public Website & Portfolio Audit
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Audit portfolio landing pages, developer blogs, or company domains. We inspect HTML metadata tags, framework footprints, and check security configs ethically.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://john-portfolio.dev"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-200 outline-none transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="bg-cyan-550 hover:bg-cyan-500 text-slate-900 font-semibold px-5 py-3 rounded-lg text-sm flex items-center space-x-2 cursor-pointer transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#06b6d4" }}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                <span>Auditing...</span>
              </>
            ) : (
              <span>Analyze URL</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Audit Report Results */}
      {currentAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Main Info */}
          <div className="md:col-span-8 space-y-6">
            {/* Headers & SEO metadata */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h4 className="font-display text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                SEO & Crawler Header Tags
              </h4>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    Page HTML Title
                  </span>
                  <p className="text-sm text-slate-200 font-semibold font-sans mt-0.5">
                    {currentAnalysis.pageTitle || "Not Exposed"}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    Meta Crawler Description
                  </span>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {currentAnalysis.metaDescription || "No meta description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Audit */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h4 className="font-display text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" />
                Security Assessment
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    SSL Cert
                  </span>
                  <span
                    className={`text-xs font-semibold mt-1 inline-block px-1.5 py-0.5 rounded ${
                      currentAnalysis.sslStatus?.includes("Active") || currentAnalysis.sslStatus?.includes("Secured")
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {currentAnalysis.sslStatus || "Unknown"}
                  </span>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    X-Frame-Options
                  </span>
                  <span className="text-xs font-mono text-slate-400 mt-1 block">
                    Secured Header Check
                  </span>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    Exposed Contacts
                  </span>
                  <span className="text-xs font-semibold text-slate-300 mt-1 block">
                    {currentAnalysis.contactEmail || "None found"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Compliance & Security Hardening Logs
                </span>
                {currentAnalysis.securityInsights?.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 text-xs text-slate-400 bg-slate-950/30 p-2.5 rounded-md border border-slate-900/50"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-4 space-y-6">
            {/* Tech Stack */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h4 className="font-display text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
                <Cpu className="w-4 h-4 mr-2 text-cyan-400" />
                Detected Technologies
              </h4>

              <div className="flex flex-wrap gap-2">
                {currentAnalysis.technologies?.length > 0 ? (
                  currentAnalysis.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-cyan-500/5 text-cyan-400 border border-cyan-500/10 text-xs px-2.5 py-1 rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No frameworks parsed</span>
                )}
              </div>
            </div>

            {/* Exposed Networks */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h4 className="font-display text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                Harvested Public Links
              </h4>

              <div className="space-y-3">
                {currentAnalysis.linkedSocials?.length > 0 ? (
                  currentAnalysis.linkedSocials.map((social, index) => (
                    <a
                      key={index}
                      href={social}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono truncate"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>{social}</span>
                    </a>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No external links found</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
