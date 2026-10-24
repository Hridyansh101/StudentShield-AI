import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, X, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { PRESET_CASES } from '../data/presets';
import { PresetCase } from '../types';

interface AuditInputFormProps {
  onAudit: (params: {
    text: string;
    imageBase64?: string;
    mimeType?: string;
    categoryHint?: string;
  }) => Promise<void>;
  isLoading: boolean;
  onSelectPreset: (preset: PresetCase) => void;
}

const CATEGORIES = [
  'Auto-Detect Type',
  'Internship Offer',
  'Job Contract & Bond',
  'PG / Rental Agreement',
  'WhatsApp / Email Notice',
  'Checkout / Subscription Page'
];

export const AuditInputForm: React.FC<AuditInputFormProps> = ({
  onAudit,
  isLoading,
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  const [categoryHint, setCategoryHint] = useState('Auto-Detect Type');
  
  // Image state
  const [imageFile, setImageFile] = useState<{
    base64: string;
    name: string;
    mimeType: string;
    previewUrl: string;
  } | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle global paste for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          processImageFile(file);
          setActiveTab('image');
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageFile({
        base64,
        name: file.name,
        mimeType: file.type,
        previewUrl: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !imageFile) {
      return;
    }

    onAudit({
      text: inputText.trim(),
      imageBase64: imageFile?.base64,
      mimeType: imageFile?.mimeType,
      categoryHint: categoryHint !== 'Auto-Detect Type' ? categoryHint : undefined,
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl">
      {/* Decorative gradient aura */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Top Banner and Category Selector */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>Audit Suspicious Document or Offer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scan internship letters, PG leases, campus emails, and course signups for predatory traps before you sign or pay.
          </p>
        </div>

        {/* Category Hint Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="category-hint" className="text-xs font-semibold text-slate-400 whitespace-nowrap">Document Hint:</label>
          <select
            id="category-hint"
            value={categoryHint}
            onChange={(e) => setCategoryHint(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Switcher: Text vs Image Upload */}
      <div className="relative z-10 flex items-center gap-2 mt-5 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Text / Contract</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'image'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Upload / Paste Screenshot</span>
          {imageFile && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Input Area Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        {activeTab === 'text' ? (
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious WhatsApp message, email notice, internship offer letter clauses, or PG lease agreement here... (e.g. 'Pay ₹4,999 training fee to confirm your internship seat...')"
              rows={8}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono leading-relaxed transition-all resize-y"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute top-3 right-3 p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Tip: Include the full clause, email headers (like sender email), or pricing fine print for maximum accuracy.</span>
              <span>{inputText.length} characters</span>
            </div>
          </div>
        ) : (
          <div>
            {imageFile ? (
              <div className="relative border border-cyan-500/40 rounded-xl bg-slate-950 p-4 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={imageFile.previewUrl}
                  alt="Audit preview"
                  className="w-36 h-36 object-contain rounded-lg border border-slate-800 bg-slate-900"
                />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Image Ready for Vision Audit
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-sm">{imageFile.name}</p>
                  <p className="text-xs text-slate-400">
                    StudentShield AI will read all micro-text, deceptive pricing, countdown timers, and fine print directly from this image.
                  </p>
                  
                  {/* Optional supplementary text note */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Add an optional note (e.g. 'Received this on WhatsApp from an unknown HR number')"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="sm:self-start p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : 'border-slate-700/80 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-950'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processImageFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-1">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload or drag & drop screenshot
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Upload screenshots of WhatsApp chats, email headers, course checkout pages, or contract clauses (PNG, JPG, WebP).
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
                      Or press Ctrl+V / ⌘+V to paste screenshot directly
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls & Preset Loaders */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3">
          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Try sample:
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectPreset(PRESET_CASES[0]);
                setInputText(PRESET_CASES[0].inputText);
                setCategoryHint(PRESET_CASES[0].category);
                setActiveTab('text');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              💸 Fake ₹4,999 Fee
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectPreset(PRESET_CASES[1]);
                setInputText(PRESET_CASES[1].inputText);
                setCategoryHint(PRESET_CASES[1].category);
                setActiveTab('text');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              📜 Certificate Hostage Bond
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectPreset(PRESET_CASES[3]);
                setInputText(PRESET_CASES[3].inputText);
                setCategoryHint(PRESET_CASES[3].category);
                setActiveTab('text');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              🚨 Placement Phishing
            </button>
          </div>

          {/* Audit CTA Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && !imageFile)}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLoading || (!inputText.trim() && !imageFile)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing Traps...</span>
              </>
            ) : (
              <>
                <span>Run StudentShield Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Safety Notice Footer */}
      <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Evaluates strictly across <strong>Financial Traps</strong>, <strong>Identity & Phishing Signals</strong>, <strong>Legal Red Flags</strong>, and <strong>Dark Patterns</strong>.
        </span>
      </div>
    </div>
  );
};
