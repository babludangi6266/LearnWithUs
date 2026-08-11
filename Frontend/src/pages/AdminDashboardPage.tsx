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
  FileText
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'phases' | 'notes' | 'students'>('phases');

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

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showNotify = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }

    async function loadData() {
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

    loadData();
  }, [user, navigate]);

  // Load questions when selected phase changes
  const handleSelectPhase = async (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    try {
      const q = await apiService.getQuestionsByPhase(phaseId);
      setQuestions(q);
    } catch (err) {
      console.error(err);
    }
  };

  // Phase Actions
  const handleAddPhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;
    try {
      const added = await apiService.addPhase(newPhaseName);
      setPhases(prev => [...prev, added]);
      setNewPhaseName('');
      showNotify('success', 'New Phase created successfully!');
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to create Phase');
    }
  };

  const handleDeletePhase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this phase and all questions inside it?')) return;
    try {
      await apiService.deletePhase(id);
      setPhases(prev => prev.filter(p => p._id !== id));
      if (selectedPhaseId === id) {
        setQuestions([]);
      }
      showNotify('success', 'Phase deleted successfully.');
    } catch (err: any) {
      showNotify('error', 'Failed to delete phase');
    }
  };

  // Question Actions
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhaseId) {
      showNotify('error', 'Please select a phase first');
      return;
    }
    if (!qText.trim() || !qOpt0.trim() || !qOpt1.trim()) {
      showNotify('error', 'Please fill question text and at least 2 options');
      return;
    }

    const options = [qOpt0, qOpt1, qOpt2, qOpt3].filter(o => o.trim() !== '');

    try {
      const createdQ = await apiService.addQuestion(selectedPhaseId, {
        question: qText,
        options,
        correctOption: qCorrect
      });
      setQuestions(prev => [...prev, createdQ]);
      setQText('');
      setQOpt0('');
      setQOpt1('');
      setQOpt2('');
      setQOpt3('');
      showNotify('success', 'Question added to phase!');
    } catch (err: any) {
      showNotify('error', 'Failed to add question');
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    try {
      await apiService.deleteQuestion(qId);
      setQuestions(prev => prev.filter(q => q._id !== qId));
      showNotify('success', 'Question deleted.');
    } catch (err: any) {
      showNotify('error', 'Failed to delete question');
    }
  };

  // Note Actions
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const createdNote = await apiService.addNote({
        language: newNoteLang,
        title: newNoteTitle,
        content: newNoteContent
      });
      setNotes(prev => [createdNote, ...prev]);
      setNewNoteTitle('');
      setNewNoteContent('');
      showNotify('success', 'Note published to Notes Hub!');
    } catch (err: any) {
      showNotify('error', 'Failed to publish note');
    }
  };

  // Send Feedback
  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !feedbackMsg.trim()) {
      showNotify('error', 'Select a student and write a message');
      return;
    }

    try {
      await apiService.sendFeedback(selectedStudentId, feedbackMsg);
      setFeedbackMsg('');
      showNotify('success', 'Feedback sent to student!');
    } catch (err: any) {
      showNotify('error', 'Failed to send feedback');
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Admin <span className="gradient-text-cyan-violet">Management Portal</span>
          </h1>
        </div>

        {/* System Notification */}
        {notification && (
          <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
            notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.text}</span>
          </div>
        )}
      </div>

      {/* Statistics Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10 text-center">
          <Layers className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-white font-mono">{phases.length}</div>
          <div className="text-xs text-gray-400 font-mono uppercase mt-1">Phases</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 text-center">
          <HelpCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-white font-mono">{questions.length}</div>
          <div className="text-xs text-gray-400 font-mono uppercase mt-1">Questions in Phase</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 text-center">
          <BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-white font-mono">{notes.length}</div>
          <div className="text-xs text-gray-400 font-mono uppercase mt-1">Notes Published</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 text-center">
          <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-white font-mono">{students.length}</div>
          <div className="text-xs text-gray-400 font-mono uppercase mt-1">Registered Students</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[#06080D]/80 p-1.5 rounded-2xl border border-white/10">
        {[
          { id: 'phases', label: 'Phases & Question Bank', icon: Layers },
          { id: 'notes', label: 'Notes Hub Publisher', icon: FileText },
          { id: 'students', label: 'Students & Feedback', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-500/30 to-cyan-400/30 text-white border border-cyan-400/40 shadow-neon-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PHASES & QUESTIONS MANAGER */}
      {activeTab === 'phases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Create Phase & Phase List */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Create Phase Form */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Add New Phase
              </h3>
              <form onSubmit={handleAddPhase} className="space-y-3">
                <input
                  type="text"
                  required
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                  placeholder="Phase Name (e.g. Phase 5: Microservices)"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 text-[#06080D] font-bold text-xs shadow-neon-emerald"
                >
                  Create Phase
                </button>
              </form>
            </div>

            {/* Existing Phases List */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                Existing Phases ({phases.length})
              </h3>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {phases.map((p) => {
                  const isSelected = selectedPhaseId === p._id;
                  return (
                    <div
                      key={p._id}
                      onClick={() => handleSelectPhase(p._id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-cyan-400/10 border-cyan-400 text-white shadow-neon-cyan'
                          : 'bg-gray-900/40 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold line-clamp-1">{p.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePhase(p._id); }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-colors shrink-0"
                        title="Delete Phase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Manage Questions for Selected Phase */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Add Question to Selected Phase Form */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" /> Add Question to Selected Phase
              </h3>
              
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Question Text</label>
                  <textarea
                    required
                    rows={2}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter the question text..."
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">Option A</label>
                    <input
                      type="text"
                      required
                      value={qOpt0}
                      onChange={(e) => setQOpt0(e.target.value)}
                      placeholder="Option A string"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">Option B</label>
                    <input
                      type="text"
                      required
                      value={qOpt1}
                      onChange={(e) => setQOpt1(e.target.value)}
                      placeholder="Option B string"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">Option C (Optional)</label>
                    <input
                      type="text"
                      value={qOpt2}
                      onChange={(e) => setQOpt2(e.target.value)}
                      placeholder="Option C string"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">Option D (Optional)</label>
                    <input
                      type="text"
                      value={qOpt3}
                      onChange={(e) => setQOpt3(e.target.value)}
                      placeholder="Option D string"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Correct Option Index</label>
                  <select
                    value={qCorrect}
                    onChange={(e) => setQCorrect(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-gray-900"
                  >
                    <option value={0}>Option A (Index 0)</option>
                    <option value={1}>Option B (Index 1)</option>
                    <option value={2}>Option C (Index 2)</option>
                    <option value={3}>Option D (Index 3)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-neon-violet hover:bg-purple-500 transition-colors"
                >
                  Save Question to Phase Bank
                </button>
              </form>
            </div>

            {/* Questions List for Selected Phase */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Questions in Phase ({questions.length})
              </h3>

              {questions.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No questions added to this phase yet.</p>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={q._id} className="p-4 rounded-xl bg-[#06080D]/60 border border-white/5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold text-white">
                          <span className="text-cyan-400 mr-1 font-mono">Q{idx + 1}.</span> {q.question}
                        </div>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors shrink-0"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border ${
                              oIdx === q.correctOption
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                                : 'bg-gray-900 border-white/5'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}: {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: NOTES PUBLISHER */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Note Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Publish New Note
              </h3>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Programming Language</label>
                  <select
                    value={newNoteLang}
                    onChange={(e) => setNewNoteLang(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-gray-900"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="Java">Java</option>
                    <option value="Rust">Rust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Note Title</label>
                  <input
                    type="text"
                    required
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="e.g. React Custom Hooks & Memory Efficiency"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Content / Code Snippet</label>
                  <textarea
                    required
                    rows={6}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Enter code snippets, markdown, or documentation text..."
                    className="w-full p-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 text-[#06080D] font-bold text-xs shadow-neon-emerald"
                >
                  Publish Note
                </button>
              </form>
            </div>
          </div>

          {/* Published Notes List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Published Notes ({notes.length})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {notes.map((n) => (
                  <div key={n._id} className="p-4 rounded-xl bg-[#06080D]/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-purple-500/20 text-purple-300">
                        {n.language}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <pre className="p-3 rounded-lg bg-gray-950 text-[11px] font-mono text-cyan-400 overflow-x-auto max-h-28">
                      {n.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: STUDENTS & FEEDBACK */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Registered Students Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Registered Students List ({students.length})
              </h3>

              <div className="space-y-3">
                {students.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => setSelectedStudentId(s._id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      selectedStudentId === s._id
                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-neon-violet'
                        : 'bg-[#06080D]/60 border-white/5 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{s.name || 'Student'}</div>
                      <div className="text-xs font-mono text-gray-400">{s.email}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-gray-800 text-cyan-400 border border-white/10">
                        {s.progress?.length || 0} Phases Evaluated
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Send Direct Feedback Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-purple-500/30 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" /> Dispatch Student Feedback
              </h3>

              <form onSubmit={handleSendFeedback} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Target Student ID</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-gray-900"
                  >
                    <option value="">-- Select a Student --</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Feedback Message</label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    placeholder="Enter personalized guidance, suggestions, or congratulations..."
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-neon-violet hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Feedback</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
