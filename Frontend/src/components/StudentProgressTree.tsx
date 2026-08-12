import React, { useState } from 'react';
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
  Layers,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentProgressTreeProps {
  phases: Phase[];
  progressMap: Record<string, StudentProgress>;
}

export default function StudentProgressTree({ phases, progressMap }: StudentProgressTreeProps) {
  const navigate = useNavigate();
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

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

  // Colors for branches
  const branchColors = [
    { main: '#10B981', gradient: 'from-emerald-500 to-teal-400', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.5)]', border: 'border-emerald-400/60' },
    { main: '#06B6D4', gradient: 'from-cyan-500 to-blue-400', glow: 'shadow-[0_0_25px_rgba(6,182,212,0.5)]', border: 'border-cyan-400/60' },
    { main: '#A855F7', gradient: 'from-purple-500 to-fuchsia-400', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]', border: 'border-purple-400/60' },
    { main: '#F59E0B', gradient: 'from-amber-500 to-orange-400', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]', border: 'border-amber-400/60' },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#080C14] via-[#0B132B] to-[#04070D] space-y-10">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Bioluminescent Avatar Tree of Wisdom</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Knowledge <span className="gradient-text-indigo-cyan">Growth Plant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-light leading-relaxed">
            Your technical mastery empowers this bioluminescent cyber plant. Each quiz passed causes vibrant neon leaves and fruits of wisdom to blossom!
          </p>
        </div>

        {/* Tree Mastery Card */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-white/15 shadow-xl shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-extrabold text-white text-xs">
              {completionPercentage}%
            </span>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">Plant Growth State</div>
            <div className="text-base font-bold text-white font-heading">
              {completedCount === totalPhasesCount ? '🌲 Ancient Wisdom Tree (100%)' :
               completedCount > 0 ? `🌿 Glowing Sapling (${completedCount}/${totalPhasesCount} Bloomed)` :
               '🌱 Embryonic Sprout (0/4 Bloomed)'}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 fill-emerald-400" /> Average Accuracy: {averagePercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* 🌲 THE BIOLUMINESCENT PLANT GRAPHIC & BRANCH CARDS */}
      <div className="relative rounded-3xl bg-[#02050D]/90 border border-white/10 p-6 sm:p-10 space-y-12 overflow-hidden shadow-inner">
        
        {/* SVG ARTWORK: Bioluminescent Plant Trunk & Roots */}
        <div className="w-full h-72 sm:h-96 relative flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full max-w-2xl" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Trunk Gradient */}
              <linearGradient id="trunkGlow" x1="300" y1="400" x2="300" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              {/* Glowing Branch Gradients */}
              <linearGradient id="branchJava" x1="300" y1="280" x2="100" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="branchJvm" x1="300" y1="230" x2="500" y2="190" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="branchSpring" x1="300" y1="170" x2="120" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
              <linearGradient id="branchSecurity" x1="300" y1="120" x2="480" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Glowing Soil Bed / Roots */}
            <ellipse cx="300" cy="380" rx="180" ry="15" fill="url(#trunkGlow)" opacity="0.25" />
            <path d="M 220 380 Q 260 365 300 370 Q 340 365 380 380" stroke="#06B6D4" strokeWidth="3" opacity="0.6" fill="none" />
            <path d="M 250 390 Q 280 375 300 380 Q 320 375 350 390" stroke="#10B981" strokeWidth="2" opacity="0.5" fill="none" />

            {/* Main Central Trunk */}
            <path
              d="M 300 380 Q 295 280 300 180 Q 305 100 300 40"
              stroke="url(#trunkGlow)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            />
            <path
              d="M 300 380 Q 295 280 300 180 Q 305 100 300 40"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="10 20"
              fill="none"
              opacity="0.8"
              className="animate-pulse"
            />

            {/* Branch 1: Java Core (Bottom Left) */}
            <path
              d="M 300 300 C 230 290 160 270 100 240"
              stroke="url(#branchJava)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            />
            {/* Leaves & Blossoms B1 */}
            <circle cx="100" cy="240" r="14" fill="#10B981" className="animate-ping opacity-30" />
            <circle cx="100" cy="240" r="10" fill="#10B981" />
            <path d="M 100 240 C 80 230 70 250 100 240" fill="#34D399" opacity="0.9" />

            {/* Branch 2: JVM Memory (Bottom Right) */}
            <path
              d="M 300 240 C 370 230 430 210 500 190"
              stroke="url(#branchJvm)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            />
            {/* Leaves & Blossoms B2 */}
            <circle cx="500" cy="190" r="14" fill="#06B6D4" className="animate-ping opacity-30" />
            <circle cx="500" cy="190" r="10" fill="#06B6D4" />
            <path d="M 500 190 C 520 180 530 200 500 190" fill="#38BDF8" opacity="0.9" />

            {/* Branch 3: Spring Boot (Top Left) */}
            <path
              d="M 300 170 C 230 150 170 120 120 90"
              stroke="url(#branchSpring)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            />
            {/* Leaves & Blossoms B3 */}
            <circle cx="120" cy="90" r="14" fill="#A855F7" className="animate-ping opacity-30" />
            <circle cx="120" cy="90" r="10" fill="#A855F7" />

            {/* Branch 4: Spring Security (Top Right) */}
            <path
              d="M 300 110 C 370 90 420 70 480 40"
              stroke="url(#branchSecurity)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            />
            {/* Leaves & Blossoms B4 */}
            <circle cx="480" cy="40" r="14" fill="#F59E0B" className="animate-ping opacity-30" />
            <circle cx="480" cy="40" r="10" fill="#F59E0B" />

            {/* Crown Apex Flower */}
            <circle cx="300" cy="35" r="16" fill="#F43F5E" className="animate-pulse opacity-50" />
            <circle cx="300" cy="35" r="10" fill="#F43F5E" />
          </svg>

          {/* Floating Fireflies Animation Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-bounce blur-[1px]" style={{ animationDuration: '3s' }} />
            <div className="absolute top-24 right-1/4 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping blur-[1px]" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-purple-400 animate-pulse blur-[1px]" />
            <div className="absolute top-8 right-1/3 w-3 h-3 rounded-full bg-amber-400 animate-bounce blur-[1px]" style={{ animationDuration: '2.5s' }} />
          </div>
        </div>

        {/* 🌿 BRANCH NODE CARDS DISPLAY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {defaultPhases.map((phase, idx) => {
            const prog = progressMap[phase._id] || progressMap[phase.name];
            const isAttempted = prog && prog.score !== undefined;
            const score = prog?.score || 0;
            const total = prog?.totalScore || prog?.totalQuestions || 3;
            const isPassed = isAttempted && (score / total >= 0.5);
            const style = branchColors[idx % branchColors.length];

            return (
              <div
                key={phase._id}
                onMouseEnter={() => setActiveHoverNode(phase._id)}
                onMouseLeave={() => setActiveHoverNode(null)}
                className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isPassed
                    ? `bg-slate-900/90 ${style.border} ${style.glow}`
                    : isAttempted
                    ? 'bg-slate-900/70 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-950/80 border-white/10 opacity-80 hover:opacity-100 hover:border-white/30'
                }`}
              >
                {/* Top Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full animate-ping"
                      style={{ backgroundColor: style.main }}
                    />
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase text-white shadow-sm"
                      style={{ backgroundColor: style.main }}
                    >
                      Branch 0{idx + 1}
                    </span>
                  </div>

                  {isPassed ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✓ Blooming Fruit</span>
                    </span>
                  ) : isAttempted ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Attempted ({Math.round((score / total) * 100)}%)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono text-slate-400 bg-slate-800 border border-white/10 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Dormant Seed</span>
                    </span>
                  )}
                </div>

                {/* Phase Title */}
                <div>
                  <h3 className="text-lg font-extrabold text-white font-heading leading-snug">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-light">
                    {isPassed
                      ? `Passed with ${score} / ${total} points (${Math.round((score / total) * 100)}%). Branch fully energized!`
                      : isAttempted
                      ? `Attempted with ${score} / ${total} points. Retake to unlock full blossom.`
                      : 'Attempt the quiz assessment to sprout this branch on your progress plant.'}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-slate-400">
                    Status: <strong className="text-slate-200">{isPassed ? 'Bloomed' : isAttempted ? 'Sprouting' : 'Locked'}</strong>
                  </div>

                  <button
                    onClick={() => navigate(`/quiz/${phase._id}`)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                      isPassed
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-neon-indigo hover:shadow-neon-cyan'
                        : isAttempted
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-neon-indigo'
                    }`}
                  >
                    <span>{isPassed ? 'Retake Quiz' : isAttempted ? 'Retry Quiz' : '⚡ Sprout Branch'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
