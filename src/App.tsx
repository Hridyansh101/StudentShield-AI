import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  DollarSign, 
  KeyRound, 
  Scale, 
  BrainCircuit, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Header } from './components/Header';
import { AuditInputForm } from './components/AuditInputForm';
import { AuditResultsView } from './components/AuditResultsView';
import { RightsHandbookModal } from './components/RightsHandbookModal';
import { PresetGalleryModal } from './components/PresetGalleryModal';
import { HistoryModal } from './components/HistoryModal';
import { AuditResult, AuditHistoryItem, PresetCase } from './types';
import { PRESET_CASES } from './data/presets';

const STORAGE_KEY = 'studentshield_audit_history_v1';

export default function App() {
  const [currentResult, setCurrentResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // History state
  const [history, setHistory] = useState<AuditHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save audit history:', e);
    }
  }, [history]);

  const handleAudit = async (params: {
    text: string;
    imageBase64?: string;
    mimeType?: string;
    categoryHint?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: params.text,
          imageBase64: params.imageBase64,
          mimeType: params.mimeType,
          documentCategoryHint: params.categoryHint,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete security audit.');
      }

      const result: AuditResult = json.data;
      setCurrentResult(result);

      // Save to history
      const newHistoryItem: AuditHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        previewTitle: result.one_line_summary || result.document_type,
        result,
      };

      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);

      // Scroll smoothly to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while analyzing the document.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetCase) => {
    // If the user wants to audit immediately from preset gallery
    handleAudit({
      text: preset.inputText,
      categoryHint: preset.category,
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-300 text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Audit Request Failed</p>
                <p className="text-xs text-rose-400/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switching: Input vs Active Result */}
        {currentResult ? (
          <AuditResultsView
            result={currentResult}
            onReset={() => setCurrentResult(null)}
          />
        ) : (
          <div className="space-y-8">
            
            {/* Hero / Value Proposition */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Forensic Anti-Predatory Protection for College Students</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Don’t Get Trapped By <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  Predatory Offers & Shady Fine Print
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                College students lose millions each year to fake internship registration fees, original certificate hostage bonds, arbitrary PG deposit theft, and EdTech dark patterns. Let StudentShield AI audit the fine print before you sign.
              </p>

              {/* 4 Detection Dimensions Pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 max-w-4xl mx-auto text-left">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Financial Traps</div>
                    <div className="text-[11px] text-slate-400">Upfront fees & deposit forfeitures</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Phishing Signals</div>
                    <div className="text-[11px] text-slate-400">Free @gmail HR & spoofed forms</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Legal Red Flags</div>
                    <div className="text-[11px] text-slate-400">Certificate hostage & 2-year bonds</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Dark Patterns</div>
                    <div className="text-[11px] text-slate-400">Fake urgency & hidden auto-debits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Input Form */}
            <AuditInputForm
              onAudit={handleAudit}
              isLoading={isLoading}
              onSelectPreset={(preset) => {
                // Preload and run
                handleSelectPreset(preset);
              }}
            />

            {/* Common Student Scams Hall of Fame Showcase */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Real-World Scams Caught in the Wild</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Frequently reported predatory tactics targeting college students across Telegram, WhatsApp, and job portals.
                  </p>
                </div>

                <button
                  onClick={() => setIsPresetsOpen(true)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All 6 Cases</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                {PRESET_CASES.slice(0, 3).map((preset) => (
                  <div
                    key={preset.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400">{preset.category}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {preset.riskType}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{preset.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{preset.description}</p>
                    </div>

                    <button
                      onClick={() => handleSelectPreset(preset)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Audit This Example</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Safeguards Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Scale className="w-4 h-4" />
                  <span>Did You Know? Holding Certificates is Illegal</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under strict guidelines by the University Grants Commission (UGC) and Indian Contract Law, employers cannot demand or withhold your original degree or marksheet. Giving up your physical certificates leaves you vulnerable to blackmail.
                </p>
                <button
                  onClick={() => setIsHandbookOpen(true)}
                  className="text-xs font-bold text-indigo-400 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <span>Read full legal rights guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/20 to-slate-900 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Golden Internship Rule</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real companies pay YOU for your skills and time. If an organization asks for a "training fee", "laptop security deposit", or "offer acceptance charge" before starting, it is a scam 100% of the time without exception.
                </p>
                <div className="text-[11px] text-slate-400 pt-1 font-mono">
                  Never transfer UPI funds to personal @gmail / @yahoo HR contacts.
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">StudentShield AI</span>
            <span>•</span>
            <span>College Student Consumer & Cyber Protection System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsHandbookOpen(true)}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              Legal Rights Guide
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <span>Cyber Crime Portal (1930)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 max-w-2xl mx-auto px-4">
          Disclaimer: StudentShield AI is an automated forensic auditor powered by statutory student labor rules, UGC guidelines, CCPA dark pattern standards, and model tenancy provisions. Always consult your college placement cell or legal aid committee for formal dispute resolution.
        </p>
      </footer>

      {/* Modals */}
      <RightsHandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <PresetGalleryModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => setCurrentResult(item)}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
