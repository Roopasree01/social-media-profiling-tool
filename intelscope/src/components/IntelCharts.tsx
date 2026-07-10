import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { Visualizations } from "../types";

const COLORS = ["#2563EB", "#06B6D4", "#22C55E", "#EAB308", "#EC4899", "#8B5CF6"];

export default function IntelCharts({ data }: { data: Visualizations }) {
  const { platformComparison, languageUsage, contributionTimeline } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Comparison */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 cyber-glow-blue">
        <h3 className="font-display text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4 flex items-center justify-between">
          <span>Platform Activity Density</span>
          <span className="text-xs font-mono text-blue-400">Public Weight</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="platform" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }}
                itemStyle={{ color: "#38bdf8" }}
              />
              <Bar dataKey="activity" fill="#2563eb" radius={[4, 4, 0, 0]}>
                {platformComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language Stack */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 cyber-glow-cyan">
        <h3 className="font-display text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4 flex items-center justify-between">
          <span>Inferred Tech Focus</span>
          <span className="text-xs font-mono text-cyan-400">Percentage</span>
        </h3>
        <div className="h-64 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageUsage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {languageUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contribution Timeline */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 cyber-glow-green col-span-1 lg:col-span-1">
        <h3 className="font-display text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4 flex items-center justify-between">
          <span>Digital History Map</span>
          <span className="text-xs font-mono text-green-400">Time Curve</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={contributionTimeline}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }}
              />
              <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
