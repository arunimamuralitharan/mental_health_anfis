import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings2, Calculator } from "lucide-react";
import { cn } from "../lib/utils";

interface WhatIfAnalysisProps {
  initialFeatures: {
    sentiment: number;
    emotion_intensity: number;
    self_focus: number;
  };
  interpretabilityMode: boolean;
}

export default function WhatIfAnalysis({
  initialFeatures,
  interpretabilityMode,
}: WhatIfAnalysisProps) {
  const [features, setFeatures] = useState(initialFeatures);

  // Sync with initial features when they change
  useEffect(() => {
    setFeatures(initialFeatures);
  }, [initialFeatures]);

  const updateFeature = (key: keyof typeof features, value: number) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bento-card">
      <div className="bento-title w-full m-0 p-0 mb-4 text-slate-900 border-none">
        Simulation (What-If Analysis)
      </div>
      <div className="grid gap-[12px]">
        <SliderControl
          label="Sentiment Polarity (Positive → Negative)"
          value={features.sentiment}
          onChange={(v) => updateFeature("sentiment", v)}
        />
        <SliderControl
          label="Emotion Intensity"
          value={features.emotion_intensity}
          onChange={(v) => updateFeature("emotion_intensity", v)}
        />
        <SliderControl
          label="Self-Focus Ratio"
          value={features.self_focus}
          onChange={(v) => updateFeature("self_focus", v)}
        />
      </div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] text-slate-500 mb-1">{label}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-[4px] appearance-none bg-slate-200 dark:bg-slate-700 rounded-[2px] outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:dark:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
      />
    </div>
  );
}
