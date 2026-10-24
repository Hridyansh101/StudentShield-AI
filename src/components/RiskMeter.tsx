import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  badge: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, badge }) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine styling based on score & badge
  let colorScheme = {
    bg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    border: 'border-emerald-500/30',
    ring: 'stroke-emerald-500',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    icon: ShieldCheck,
    label: 'SAFE'
  };

  if (normalizedScore > 85 || badge.toUpperCase().includes('CRITICAL')) {
    colorScheme = {
      bg: 'from-rose-500/15 via-red-950/20 to-transparent',
      border: 'border-rose-500/50',
      ring: 'stroke-rose-500',
      text: 'text-rose-400',
      badgeBg: 'bg-rose-500/25 text-rose-300 border-rose-500/60 animate-pulse',
      glow: 'shadow-[0_0_40px_rgba(244,63,94,0.3)]',
      icon: Flame,
      label: 'CRITICAL SCAM'
    };
  } else if (normalizedScore > 60 || badge.toUpperCase().includes('HIGH RISK')) {
    colorScheme = {
      bg: 'from-amber-500/15 via-orange-950/20 to-transparent',
      border: 'border-amber-500/40',
      ring: 'stroke-amber-500',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
      icon: ShieldAlert,
      label: 'HIGH RISK TRAP'
    };
  } else if (normalizedScore > 25 || badge.toUpperCase().includes('CAUTION')) {
    colorScheme = {
      bg: 'from-yellow-500/10 via-amber-950/10 to-transparent',
      border: 'border-yellow-500/30',
      ring: 'stroke-yellow-400',
      text: 'text-yellow-400',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      glow: 'shadow-[0_0_25px_rgba(234,179,8,0.2)]',
      icon: AlertTriangle,
      label: 'CAUTION'
    };
  }

  const Icon = colorScheme.icon;

  // Arc calculation for SVG circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colorScheme.border} bg-gradient-to-b ${colorScheme.bg} p-6 ${colorScheme.glow} backdrop-blur-md`}>
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        
        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 130 130">
            {/* Background circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Animated progress circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`${colorScheme.ring} transition-all duration-1000 ease-out`}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              {normalizedScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
              Risk Score
            </span>
          </div>
        </div>

        {/* Verdict Badge & Context */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2">
            <div className={`px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border flex items-center gap-1.5 ${colorScheme.badgeBg}`}>
              <Icon className="w-4 h-4" />
              <span>{badge || colorScheme.label}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            {normalizedScore > 85 ? 'Severe Deceptive Trap / Cyber Scam Detected' :
             normalizedScore > 60 ? 'Unfair & Predatory Clauses Present' :
             normalizedScore > 25 ? 'Mild Irregularities — Proceed With Vigilance' :
             'Document Appears Transparent & Legitimate'}
          </h3>

          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            {normalizedScore > 85
              ? 'Critical financial, phishing, or legal threats identified. Do NOT sign, do NOT send money, and do NOT submit documents.'
              : normalizedScore > 60
              ? 'One or more clauses severely prejudice student legal or financial rights (e.g. exit penalties, forfeitures, or withheld certificates).'
              : normalizedScore > 25
              ? 'Minor ambiguities or typical boilerplate clauses requiring clarification or formal counter-offer.'
              : 'Standard terminology aligned with fair student employment, privacy rights, and lease practices.'}
          </p>
        </div>

      </div>
    </div>
  );
};
