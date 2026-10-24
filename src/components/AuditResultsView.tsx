import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  DollarSign, 
  KeyRound, 
  Scale, 
  BrainCircuit, 
  Share2, 
  ArrowLeft, 
  Flame,
  CheckCircle2,
  ExternalLink,
  MessageSquareWarning,
  Send,
  HelpCircle
} from 'lucide-react';
import { AuditResult, RedFlag } from '../types';
import { RiskMeter } from './RiskMeter';

interface AuditResultsViewProps {
  result: AuditResult;
  onReset: () => void;
}

export const AuditResultsView: React.FC<AuditResultsViewProps> = ({ result, onReset }) => {
  const [copiedReply, setCopiedReply] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  const isDoNotReply = 
    result.safe_reply_template.toUpperCase().includes('DO NOT REPLY') ||
    result.safe_reply_template.toUpperCase().includes('BLOCK IMMEDIATELY') ||
    result.risk_score >= 85;

  // Split recommended actions if it contains numbered steps or bullet points
  const rawActions = result.recommended_action
    .split(/\n|(?=\d+\.\s)/)
    .map(s => s.trim().replace(/^\d+\.\s*/, ''))
    .filter(s => s.length > 0);

  const handleCopyReply = () => {
    navigator.clipboard.writeText(result.safe_reply_template);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  const handleCopyFullReport = () => {
    const reportText = `# StudentShield AI - Forensic Audit Report
**Document Type:** ${result.document_type}
**Verdict:** ${result.verdict_badge}
**Risk Score:** ${result.risk_score}/100
**Summary:** ${result.one_line_summary}

## 🚨 Detected Red Flags:
${result.red_flags.map((rf, i) => `${i + 1}. [${rf.severity} - ${rf.category}] "${rf.exact_quote_or_visual_cue}"
   -> ${rf.plain_english_explanation}`).join('\n\n')}

## 🛡️ Legitimate / Green Flags:
${result.green_flags.length > 0 ? result.green_flags.map(gf => `- ${gf}`).join('\n') : '- No significant legitimate signals identified.'}

## 📋 Recommended Action:
${result.recommended_action}

## ✉️ Safe Action / Counter-Response:
${result.safe_reply_template}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const toggleAction = (idx: number) => {
    setCheckedActions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Group red flags by category
  const categories = ['All', 'Financial Trap', 'Phishing/Identity', 'Legal Clause', 'Dark Pattern'];
  
  const filteredRedFlags = activeCategoryFilter === 'All'
    ? result.red_flags
    : result.red_flags.filter(rf => 
        rf.category.toLowerCase().includes(activeCategoryFilter.toLowerCase().split('/')[0])
      );

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('financ')) return <DollarSign className="w-4 h-4 text-amber-400" />;
    if (cat.includes('phish') || cat.includes('ident')) return <KeyRound className="w-4 h-4 text-rose-400" />;
    if (cat.includes('legal') || cat.includes('clause') || cat.includes('contract')) return <Scale className="w-4 h-4 text-purple-400" />;
    return <BrainCircuit className="w-4 h-4 text-cyan-400" />;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">High Severity</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">Medium Severity</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">Low Severity</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top navigation & action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Audit Another Document</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFullReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedReport ? 'Report Copied!' : 'Export / Copy Full Audit'}</span>
          </button>
        </div>
      </div>

      {/* Main Risk Meter Component */}
      <RiskMeter score={result.risk_score} badge={result.verdict_badge} />

      {/* Summary Card with Document Classification */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Classified As:</span>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {result.document_type}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Red Flags: <strong className="text-rose-400">{result.red_flags.length}</strong></span>
            <span>•</span>
            <span>Green Flags: <strong className="text-emerald-400">{result.green_flags.length}</strong></span>
          </div>
        </div>

        <div className="pt-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Plain-English Summary
          </div>
          <p className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
            "{result.one_line_summary}"
          </p>
        </div>
      </div>

      {/* 4-Category Red Flags Breakdown */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Deceptive & High-Risk Red Flags ({result.red_flags.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific shady clauses, deceptive wording, and predatory terms identified in the document.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Red Flags List */}
        <div className="space-y-4 pt-4">
          {filteredRedFlags.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No red flags in this specific category filter.
            </div>
          ) : (
            filteredRedFlags.map((flag, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/70 border border-rose-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-rose-500/60 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-900 border border-slate-800">
                      {getCategoryIcon(flag.category)}
                    </span>
                    <span className="text-xs font-bold text-slate-300">{flag.category}</span>
                  </div>
                  <div>
                    {getSeverityBadge(flag.severity)}
                  </div>
                </div>

                {/* Shady Phrase Quote */}
                <div className="my-2.5 pl-3 border-l-2 border-rose-500/70 bg-rose-500/5 py-2 px-3 rounded-r-lg">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold mb-1">
                    Exact Shady Phrase / Visual Cue:
                  </div>
                  <blockquote className="text-xs sm:text-sm font-mono text-slate-200 italic">
                    "{flag.exact_quote_or_visual_cue}"
                  </blockquote>
                </div>

                {/* Plain-English Explanation */}
                <div className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-rose-300 mr-1.5">Why this hurts you:</span>
                  {flag.plain_english_explanation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legitimate / Green Flags Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Legitimate & Safe Signals Identified ({result.green_flags.length})</span>
        </h3>
        
        {result.green_flags.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No clear legitimate protection terms or standard safeguards were detected in the audited excerpt.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.green_flags.map((flag, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Action Checklist */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Recommended Student Action Checklist</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Check off each step as you complete it to protect your academic and financial standing.
        </p>

        <div className="space-y-2.5">
          {rawActions.map((action, idx) => (
            <div
              key={idx}
              onClick={() => toggleAction(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                checkedActions[idx]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                checkedActions[idx]
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                  : 'border-slate-700 bg-slate-900'
              }`}>
                {checkedActions[idx] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs sm:text-sm leading-relaxed font-medium">
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Reply Template / Urgent Cyber Alert */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-md ${
        isDoNotReply 
          ? 'bg-gradient-to-b from-rose-950/30 via-slate-900 to-slate-900 border-rose-500/50' 
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {isDoNotReply ? (
                <>
                  <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                  <span className="text-rose-400 font-black">CRITICAL ACTION: DO NOT ENGAGE / REPORT SCAM</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-cyan-400" />
                  <span>Safe Reply / Counter-Negotiation Template</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isDoNotReply
                ? 'This is a verified cyber scam or extortion tactic. Engaging will only lead to further financial exploitation.'
                : 'Copy and send this polite, legally firm reply to question or demand removal of the unfair clauses.'}
            </p>
          </div>

          <button
            onClick={handleCopyReply}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDoNotReply
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
            }`}
          >
            {copiedReply ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReply ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>
        </div>

        {/* Template Box */}
        <div className="mt-4 relative">
          <div className={`p-4 rounded-xl font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed border ${
            isDoNotReply
              ? 'bg-slate-950 border-rose-500/40 text-rose-200'
              : 'bg-slate-950 border-slate-700/80 text-slate-200'
          }`}>
            {result.safe_reply_template}
          </div>
        </div>

        {/* Hotlines and Official Help Links */}
        {isDoNotReply && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-300">
              <MessageSquareWarning className="w-4 h-4 shrink-0" />
              <span>Report scam incidents directly to National Cyber Crime Reporting Portal:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-400 font-mono">Dial 1930</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
