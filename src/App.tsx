import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import NeuralBackground from "./components/NeuralBackground";

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isDark, setIsDark] = useState(() => {
    // initialize from system preference or default to false
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-primary-200 dark:selection:bg-primary-900 relative">
      <NeuralBackground isDark={isDark} />
      <div className="relative z-10 min-h-screen flex flex-col">
        {view === 'landing' ? (
          <LandingPage onEnter={() => setView('dashboard')} isDark={isDark} toggleDark={toggleDark} />
        ) : (
          <Dashboard onHome={() => setView('landing')} isDark={isDark} toggleDark={toggleDark} />
        )}
      </div>
    </div>
  );
}
