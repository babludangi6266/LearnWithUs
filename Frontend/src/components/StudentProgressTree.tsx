import React from 'react';
import { Phase, StudentProgress } from '@/services/api';
import { 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Trophy, 
  Zap, 
  ArrowRight, 
  Flame, 
  Award,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentProgressTreeProps {
  phases: Phase[];
  progressMap: Record<string, StudentProgress>;
}

export default function StudentProgressTree({ phases, progressMap }: StudentProgressTreeProps) {
  const navigate = useNavigate();

  const defaultPhases = phases.length > 0 ? phases : [
    { _id: 'p1', name: 'Phase 1: Java Core & Fundamentals' },
    { _id: 'p2', name: 'Phase 2: JVM Memory Model & Garbage Collection' },
    { _id: 'p3', name: 'Phase 3: Spring Boot Microservices & Data JPA' },
    { _id: 'p4', name: 'Phase 4: Spring Security, JWT & OAuth2 Filters' }
  ];

  const totalPhasesCount = defaultPhases.length;
  let completedCount = 0;
  let totalScoreObtained = 0;
  let totalPossibleScore = 0;

  defaultPhases.forEach((phase) => {
    const prog = progressMap[phase._id] || progressMap[phase.name];
    if (prog) {
      if (prog.score !== undefined) {
        completedCount += 1;
        totalScoreObtained += prog.score;
        totalPossibleScore += (prog.totalScore || prog.totalQuestions || 3);
      }
    }
  });

  const completionPercentage = totalPhasesCount > 0 ? Math.round((completedCount / totalPhasesCount) * 100) : 0;
  const averagePercentage = totalPossibleScore > 0 ? Math.round((totalScoreObtained / totalPossibleScore) * 100) : 0;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#080C14] via-[#0D1527] to-[#04070D] space-y-8">
      <div className="glow-point-indigo -top-20 -right-20 opacity-40" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Interactive Skill & Progress Tree</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Student <span className="gradient-text-indigo-cyan">Knowledge Growth Tree</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Watch your tech tree bloom with vibrant neon energy as you attempt and master learning phases.
          </p>
        </div>

        {/* Tree Vitality Badge */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-3.5 rounded-2xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#080C14] rounded-[11px] flex items-center justify-center font-mono font-extrabold text-emerald-400 text-lg">
              {completionPercentage}%
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase font-bold">Tree Vitality</div>
            <div className="text-sm font-bold text-white font-heading">
              {completedCount} of {totalPhasesCount} Branches Bloomed
            </div>
          </div>
        </div>
      </div>

      {/* VIBRANT VISUAL TREE GRAPHIC */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-[#02050A] border border-white/10 overflow-hidden space-y-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Tree Nodes Vertical / Diagonal Pathway */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {defaultPhases.map((phase, idx) => {
            const prog = progressMap[phase._id] || progressMap[phase.name];
            const isAttempted = prog && prog.score !== undefined;
            const score = prog?.score || 0;
            const total = prog?.totalScore || prog?.totalQuestions || 3;
            const isPassed = isAttempted && (score / total >= 0.5);

            // Alternating branch alignment for organic tree structure
            const isEven = idx % 2 === 0;

            return (
              <div key={phase._id} className="relative group">
                
                {/* Connecting Laser Beam Line between Nodes */}
                {idx < defaultPhases.length - 1 && (
                  <div 
                    className={`absolute left-1/2 top-12 bottom-0 w-1 -translate-x-1/2 z-0 transition-colors duration-500 ${
                      isPassed ? 'bg-gradient-to-b from-emerald-400 via-cyan-400 to-indigo-500 shadow-neon-cyan' : 'bg-slate-800'
                    }`}
                  />
                )}

                <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border transition-all duration-300 relative z-10 ${
                  isPassed
                    ? 'bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 border-emerald-400/50 shadow-neon-indigo'
                    : isAttempted
                    ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/40'
                    : 'bg-slate-950/80 border-white/5 opacity-75 hover:opacity-100 hover:border-white/20'
                }`}>
                  
                  {/* Left Node Badge */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 ${
                      isPassed
                        ? 'bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 border-emerald-300 shadow-neon-cyan'
                        : isAttempted
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-500 border-white/10'
                    }`}>
                      {isPassed ? (
                        <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                      ) : isAttempted ? (
                        <Flame className="w-7 h-7" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Branch 0{idx + 1}
                        </span>
                        {isPassed && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ Mastered Node
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white font-heading">{phase.name}</h3>

                      <p className="text-xs text-slate-400 font-light">
                        {isPassed
                          ? `Passed with ${score} / ${total} correct answers (${Math.round((score / total) * 100)}%)`
                          : isAttempted
                          ? `Attempted: ${score} / ${total} correct answers (${Math.round((score / total) * 100)}%)`
                          : 'Node locked until attempted'}
                      </p>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <button
                    onClick={() => navigate(`/quiz/${phase._id}`)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                      isPassed
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : isAttempted
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-neon-indigo'
                    }`}
                  >
                    <span>{isPassed ? 'Retake Quiz' : isAttempted ? 'Retry Assessment' : 'Attempt Branch'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
