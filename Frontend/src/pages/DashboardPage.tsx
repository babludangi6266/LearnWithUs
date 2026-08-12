import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiService, Phase, Feedback, StudentProgress } from '@/services/api';
import StudentProgressTree from '@/components/StudentProgressTree';
import { 
  Trophy, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  Flame,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const fetchedPhases = await apiService.getPhases();
        setPhases(fetchedPhases);

        // Load local progress map from localStorage for 100% immediate sync
        const localMapRaw = localStorage.getItem('learnwithus_progress_map');
        const localMap: Record<string, StudentProgress> = localMapRaw ? JSON.parse(localMapRaw) : {};

        const uAny = user as any;
        if (user && (uAny?.id || uAny?._id || uAny?.email)) {
          try {
            const uid = uAny?.id || uAny?._id || uAny?.email;
            const feedback = await apiService.getStudentFeedback(uid);
            setFeedbackList(feedback);
            
            const prog = await apiService.getStudentProgress(uid);
            if (prog && prog.progress) {
              prog.progress.forEach((p: StudentProgress) => {
                const pid = typeof p.phaseId === 'object' ? p.phaseId._id : p.phaseId;
                localMap[pid] = p;
              });
            }
          } catch (e) {
            console.log('Progress API fallback');
          }
        }

        setProgressMap(localMap);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Compute Metrics accurately
  const completedCount = Object.keys(progressMap).length;
  const totalPhases = phases.length > 0 ? phases.length : 4;
  const totalScoreObtained = Object.values(progressMap).reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalPossibleScore = Object.values(progressMap).reduce((acc, curr) => acc + (curr.totalScore || curr.totalQuestions || 3), 0);
  const overallPercentage = totalPossibleScore > 0 ? Math.round((totalScoreObtained / totalPossibleScore) * 100) : 0;

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass-card rounded-3xl p-12 border border-white/10 space-y-6 relative overflow-hidden">
          <User className="w-16 h-16 text-cyan-400 mx-auto" />
          <h2 className="text-3xl font-extrabold text-white font-heading">Student Portal Login Required</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto font-light leading-relaxed">
            Sign in to track your learning phase progress, attempt quiz assessments, and view feedback from instructors.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all inline-flex items-center gap-2"
          >
            <span>Log In to Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode="login"
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Verified Student Learning Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Welcome back, <span className="gradient-text-indigo-cyan">{user.name || user.email}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Track completed curriculum phases, monitor quiz performance, and grow your tech tree.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/notes"
            className="px-5 py-3 rounded-2xl glass-card text-white font-bold text-xs hover:border-cyan-400/40 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Open Notes Studio</span>
          </Link>
        </div>
      </div>

      {/* 2. TOP METRICS METERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Completed Phases</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{completedCount} <span className="text-sm font-normal text-slate-400">/ {totalPhases}</span></div>
          <div className="text-[11px] text-slate-400 font-mono">Curriculum Modules Attempted</div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Average Score</span>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{overallPercentage}%</div>
          <div className="text-[11px] text-slate-400 font-mono">Across All Answered Questions</div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Total Points</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalScoreObtained} <span className="text-sm font-normal text-slate-400">pts</span></div>
          <div className="text-[11px] text-slate-400 font-mono">Out of {totalPossibleScore} Possible Points</div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Freelance Readiness</span>
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {completedCount > 0 ? 'Verified' : 'In Progress'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Marketplace Skill Badge</div>
        </div>
      </div>

      {/* 3. COLORFUL 3D PROGRESS TREE */}
      <StudentProgressTree phases={phases} progressMap={progressMap} />

      {/* 4. INSTRUCTOR FEEDBACK SECTION */}
      {feedbackList.length > 0 && (
        <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Instructor Reviews & Feedback ({feedbackList.length})
          </h3>
          <div className="space-y-3">
            {feedbackList.map((fb, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <div className="text-xs font-mono text-indigo-300 font-bold">From Instructor ({fb.adminId})</div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{fb.message}</p>
                <div className="text-[10px] font-mono text-slate-500">{new Date(fb.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
