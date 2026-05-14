import React from "react";
import { Activity, ShieldCheck, Sun, Moon, Sparkles, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface HeaderProps {
  interpretabilityMode: boolean;
  setInterpretabilityMode: (val: boolean) => void;
  onHome?: () => void;
  isDark?: boolean;
  toggleDark?: () => void;
}

export default function Header({
  interpretabilityMode,
  setInterpretabilityMode,
  onHome,
  isDark,
  toggleDark,
}: HeaderProps) {
  return (
    <header className="h-[80px] px-4 md:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-3">
         {onHome && (
            <button onClick={onHome} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-500 dark:text-slate-400 shrink-0">
               <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
         )}
        <div className="flex flex-col gap-1">
          <h1 className="text-[14px] md:text-[18px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            Mental Health Risk Assessment <span className="hidden md:inline">Dashboard</span>
          </h1>
          <p className="text-[10px] md:text-[12px] text-slate-500 dark:text-slate-400 font-normal truncate max-w-[200px] md:max-w-none">
            Hybrid NLP + ANFIS Clinical Decision Support System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[11px] font-semibold uppercase tracking-wider border border-primary-500/20">
          Interpretable AI | Continuous Risk Scoring
        </span>
        {toggleDark && (
           <button onClick={toggleDark} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-800">
               {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
        )}
      </div>
    </header>
  );
}
