import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, Phase, Question, Note, Student } from '@/services/api';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Upload,
  Download,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'phases' | 'notes' | 'students' | 'import'>('phases');

  const [phases, setPhases] = useState<Phase[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Form states
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newNoteLang, setNewNoteLang] = useState('JavaScript');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // New Question state
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrect, setQCorrect] = useState(0);

  // Feedback state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // File Upload states
  const [isUploading, setIsUploading] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showNotify = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  async function refreshAllData() {
    setIsLoading(true);
    try {
      const p = await apiService.getPhases();
      setPhases(p);
      if (p.length > 0) {
        setSelectedPhaseId(p[0]._id);
        const q = await apiService.getQuestionsByPhase(p[0]._id);
        setQuestions(q);
      }

      const n = await apiService.getAllNotes();
      setNotes(n);

      const s = await apiService.getAllStudents();
      setStudents(s);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }
    refreshAllData();
  }, [user]);

  const handlePhaseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPhaseId(pId);
    try {
      const q = await apiService.getQuestionsByPhase(pId);
      setQuestions(q);
    } catch {
      setQuestions([]);
    }
  };

  const handleAddPhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;
    try {
      const created = await apiService.addPhase(newPhaseName);
      setPhases(prev => [...prev, created]);
      setNewPhaseName('');
      if (!selectedPhaseId) setSelectedPhaseId(created._id);
      showNotify('success', 'New curriculum phase created successfully!');
    } catch {
      showNotify('error', 'Failed to create phase.');
    }
  };

  const handleDeletePhase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this phase and all associated questions?')) return;
    try {
      await apiService.deletePhase(id);
      const updated = phases.filter(p => p._id !== id);
      setPhases(updated);
      if (selectedPhaseId === id) {
        if (updated.length > 0) {
          setSelectedPhaseId(updated[0]._id);
          const q = await apiService.getQuestionsByPhase(updated[0]._id);
          setQuestions(q);
        } else {
          setSelectedPhaseId('');
          setQuestions([]);
        }
      }
      showNotify('success', 'Phase deleted successfully!');
    } catch {
      showNotify('error', 'Failed to delete phase.');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhaseId || !qText.trim() || !qOpt0.trim() || !qOpt1.trim()) return;

    try {
      const created = await apiService.addQuestion({
        phase: selectedPhaseId,
        question: qText,
        options: [qOpt0, qOpt1, qOpt2 || 'Option 3', qOpt3 || 'Option 4'],
        correctOption: qCorrect
      });
      setQuestions(prev => [...prev, created]);
      setQText('');
      setQOpt0('');
      setQOpt1('');
      setQOpt2('');
      setQOpt3('');
      setQCorrect(0);
      showNotify('success', 'Assessment question added!');
    } catch {
      showNotify('error', 'Failed to add question.');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await apiService.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q._id !== id));
      showNotify('success', 'Question deleted!');
    } catch {
      showNotify('error', 'Failed to delete question.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    try {
      const created = await apiService.addNote({
        language: newNoteLang,
        title: newNoteTitle,
        content: newNoteContent
      });
      setNotes(prev => [...prev, created]);
      setNewNoteTitle('');
      setNewNoteContent('');
      showNotify('success', 'Documentation note published!');
    } catch {
      showNotify('error', 'Failed to add note.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await apiService.deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
      showNotify('success', 'Note deleted!');
    } catch {
      showNotify('error', 'Failed to delete note.');
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !feedbackMsg.trim()) return;
    try {
      await apiService.sendFeedback(selectedStudentId, feedbackMsg);
      setFeedbackMsg('');
      showNotify('success', 'Feedback sent to student!');
    } catch {
      showNotify('error', 'Failed to send feedback.');
    }
  };

  // Bulk File Upload Handlers
  const handleUploadPhasesFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await apiService.importPhasesAndQuestions(file);
      showNotify('success', res.message || 'Phases & Questions imported successfully!');
      await refreshAllData();
    } catch (err: any) {
      showNotify('error', err.response?.data?.message || 'Error importing Excel/Word file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleUploadNotesFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await apiService.importNotes(file);
      showNotify('success', res.message || 'Documentation Notes imported successfully!');
      await refreshAllData();
    } catch (err: any) {
      showNotify('error', err.response?.data?.message || 'Error importing Notes file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Enterprise Admin Management Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Admin <span className="gradient-text-indigo-cyan">Control Center</span>
          </h1>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex bg-[#0F172A]/80 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
        {[
          { id: 'phases', label: 'Curriculum & Quizzes', icon: Layers },
          { id: 'import', label: '📥 Excel / Word Bulk Import', icon: Upload },
          { id: 'notes', label: 'Documentation Studio', icon: BookOpen },
          { id: 'students', label: 'Students & Feedback', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-neon-indigo'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXCEL / WORD BULK IMPORT & TEMPLATES */}
      {activeTab === 'import' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Import Phases & Questions Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/40 space-y-6 relative overflow-hidden">
              <div className="glow-point-indigo -top-20 -right-20 opacity-30" />

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>Bulk Phases & Questions Import</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Upload Excel (.xlsx, .csv) or Word/Text File
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Upload an Excel spreadsheet or Text file containing phase names and 4-option multiple-choice assessment questions.
                </p>
              </div>

              {/* Sample Template Downloads */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">1. Download Sample Templates:</span>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={apiService.getExcelTemplateUrl()}
                    download="Phases_Questions_Template.xlsx"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Excel Template (.xlsx)</span>
                  </a>
                </div>
              </div>

              {/* File Upload Field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase">2. Select File to Upload:</label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv, .txt, .json"
                  onChange={handleUploadPhasesFile}
                  disabled={isUploading}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer glass-input cursor-pointer"
                />
              </div>

              {isUploading && (
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-mono animate-pulse flex items-center gap-2">
                  <Upload className="w-4 h-4 animate-spin" />
                  <span>Parsing uploaded file & seeding MongoDB...</span>
                </div>
              )}
            </div>

            {/* Import Notes Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/40 space-y-6 relative overflow-hidden">
              <div className="glow-point-cyan -top-20 -right-20 opacity-30" />

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Bulk Notes Import</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Upload Documentation Notes File
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Upload Excel or Word/Markdown files to bulk add technical documentation notes across Java, Spring Boot, JS, and AI.
                </p>
              </div>

              {/* Sample Template Downloads */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">1. Download Sample Notes Template:</span>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={apiService.getNotesTemplateUrl()}
                    download="Notes_Template.xlsx"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download Notes Template (.xlsx)</span>
                  </a>
                </div>
              </div>

              {/* File Upload Field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase">2. Select Notes File to Upload:</label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv, .txt, .json"
                  onChange={handleUploadNotesFile}
                  disabled={isUploading}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer glass-input cursor-pointer"
                />
              </div>

              {isUploading && (
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono animate-pulse flex items-center gap-2">
                  <Upload className="w-4 h-4 animate-spin" />
                  <span>Parsing uploaded notes file...</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM & QUIZZES */}
      {activeTab === 'phases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Phases Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Add New Curriculum Phase
              </h2>

              <form onSubmit={handleAddPhase} className="space-y-4">
                <input
                  type="text"
                  required
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                  placeholder="e.g. Phase 9: Distributed Microservices Architecture"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Phase</span>
                </button>
              </form>
            </div>

            {/* Existing Phases List */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono text-slate-400 uppercase font-bold">Existing Phases ({phases.length})</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {phases.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      setSelectedPhaseId(p._id);
                      apiService.getQuestionsByPhase(p._id).then(setQuestions);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      selectedPhaseId === p._id
                        ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-neon-indigo'
                        : 'bg-slate-900 border-white/5 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{p.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhase(p._id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Phase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Questions Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  Add Assessment Question
                </h2>

                <select
                  value={selectedPhaseId}
                  onChange={handlePhaseChange}
                  className="px-3.5 py-2 rounded-xl glass-input text-xs bg-slate-900 font-bold"
                >
                  {phases.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Question Prompt</label>
                  <textarea
                    required
                    rows={2}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter question text e.g. What is the role of Garbage Collection in Java?"
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Option 1 (Index 0)</label>
                    <input
                      type="text"
                      required
                      value={qOpt0}
                      onChange={(e) => setQOpt0(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Option 2 (Index 1)</label>
                    <input
                      type="text"
                      required
                      value={qOpt1}
                      onChange={(e) => setQOpt1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Option 3 (Index 2)</label>
                    <input
                      type="text"
                      value={qOpt2}
                      onChange={(e) => setQOpt2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Option 4 (Index 3)</label>
                    <input
                      type="text"
                      value={qOpt3}
                      onChange={(e) => setQOpt3(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Correct Answer Index</label>
                  <select
                    value={qCorrect}
                    onChange={(e) => setQCorrect(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value={0}>Option 1 (Index 0)</option>
                    <option value={1}>Option 2 (Index 1)</option>
                    <option value={2}>Option 3 (Index 2)</option>
                    <option value={3}>Option 4 (Index 3)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question to Selected Phase</span>
                </button>
              </form>
            </div>

            {/* Questions List */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono text-slate-400 uppercase font-bold">Questions in Selected Phase ({questions.length})</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div key={q._id} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">Q{idx + 1}: {q.question}</span>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-1 rounded hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={optIdx === q.correctOption ? 'text-emerald-400 font-bold' : ''}>
                          {optIdx}: {opt} {optIdx === q.correctOption ? '✓' : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTATION NOTES */}
      {activeTab === 'notes' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Publish Technical Documentation Note
          </h2>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Technology / Language</label>
                <select
                  value={newNoteLang}
                  onChange={(e) => setNewNoteLang(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 font-bold"
                >
                  <option value="Java">Java</option>
                  <option value="Spring Boot">Spring Boot</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="React">React</option>
                  <option value="Python">Python</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="DSA">Data Structures & Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Note Title</label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. 1. JVM Memory Tuning & Garbage Collection"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Content (Markdown Supported)</label>
              <textarea
                required
                rows={6}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write documentation using Markdown syntax..."
                className="w-full p-4 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Note</span>
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase font-bold">Published Notes ({notes.length})</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {notes.map((n) => (
                <div key={n._id} className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {n.language}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{n.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(n._id)}
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STUDENTS & FEEDBACK */}
      {activeTab === 'students' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Send Feedback to Student
          </h2>

          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 font-bold"
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Feedback Message</label>
              <textarea
                required
                rows={3}
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                placeholder="Enter feedback or praise for student progress..."
                className="w-full p-4 rounded-xl glass-input text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Feedback</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
