import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, AlertOctagon, PhoneCall, ExternalLink } from 'lucide-react';
import { STUDENT_RIGHTS_GUIDE } from '../data/presets';

interface RightsHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightsHandbookModal: React.FC<RightsHandbookModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Student Rights & Consumer Protection Handbook</h2>
              <p className="text-xs text-slate-400">Statutory legal protections against predatory hiring, bonds, and landlord extortion.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Helpline Strip */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <PhoneCall className="w-4 h-4 shrink-0 text-cyan-400" />
              <span><strong>National Cyber Crime & Consumer Helplines:</strong> Dial <strong>1930</strong> (Cyber Fraud) or <strong>1915</strong> (National Consumer Helpline).</span>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Legal Rights Cards */}
          <div className="space-y-4">
            {STUDENT_RIGHTS_GUIDE.map((guide, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-indigo-400" />
                    <span>{guide.title}</span>
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {guide.authority}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {guide.summary}
                </p>

                <ul className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  {guide.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>General Safety Rule of Thumb</span>
            </div>
            <p>
              If an internship demands money from you before you start, it is 100% not a real job. If an employer threatens legal action over an unconscionable bond, consult your college's legal aid cell or a consumer advocate immediately before paying a single rupee.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
