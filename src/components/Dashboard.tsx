import React, { useState } from "react";
import Header from "./Header";
import InputSection from "./InputSection";
import ResultsDashboard from "./ResultsDashboard";
import WhatIfAnalysis from "./WhatIfAnalysis";
import { motion, AnimatePresence } from "motion/react";
import { Download, FileJson, Trash2, Brain } from "lucide-react";

export type AssessmentState = "idle" | "analyzing" | "complete";

export interface AnalysisResult {
  risk_score: number;
  risk_category: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";
  features: {
    sentiment: number;
    emotion_intensity: number;
    self_focus: number;
  };
  activated_rules: Array<{ rule: string; strength: number }>;
}

export default function Dashboard({ onHome, isDark, toggleDark }: { onHome?: () => void, isDark?: boolean, toggleDark?: () => void }) {
  const [assessmentState, setAssessmentState] =
    useState<AssessmentState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [interpretabilityMode, setInterpretabilityMode] = useState(true);

  const handleAnalyze = async (text: string) => {
    setAssessmentState("analyzing");

    // Simulate complex API processing
    await new Promise((resolve) => setTimeout(resolve, 3500));

    // Pseudo-deterministic response based on text length for demo
    const lengthMod = text.length % 100;
    const isCritical =
      text.toLowerCase().includes("critical") ||
      text.toLowerCase().includes("danger");

    let score = isCritical
      ? 4.25 + (lengthMod / 1000) * 5
      : Math.min(Math.max((lengthMod / 100) * 5 + 0.5, 0), 5);
    // ensure score is capped at 5.0
    if (score > 5) score = 5.0;

    let category = "Low Risk";
    if (score >= 3.75) category = "Critical Risk";
    else if (score >= 2.5) category = "High Risk";
    else if (score >= 1.5) category = "Moderate Risk";

    setResult({
      risk_score: score,
      risk_category: category as any,
      features: {
        sentiment: isCritical ? 0.8 : 0.2 + Math.random() * 0.4,
        emotion_intensity: isCritical ? 0.9 : 0.3 + Math.random() * 0.4,
        self_focus: isCritical ? 0.75 : 0.2 + Math.random() * 0.5,
      },
      activated_rules: [
        {
          rule: "IF Sentiment is High Negative AND Emotion is Intense THEN Risk is High",
          strength: (score / 5) - 0.05,
        },
        {
          rule: "IF Self-Focus is Elevated THEN Risk is Moderate",
          strength: Math.max(0, (score / 5) - 0.2),
        },
        {
          rule: "IF Sentiment is Neutral AND Self-Focus is Low THEN Risk is Low",
          strength: Math.max(0, 0.4 - (score / 5)),
        },
      ]
        .filter((r) => r.strength > 0.1)
        .slice(0, 3),
    });

    setAssessmentState("complete");
  };

  const handleClear = () => {
    setAssessmentState("idle");
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col w-full relative z-10">
      <Header
        interpretabilityMode={interpretabilityMode}
        setInterpretabilityMode={setInterpretabilityMode}
        onHome={onHome}
        isDark={isDark}
        toggleDark={toggleDark}
      />

      <div className="flex-1 flex flex-col h-full transition-colors relative z-10">
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-[20px] p-[20px] lg:px-[32px] max-w-[1440px] mx-auto w-full">
          {/* Left Panel */}
          <div className="flex flex-col gap-[20px]">
            <InputSection onAnalyze={handleAnalyze} status={assessmentState} />

            {assessmentState === "complete" && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <WhatIfAnalysis
                  initialFeatures={result.features}
                  interpretabilityMode={interpretabilityMode}
                />
              </motion.div>
            )}
          </div>

          {/* Right Panel / Dashboard Grid */}
          <div className="flex flex-col gap-[20px]">
            <AnimatePresence mode="wait">
              {assessmentState === "idle" && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex items-center justify-center p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-[12px]"
                >
                  <div className="text-center text-slate-400 dark:text-slate-500 max-w-sm flex flex-col items-center">
                    <div className="w-20 h-20 mb-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 relative shadow-sm">
                      <Brain className="w-10 h-10 text-primary-300 dark:text-primary-700" />
                      <div className="absolute inset-0 rounded-full border border-primary-200 dark:border-primary-800 animate-ping opacity-20"></div>
                    </div>
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Awaiting Patient Data
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Enter clinical narrative or upload a transcript to
                      initiate linguistic feature extraction and compute fuzzy
                      risk inference.
                    </p>
                  </div>
                </motion.div>
              )}

              {assessmentState === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex items-center justify-center p-8 bento-card"
                >
                  <LoadingState />
                </motion.div>
              )}

              {assessmentState === "complete" && result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="h-full"
                >
                  <ResultsDashboard
                    result={result}
                    interpretabilityMode={interpretabilityMode}
                    isDark={isDark}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer Area */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 lg:px-8 mt-auto flex flex-wrap items-center gap-3 shrink-0 z-10 w-full transition-colors">
          <button className="px-4 py-2 border border-primary-600 dark:border-primary-500 rounded-md text-[12px] font-medium text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
            PDF Report
          </button>
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-[12px] font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Export JSON
          </button>
          <button
            onClick={handleClear}
            className="ml-auto px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md text-[12px] font-medium text-red-500 dark:text-red-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            Clear Case
          </button>
        </footer>
      </div>
    </div>
  );
}

const LoadingState = () => {
  const steps = [
    "Securely processing narrative text...",
    "Extracting linguistic polarity & features...",
    "Computing Gaussian fuzzy memberships...",
    "Evaluating ANFIS rule permutations...",
    "Synthesizing final risk assessment...",
  ];
  const [stepIndex, setStepIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 700);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-sm text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <svg
          className="animate-spin w-full h-full text-primary-200/50"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="60 30"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="30 20"
            strokeLinecap="round"
            className="text-primary-400"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800">
          Analyzing Patient Details
        </h3>
        <div className="h-6 overflow-hidden relative font-mono text-xs text-primary-600">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={stepIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full"
            >
              System: {steps[stepIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden mt-6">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};
