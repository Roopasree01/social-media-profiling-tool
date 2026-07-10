import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Globe,
  Trash2,
  Settings as SettingsIcon,
  Download,
  AlertTriangle,
  Github,
  Gitlab,
  Linkedin,
  Award,
  Database,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  Terminal,
  Activity,
  History,
  Info,
  Sliders,
  CheckCircle,
  Eye,
  BookOpen,
  FolderLock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OSINTProfile, WebsiteAnalysis, SystemSettings } from "./types";
import CyberLoading from "./components/CyberLoading";
import IntelCharts from "./components/IntelCharts";
import RiskMeter from "./components/RiskMeter";
import WebsiteAuditor from "./components/WebsiteAuditor";
import { exportToPDF, exportToCSV, exportToJSON } from "./utils/reportExporter";

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"dossier" | "website" | "history" | "settings">("dossier");

  // App States
  const [usernameInput, setUsernameInput] = useState("");
  const [profile, setProfile] = useState<OSINTProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Portfolio Website Scan states
  const [isScanningWebsite, setIsScanningWebsite] = useState(false);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  // Settings & Db History
  const [historyList, setHistoryList] = useState<OSINTProfile[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    theme: "dark",
    exportFormat: "pdf",
    cacheDuration: "24h",
    apiMockFallback: true,
  });

  // Load configuration and history on startup
  useEffect(() => {
    fetchHistory();
    fetchSettings();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const handleUpdateSettings = async (updated: Partial<SystemSettings>) => {
    const newSettings = { ...settings, ...updated };
    setSettings(newSettings);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  // Perform search / query backend Express server
  const handleSearch = async (username: string) => {
    if (!username.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setWebsiteAnalysis(null); // Reset website details
    setProfile(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Search failed");
      }

      const data: OSINTProfile = await response.json();
      setProfile(data);
      setActiveTab("dossier");
      fetchHistory(); // refresh history list
    } catch (err: any) {
      console.error("Search error:", err);
      setSearchError(err.message || "Connection timed out. Please check your Gemini API configuration.");
    } finally {
      setIsSearching(false);
    }
  };

  // Analyze website URL
  const handleAnalyzeWebsite = async (url: string) => {
    setIsScanningWebsite(true);
    setWebsiteError(null);
    setWebsiteAnalysis(null);

    try {
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Analysis failed");
      }

      const data: WebsiteAnalysis = await response.json();
      setWebsiteAnalysis(data);
    } catch (err: any) {
      console.error("Website analysis failed:", err);
      setWebsiteError(err.message || "Failed to parse website footprint.");
    } finally {
      setIsScanningWebsite(false);
    }
  };

  // Delete history item
  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  // Wipe all database history
  const handleWipeHistory = async () => {
    if (!confirm("Are you sure you want to purge the local intelligence cache? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setHistoryList([]);
        setProfile(null);
        setWebsiteAnalysis(null);
      }
    } catch (err) {
      console.error("Failed to wipe database history:", err);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 font-sans ${settings.theme === "dark" ? "bg-[#090d16]" : "bg-slate-50 text-slate-900"}`}>
      {/* Visual background grids for styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="border-b border-slate-800/80 sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>IntelScope</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 tracking-normal border border-cyan-500/20">
                  Ethical OSINT
                </span>
              </h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Digital Footprint Auditor
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2 border-r border-slate-800 pr-6">
              <Database className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Local Cache</span>
                <span className="font-semibold text-slate-200">{historyList.length} Profiler Records</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Security Core</span>
                <span className="font-semibold text-slate-200">Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO / SEARCH BAR SECTION */}
      <section className="bg-slate-950/40 border-b border-slate-900/50 py-10 md:py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Ethical Social Footprint Assessment
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Scan, catalog, and analyze public developer handles. Check digital exposure and vulnerabilities ethically using Google Search Grounding & Gemini AI.
            </p>
          </motion.div>

          {/* Search form box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(usernameInput);
            }}
            className="relative max-w-2xl mx-auto mb-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter social username / handle (e.g., torvalds)"
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-12 pr-32 py-3.5 text-sm md:text-base text-slate-200 placeholder-slate-500 outline-none transition-colors shadow-2xl font-mono"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !usernameInput.trim()}
                className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold px-5 py-2 rounded-lg text-xs md:text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
              >
                <span>Recon Target</span>
              </button>
            </div>
          </form>

          {/* Guidelines disclaimer */}
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 font-mono">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Scope: Only queries publicly indexed repositories, channels, bios, and open ports.</span>
          </div>
        </div>
      </section>

      {/* CORE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {isSearching ? (
          <div className="cyber-glass rounded-2xl p-8 border border-slate-800">
            <CyberLoading username={usernameInput} />
          </div>
        ) : searchError ? (
          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-6 text-center max-w-xl mx-auto mt-6">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-display text-base font-semibold text-white mb-1">Dossier Retrieval Failed</h3>
            <p className="text-xs text-slate-400 mb-4">{searchError}</p>
            <button
              onClick={() => handleSearch(usernameInput)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-400 rounded-lg border border-slate-800 transition-colors"
            >
              Retry Protocol
            </button>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Target Profile Summary Badge */}
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 relative z-10">
                <img
                  src={profile.personalInfo.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
                  alt={profile.personalInfo.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl border border-slate-700 bg-slate-900 shadow-xl shrink-0 object-cover"
                />
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2.5">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                      {profile.personalInfo.name || `@${profile.username}`}
                    </h2>
                    {profile.personalInfo.verified && (
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono text-cyan-400 mt-1">@{profile.username}</p>
                  <p className="text-xs text-slate-400 max-w-md mt-2 italic leading-relaxed">
                    "{profile.personalInfo.bio || "No public bio provided."}"
                  </p>
                </div>
              </div>

              {/* Actions Box */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end relative z-10">
                <button
                  onClick={() => exportToPDF(profile)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold px-4.5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Dossier PDF</span>
                </button>
                <button
                  onClick={() => exportToCSV(profile)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold px-4.5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Dossier CSV</span>
                </button>
                <button
                  onClick={() => exportToJSON(profile)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold px-4.5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Dossier JSON</span>
                </button>
              </div>
            </div>

            {/* TAB SYSTEM */}
            <div className="flex border-b border-slate-800/80 gap-6">
              <button
                onClick={() => setActiveTab("dossier")}
                className={`pb-4 text-sm font-display font-semibold transition-colors relative cursor-pointer ${
                  activeTab === "dossier" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Dossier intelligence</span>
                {activeTab === "dossier" && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("website")}
                className={`pb-4 text-sm font-display font-semibold transition-colors relative cursor-pointer ${
                  activeTab === "website" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Website & Portfolio scan</span>
                {activeTab === "website" && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`pb-4 text-sm font-display font-semibold transition-colors relative cursor-pointer ${
                  activeTab === "history" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Local dossier index ({historyList.length})</span>
                {activeTab === "history" && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`pb-4 text-sm font-display font-semibold transition-colors relative cursor-pointer ${
                  activeTab === "settings" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Configuration</span>
                {activeTab === "settings" && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>

            {/* TAB PANELS */}
            <div>
              {activeTab === "dossier" && (
                <div className="space-y-8">
                  {/* First row: Metadata cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Location context</span>
                      <p className="text-sm text-slate-200 font-semibold mt-1 flex items-center">
                        <MapPin className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
                        <span>{profile.personalInfo.location || "Not Specified"}</span>
                      </p>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Public exposure email</span>
                      <p className="text-sm text-slate-200 font-semibold mt-1 flex items-center">
                        <Calendar className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                        <span className="truncate">{profile.personalInfo.email || "Not exposed"}</span>
                      </p>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Public portfolio</span>
                      <p className="text-sm text-slate-200 font-semibold mt-1 flex items-center truncate">
                        <Globe className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                        {profile.personalInfo.website ? (
                          <a
                            href={profile.personalInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline inline-flex items-center truncate"
                          >
                            <span>Visit site</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <span>None detected</span>
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Account created date</span>
                      <p className="text-sm text-slate-200 font-semibold mt-1 flex items-center">
                        <Activity className="w-4 h-4 text-green-400 mr-2 shrink-0" />
                        <span>
                          {profile.personalInfo.accountCreated
                            ? new Date(profile.personalInfo.accountCreated).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Platform Map Grid */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                    <h3 className="font-display text-base font-semibold text-white mb-6 flex items-center justify-between">
                      <span className="flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-cyan-400" />
                        Discovered Social footprint
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Ethical query map</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                      {/* GitHub */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">GitHub</span>
                            <Github className="w-4 h-4 text-slate-400" />
                          </div>
                          {profile.platforms.github?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.github.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.github.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public handle found</span>
                          )}
                        </div>
                        {profile.platforms.github?.exists && (
                          <a
                            href={profile.platforms.github.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* GitLab */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">GitLab</span>
                            <Gitlab className="w-4 h-4 text-orange-500" />
                          </div>
                          {profile.platforms.gitlab?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.gitlab.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.gitlab.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public handle found</span>
                          )}
                        </div>
                        {profile.platforms.gitlab?.exists && (
                          <a
                            href={profile.platforms.gitlab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">LinkedIn</span>
                            <Linkedin className="w-4 h-4 text-blue-500" />
                          </div>
                          {profile.platforms.linkedin?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.linkedin.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.linkedin.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public handle found</span>
                          )}
                        </div>
                        {profile.platforms.linkedin?.exists && (
                          <a
                            href={profile.platforms.linkedin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* Reddit */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">Reddit</span>
                            <Terminal className="w-4 h-4 text-orange-400" />
                          </div>
                          {profile.platforms.reddit?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.reddit.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.reddit.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public handle found</span>
                          )}
                        </div>
                        {profile.platforms.reddit?.exists && (
                          <a
                            href={profile.platforms.reddit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* StackOverflow */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">Stack Overflow</span>
                            <Sliders className="w-4 h-4 text-orange-500" />
                          </div>
                          {profile.platforms.stackoverflow?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.stackoverflow.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.stackoverflow.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public handle found</span>
                          )}
                        </div>
                        {profile.platforms.stackoverflow?.exists && (
                          <a
                            href={profile.platforms.stackoverflow.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* YouTube */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">YouTube</span>
                            <Eye className="w-4 h-4 text-red-500" />
                          </div>
                          {profile.platforms.youtube?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.youtube.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.youtube.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public channel found</span>
                          )}
                        </div>
                        {profile.platforms.youtube?.exists && (
                          <a
                            href={profile.platforms.youtube.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* Medium */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs font-semibold">Medium</span>
                            <BookOpen className="w-4 h-4 text-slate-200" />
                          </div>
                          {profile.platforms.medium?.exists ? (
                            <>
                              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                                {profile.platforms.medium.headline}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                {profile.platforms.medium.metrics}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No public blog found</span>
                          )}
                        </div>
                        {profile.platforms.medium?.exists && (
                          <a
                            href={profile.platforms.medium.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center mt-4 pt-4 border-t border-slate-800/60"
                          >
                            <span>Open Blog</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Visualizations */}
                  <IntelCharts data={profile.visualizations} />

                  {/* Skill Cards & Inferencing */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                    <h3 className="font-display text-base font-semibold text-white mb-6 flex items-center justify-between">
                      <span className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-cyan-400" />
                        Inferred Skill Mapping Matrix
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">AI-Inferred weight</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {profile.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">
                              {skill.category}
                            </span>
                            <h4 className="text-sm font-semibold text-slate-200 mt-1">{skill.name}</h4>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span>Skill Exposure Weight</span>
                              <span>{skill.level}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400" style={{ width: `${skill.level}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Threat exposure Index */}
                  <RiskMeter assessment={profile.riskAssessment} />
                </div>
              )}

              {activeTab === "website" && (
                <WebsiteAuditor
                  initialUrl={profile?.personalInfo.website}
                  onAnalyze={handleAnalyzeWebsite}
                  isLoading={isScanningWebsite}
                  currentAnalysis={websiteAnalysis}
                  error={websiteError}
                />
              )}

              {activeTab === "history" && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-base font-semibold text-white flex items-center">
                      <History className="w-5 h-5 mr-2 text-cyan-400" />
                      Stored Footprint Dossiers
                    </h3>
                    <button
                      onClick={handleWipeHistory}
                      disabled={historyList.length === 0}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 font-semibold rounded-lg text-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Wipe Footprint Index</span>
                    </button>
                  </div>

                  {historyList.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      <FolderLock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <span>No social audits stored in local database history cache. Run a target scan above.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {historyList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setProfile(item);
                            setUsernameInput(item.username);
                            setActiveTab("dossier");
                          }}
                          className="bg-slate-950/40 border border-slate-800/60 hover:border-slate-700/80 p-4.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.personalInfo.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`}
                              alt={item.username}
                              className="w-10 h-10 rounded-lg border border-slate-800 shrink-0"
                            />
                            <div>
                              <div className="flex items-center space-x-2.5">
                                <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                  @{item.username}
                                </span>
                                <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full ${getRiskBadgeColor(item.riskAssessment.level)}`}>
                                  {item.riskAssessment.riskScore} Exposure Level
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                                Scanned: {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                              className="p-2 text-slate-500 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/20 rounded-lg transition-all"
                              title="Delete index record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 max-w-2xl">
                  <h3 className="font-display text-base font-semibold text-white mb-6 flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2 text-cyan-400" />
                    Global Recon Configurator
                  </h3>

                  <div className="space-y-6">
                    {/* Visual Preset */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Visual Theme Preset</span>
                      <p className="text-xs text-slate-400 mb-3">
                        Choose between ambient slate (dark mode optimized) or technical document (light mode).
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateSettings({ theme: "dark" })}
                          className={`flex-1 py-3 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                            settings.theme === "dark"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40"
                              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-700"
                          }`}
                        >
                          Ambient Slate (Dark)
                        </button>
                        <button
                          onClick={() => handleUpdateSettings({ theme: "light" })}
                          className={`flex-1 py-3 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                            settings.theme === "light"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40"
                              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-700"
                          }`}
                        >
                          Technical Doc (Light)
                        </button>
                      </div>
                    </div>

                    {/* Cache Expiry */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Cache Duration Limit</span>
                      <p className="text-xs text-slate-400 mb-3">
                        Determine how long locally retrieved digital foot maps are locked before refreshing search engines.
                      </p>
                      <select
                        value={settings.cacheDuration}
                        onChange={(e) => handleUpdateSettings({ cacheDuration: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-3 text-slate-300 outline-none"
                      >
                        <option value="12h">12 Hours (Aggressive scan refresh)</option>
                        <option value="24h">24 Hours (Standard default)</option>
                        <option value="7d">7 Days (High persistence limit)</option>
                      </select>
                    </div>

                    {/* API Secret details */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">API Secret Configuration</span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        API credentials are kept server-side in this sandboxed playground. To update or add your personal <strong>GEMINI_API_KEY</strong>, click on the <strong>Settings &gt; Secrets</strong> pane at the top-right of your AI Studio interface.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty / Default view - Guide on how to scan a profile */
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Terminal className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="font-display text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2">
                  Ethical OSINT Core
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Only scrapes public social profiles, meta crawler markers, and open developer portfolios without bypassing access boundaries.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="font-display text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2">
                  Grounding Footprints
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Harnesses Google Search Grounding to prevent artificial hallucination of links, profiles, or public repositories.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-display text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2">
                  Defensive Suggestions
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates index scores for public data vulnerability exposure to advise cybersecurity analysts on proactive personal hardening.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-10 text-center text-xs text-slate-500">
        <p className="mb-2">IntelScope &copy; 2026.</p>
        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">
          Security Auditing Utility for Cyber Defense Awareness & Education.
        </p>
      </footer>
    </div>
  );
}
