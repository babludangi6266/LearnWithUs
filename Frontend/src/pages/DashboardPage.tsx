import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiService, Phase, Feedback, StudentProgress } from '@/services/api';
import { 
  Trophy, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  MessageSquare, 
  User, 
  Clock, 
  Zap, 
  BookOpen,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const fetchedPhases = await apiService.getPhases();
        setPhases(fetchedPhases);

        if (user && user.id) {
          try {
            const feedback = await apiService.getStudentFeedback(user.id);
            setFeedbackList(feedback);
            
            const prog = await apiService.getStudentProgress(user.id);
            if (prog && prog.progress) {
              const map: Record<string, StudentProgress> = {};
              prog.progress.forEach((p: StudentProgress) => {
                const pid = typeof p.phaseId === 'object' ? p.phaseId._id : p.phaseId;
                map[pid] = p;
              });
              setProgressMap(map);
            }
          } catch (e) {
            console.log('Progress / feedback API optional load');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Compute metrics
  const completedCount = Object.keys(progressMap).length;
  const totalScoreObtained = Object.values(progressMap).reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalPossibleScore = Object.values(progressMap).reduce((acc, curr) => acc + (curr.totalScore || curr.totalQuestions || 3), 0);
  const overallPercentage = totalPossibleScore > 0 ? Math.round((totalScoreObtained / totalPossibleScore) * 100) : 0;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass-card rounded-3xl p-12 border border-white/10 relative overflow-hidden">
          <User className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white">Student Dashboard</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            Please log in or register to track your learning progress, view your quiz scores, and receive feedback from instructors.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 text-[#06080D] font-bold text-sm shadow-neon-emerald"
            >
              Log In / Register
            </button>
          </div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Student Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, <span className="gradient-text-cyan-violet">{user.name || user.email}</span>
          </h1>
        </div>

        <Link
          to="/notes"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-gray-200 hover:text-white border border-white/10"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Browse Notes Hub</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Completed Phases</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{completedCount} / {phases.length}</div>
          <p className="text-xs text-gray-400 mt-1">Evaluated quiz modules</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Average Score</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{overallPercentage}%</div>
          <p className="text-xs text-gray-400 mt-1">Across all answered questions</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Total Points</span>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalScoreObtained} pts</div>
          <p className="text-xs text-gray-400 mt-1">Out of {totalPossibleScore} points</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Instructor Notes</span>
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{feedbackList.length}</div>
          <p className="text-xs text-gray-400 mt-1">Direct admin feedback</p>
        </div>
      </div>

      {/* Main Grid: Phase Progress & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Phase Assessments */}
        <div className="lg:col-span-8 space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Learning Phases & Assessments</span>
          </h2>

          <div className="space-y-4">
            {phases.map((phase, idx) => {
              const prog = progressMap[phase._id];
              const isDone = !!prog;
              const phaseScore = prog ? prog.score : 0;
              const totalQ = prog ? (prog.totalScore || prog.totalQuestions || 3) : 3;
              const pct = isDone ? Math.round((phaseScore / totalQ) * 100) : 0;

              return (
                <div
                  key={phase._id}
                  className="glass-card rounded-2xl p-6 border border-white/10 transition-all hover:border-cyan-400/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 font-bold">Phase 0{idx + 1}</span>
                        {isDone && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                    </div>

                    <Link
                      to={`/quiz/${phase._id}`}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all text-center flex items-center justify-center gap-2 ${
                        isDone
                          ? 'bg-gray-800 hover:bg-white/10 text-gray-200 border border-white/10'
                          : 'bg-gradient-to-r from-cyan-400 to-emerald-500 text-[#06080D] shadow-neon-emerald'
                      }`}
                    >
                      <span>{isDone ? 'Retake Assessment' : 'Start Assessment'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Progress Bar */}
                  {isDone && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Score Achieved:</span>
                        <span className="text-white font-bold">{phaseScore} / {totalQ} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#06080D] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Feedback Side Column */}
        <div className="lg:col-span-4 space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Instructor Feedback</span>
          </h2>

          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 border border-white/5 text-center text-gray-400 space-y-2">
                <ShieldCheck className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-xs">No direct feedback received yet.</p>
                <p className="text-[11px] text-gray-500">
                  When admins evaluate your scores, their direct messages will appear here.
                </p>
              </div>
            ) : (
              feedbackList.map((fb, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-purple-500/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-purple-300 font-bold">Admin ({fb.adminId})</span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed font-light">
                    "{fb.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
