import React from 'react';
import { Brain, ArrowRight, Activity, ShieldCheck, FileText, Sun, Moon } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  isDark?: boolean;
  toggleDark?: () => void;
}

export default function LandingPage({ onEnter, isDark, toggleDark }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100 overflow-y-auto transition-colors relative z-10 w-full">
       {toggleDark && (
           <button onClick={toggleDark} className="absolute top-6 right-6 p-2 md:p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
               {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
       )}
       <div className="max-w-4xl w-full flex flex-col items-center my-auto py-12">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-500/10 rounded-[16px] flex items-center justify-center mb-8 border border-primary-200 dark:border-primary-500/20 shadow-sm">
            <Brain className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight mb-6 leading-tight">
            Linguistic-Driven ANFIS Framework <br className="hidden md:block"/>
            for <span className="text-primary-600 dark:text-primary-400">Mental Health Assessment</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 text-center max-w-2xl mb-12">
             A clinical decision support system combining Natural Language Processing
             with Adaptive Neuro-Fuzzy Inference Systems for continuous, interpretable risk scoring.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
             <div className="bento-card text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-full flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[14px] mb-2 dark:text-slate-200">Continuous Scoring</h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Systematic, real-time dynamic risk evaluation from 0.0 to 5.0 based on linguistic markers.</p>
             </div>
             <div className="bento-card text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-full flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[14px] mb-2 dark:text-slate-200">Interpretable AI</h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Transparent fuzzy logic rule base allowing clinicians to inspect and verify decision paths.</p>
             </div>
             <div className="bento-card text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-full flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">

                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[14px] mb-2">Clinical Integration</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">Designed for EMR workflows, processing direct therapy transcripts and clinical notes quickly.</p>
             </div>
          </div>

          <button
            onClick={onEnter}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-[8px] font-bold text-[15px] transition-colors shadow-sm"
          >
            Enter Clinical Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
       </div>
       
       <div className="mt-auto pt-8 text-[11px] text-slate-400 font-medium pb-4">
         HIPAA Compliant
       </div>
    </div>
  );
}
