import React, { useEffect, useState } from 'react';
import { apiService, Note } from '@/services/api';
import MarkdownRenderer, { stripMarkdown } from '@/components/MarkdownRenderer';
import CodePlayground from '@/components/CodePlayground';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  FileText,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  Terminal,
  Zap,
  ListFilter,
  Layers,
  X
} from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'reader'>('list');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  async function fetchNotes() {
    setIsLoading(true);
    try {
      const fetchedNotes = await apiService.getAllNotes();
      setNotes(fetchedNotes);
      
      const fetchedLangs = await apiService.getDistinctLanguages();
      setLanguages(['All', ...fetchedLangs]);

      if (fetchedNotes.length > 0) {
        setActiveNote(fetchedNotes[0]);
      }
    } catch (err) {
      console.error('Notes loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesLang = selectedLanguage === 'All' || note.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchesQuery = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesQuery;
  });

  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
    setMobileViewMode('reader');
  };

  const handleCopyCode = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#080C14] overflow-y-auto max-w-none p-6' : ''}`}>
      
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer Documentation & Architecture Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Notes & <span className="gradient-text-indigo-cyan">Language Hub</span>
          </h1>
        </div>

        {/* Action Controls & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{isPlaygroundOpen ? 'Close Playground' : '⚡ Try Code Live'}</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-mono"
            title="Toggle Focus Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
            <span>{isFullscreen ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>
        </div>
      </div>

      {/* LIVE INTERACTIVE CODE PLAYGROUND SECTION */}
      {isPlaygroundOpen && activeNote && (
        <CodePlayground
          initialCode={activeNote.content}
          language={activeNote.language}
          isOpen={isPlaygroundOpen}
          onClose={() => setIsPlaygroundOpen(false)}
        />
      )}

      {/* 2. LANGUAGE PILLS & STATS STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A]/80 p-2 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedLanguage.toLowerCase() === lang.toLowerCase()
                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border-cyan-400 text-white shadow-neon-indigo'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 px-3 text-xs font-mono text-slate-400 border-l border-white/10">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <strong className="text-white">{filteredNotes.length}</strong> Guides
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <strong className="text-white">100%</strong> Verified
          </span>
        </div>
      </div>

      {/* 3. MOBILE VIEW TOGGLE */}
      <div className="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setMobileViewMode('list')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileViewMode === 'list'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Select Guide ({filteredNotes.length})</span>
        </button>
        <button
          onClick={() => setMobileViewMode('reader')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileViewMode === 'reader'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reader View</span>
        </button>
      </div>

      {/* 4. WORKSTATION DUAL-PANE LAYOUT - FULL FLUID WIDTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PALETTE: Directory Cards */}
        <div className={`lg:col-span-4 space-y-3 ${mobileViewMode === 'list' ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24 lg:max-h-[calc(100vh-170px)] flex flex-col`}>
          <div className="flex items-center justify-between px-1 shrink-0">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Guide Directory ({filteredNotes.length})
            </h2>
          </div>

          <div className="overflow-y-auto pr-1 space-y-3 flex-1 max-h-[550px] lg:max-h-[calc(100vh-220px)] scrollbar-thin">
            {filteredNotes.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-white/5 text-center text-slate-400 space-y-2">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs font-medium">No notes match your search query.</p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?._id === note._id;
                const cleanPreview = stripMarkdown(note.content);

                return (
                  <div
                    key={note._id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600/20 via-slate-900 to-cyan-500/20 border-cyan-400/50 shadow-neon-indigo'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-cyan-400" />
                    )}

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {note.language}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-300'}`} />
                    </div>

                    <h3 className="text-sm font-bold text-white font-heading line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-light leading-relaxed">
                      {cleanPreview ? cleanPreview.slice(0, 90) + '...' : 'Click to read full guide'}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT READER STUDIO */}
        <div className={`lg:col-span-8 ${mobileViewMode === 'reader' ? 'block' : 'hidden lg:block'}`}>
          {activeNote ? (
            <div className="glass-card rounded-3xl border border-white/10 relative overflow-hidden flex flex-col lg:max-h-[calc(100vh-170px)] shadow-2xl">
              
              {/* Toolbar */}
              <div className="p-5 sm:p-6 border-b border-white/10 bg-[#080C14]/90 backdrop-blur-xl shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span>Notes Hub</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className="text-indigo-400">{activeNote.language}</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-200 line-clamp-1">{activeNote.title.slice(0, 40)}...</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading leading-snug">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsPlaygroundOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Try Code Live</span>
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable Reader Content Area */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 max-h-[550px] lg:max-h-[calc(100vh-260px)] scrollbar-thin bg-[#080C14]/70">
                <div className="max-w-none">
                  <MarkdownRenderer content={activeNote.content} />
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 border border-white/5 text-center text-slate-500">
              Select a note from the left sidebar to read guidelines and code snippets.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
