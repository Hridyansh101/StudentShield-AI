import React from 'react';
import { X, Sparkles, ArrowRight, ShieldAlert, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';
import { PRESET_CASES } from '../data/presets';
import { PresetCase } from '../types';

interface PresetGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetCase) => void;
}

export const PresetGalleryModal: React.FC<PresetGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const getRiskBadge = (type: string) => {
    switch (type) {
      case 'CRITICAL SCAM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            CRITICAL SCAM
          </span>
        );
      case 'HIGH RISK TRAP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            HIGH RISK TRAP
          </span>
        );
      case 'CAUTION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            CAUTION
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            SAFE BENCHMARK
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Hall of Traps: Realistic Student Case Studies</h2>
              <p className="text-xs text-slate-400">Select any realistic case study below to load and run a full forensic audit.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of cases */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_CASES.map((preset) => (
            <div
              key={preset.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {preset.category}
                  </span>
                  {getRiskBadge(preset.riskType)}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {preset.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>

                <div className="pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 line-clamp-3">
                    {preset.inputText}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Load & Audit This Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
