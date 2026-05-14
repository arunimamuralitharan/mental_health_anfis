import React from "react";
import { motion } from "motion/react";
import {
  ActivitySquare,
  AlertTriangle,
  ShieldAlert,
  BadgeCheck,
  Network,
  Info,
  ChevronRight,
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie
} from "recharts";
import { AnalysisResult } from "./Dashboard";
import { cn } from "../lib/utils";

interface ResultsDashboardProps {
  result: AnalysisResult;
  interpretabilityMode: boolean;
  isDark?: boolean;
}

export default function ResultsDashboard({
  result,
  interpretabilityMode,
  isDark
}: ResultsDashboardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical Risk":
        return "text-red-600 bg-red-50 border-red-200";
      case "High Risk":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Moderate Risk":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
  };

  const getRiskHex = (risk: string) => {
    switch (risk) {
      case "Critical Risk":
        return "#ef4444";
      case "High Risk":
        return "#f97316";
      case "Moderate Risk":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Critical Risk":
        return <AlertTriangle className="w-6 h-6" />;
      case "High Risk":
        return <AlertTriangle className="w-6 h-6" />;
      case "Moderate Risk":
        return <ShieldAlert className="w-6 h-6" />;
      default:
        return <BadgeCheck className="w-6 h-6" />;
    }
  };

  const hexColor = getRiskHex(result.risk_category);
  const strokeDasharray = 283; // 2 * pi * r (45)
  const strokeDashoffset =
    strokeDasharray - (result.risk_score / 5) * strokeDasharray;

  const barData = [
    { name: 'Sentiment Polarity', value: Math.round(result.features.sentiment * 100), fill: '#F59E0B' },
    { name: 'Emotion Intensity', value: Math.round(result.features.emotion_intensity * 100), fill: '#F97316' },
    { name: 'Self-Focus Ratio', value: Math.round(result.features.self_focus * 100), fill: '#0D9488' },
  ];

  const curveData = React.useMemo(() => {
    const data = [];
    const mean = (result.risk_score / 5) * 100;
    const stdDev = 15;
    for (let i = 0; i <= 100; i += 5) {
      const exponent = -Math.pow(i - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = Math.exp(exponent);
      data.push({ x: i, y: Math.round(y * 100) });
    }
    return data;
  }, [result.risk_score]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] w-full">
      {/* Card 1: Risk Score  */}
      <div className="bento-card flex flex-col text-center min-h-[220px]">
        <h3 className="bento-title justify-center m-0 p-0">
          Continuous Risk Score
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center pt-2">
          <div className="relative w-[120px] h-[120px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Score', value: result.risk_score },
                    { name: 'Remaining', value: 5.0 - result.risk_score }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={43}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                  animationDuration={1500}
                >
                  <Cell fill={hexColor} />
                  <Cell fill={isDark ? "#1e293b" : "#e2e8f0"} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[28px] font-bold"
                style={{ color: hexColor }}
              >
                {result.risk_score.toFixed(2)}
              </motion.span>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest -mt-1">
                / 5.0
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-[12px]">
            Confidence Interval: ±
            {(1 - result.features.self_focus).toFixed(2).substring(1)}
          </p>
        </div>
      </div>

      {/* Card 2: Risk Category  */}
      <div className="bento-card flex flex-col text-center min-h-[220px]">
        <h3 className="bento-title justify-center m-0 p-0">Risk Category</h3>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div 
            className="px-5 py-2 rounded-[8px] font-bold text-[24px] mt-[10px]"
            style={{ backgroundColor: `${hexColor}15`, color: hexColor }}
          >
            {result.risk_category}
          </div>
          <p className="text-[11px] text-slate-500 mt-[18px] leading-relaxed mx-auto max-w-[80%]">
            {result.risk_score >= 3.75 ? "Priority: Immediate Clinical Review Required. System recommends intervention outreach." : 
             result.risk_score >= 2.5 ? "Priority: Routine Clinical Review Required. Standard monitoring recommended." :
             "Standard care pathway advised. Routine follow-up scheduled."}
          </p>
        </div>
      </div>

      {/* Card 3: Linguistic Features */}
      <div className="bento-card flex flex-col relative min-h-[260px]">
        <h3 className="bento-title justify-start m-0 p-0 mb-2">
          Linguistic Feature Breakdown
        </h3>

        <div className="flex-1 w-full min-h-[120px] -ml-6 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} width={110} />
              <RechartsTooltip 
                cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderRadius: '8px', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, fontSize: '12px', padding: '6px 12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: isDark ? '#f8fafc' : '#0f172a' }}
                formatter={(value: number) => [`${value}%`, 'Value']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10} animationDuration={1000}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[70px] w-full mt-2 relative">
          <div className="absolute top-0 right-2 z-10 text-[9px] font-bold text-[#0D9488] uppercase tracking-wider bg-white/80 dark:bg-slate-900/80 px-1 py-0.5 rounded">
            Fuzzy Firing Zone
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFuzzy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderRadius: '6px', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, fontSize: '10px', padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: isDark ? '#f8fafc' : '#0f172a' }}
                labelFormatter={(v) => `Risk Offset: ${(v as number / 100).toFixed(2)}`}
                formatter={(val: number) => [`${val}%`, 'Activation']}
              />
              <Area type="monotone" dataKey="y" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorFuzzy)" isAnimationActive={true} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 4: Activated Fuzzy Rules */}
      <div className="bento-card flex flex-col overflow-hidden min-h-[220px]">
        <h3 className="bento-title justify-start m-0 p-0 mb-4">
          Activated Fuzzy Rules (Interpretability)
        </h3>

        <div className="flex-1 flex flex-col">
          {result.activated_rules.map((rule, idx) => (
            <div
              key={idx}
              className="font-mono text-[11px] bg-slate-50 dark:bg-slate-950 p-2 rounded-[4px] mb-[6px] border-l-[3px] border-primary-600 text-slate-700 dark:text-slate-300"
            >
              {rule.rule} {`[w=${rule.strength.toFixed(2)}]`}
            </div>
          ))}
          <p className="text-[10px] text-slate-500 mt-[10px] cursor-pointer underline">
            Show all triggered rules...
          </p>
        </div>
      </div>
    </div>
  );
}
