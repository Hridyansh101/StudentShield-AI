import React from 'react';
import { ShieldCheck, BookOpen, Sparkles, History, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenHandbook: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onOpenHandbook,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <ShieldCheck className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">StudentShield</span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium">Cybersecurity & Fine-Print Auditor for Students</p>
          </div>
        </div>

        {/* Quick action tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer"
            title="Load real-world scam cases"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preset Cases</span>
          </button>

          <button
            onClick={onOpenHandbook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer"
            title="View Indian & International student rights legal guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Student Rights Guide</span>
            <span className="sm:hidden">Rights</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer"
            title="View past document audits"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Audit History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                {historyCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-[11px] text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private & Ephemeral</span>
          </div>

        </div>

      </div>
    </header>
  );
};
