import React, { useState } from 'react';
import { Phase, StudentProgress } from '@/services/api';
import { 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Zap, 
  ChevronRight, 
  Award,
  Star,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LiveAnimated2DTreeProps {
  phases: Phase[];
  progressMap: Record<string, StudentProgress>;
}

export default function LiveAnimated2DTree({ phases, progressMap }: LiveAnimated2DTreeProps) {
  const navigate = useNavigate();
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

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

  const branchStyles = [
    { 
      name: 'Java Core', 
      color: '#10B981', 
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]', 
      border: 'border-emerald-400', 
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-400' 
    },
    { 
      name: 'JVM Memory', 
      color: '#06B6D4', 
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]', 
      border: 'border-cyan-400', 
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-400' 
    },
    { 
      name: 'Spring Boot', 
      color: '#A855F7', 
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]', 
      border: 'border-purple-400', 
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-fuchsia-400' 
    },
    { 
      name: 'Spring Security', 
      color: '#F59E0B', 
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]', 
      border: 'border-amber-400', 
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-400' 
    },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#030712] via-[#091124] to-[#02040A] border border-cyan-500/40 p-6 sm:p-10 space-y-10 overflow-hidden shadow-2xl">
      
      {/* CSS Keyframe Animations for Energy Flow & Gentle Sway */}
      <style>{`
        @keyframes energyFlow {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes gentleSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.8deg); }
        }
        @keyframes floatPollen {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
          50% { transform: translateY(-25px) scale(1.2); opacity: 0.9; }
          100% { transform: translateY(-50px) scale(0.8); opacity: 0; }
        }
        .animate-energy-flow {
          stroke-dasharray: 8 12;
          animation: energyFlow 2s linear infinite;
        }
        .animate-sway {
          transform-origin: bottom center;
          animation: gentleSway 6s ease-in-out infinite;
        }
        .animate-pollen {
          animation: floatPollen 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Live Animated Progress Tree</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Live <span className="gradient-text-indigo-cyan">Bioluminescent Tech Tree</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Watch energy flow through the roots & branches. As you complete phase quizzes, glowing fruits & flowers bloom live!
          </p>
        </div>

        {/* Tree Growth Badge */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-white/15 shadow-xl shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 p-[2px] shadow-neon-cyan">
            <div className="w-full h-full bg-[#080C14] rounded-[14px] flex items-center justify-center font-mono font-extrabold text-emerald-400 text-base">
              {completionPercentage}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Vitality Index</div>
            <div className="text-sm font-bold text-white font-heading">
              {completedCount} of {totalPhasesCount} Branches Bloomed
            </div>
          </div>
        </div>
      </div>

      {/* 🌳 MAIN LIVE SVG ANIMATED TREE ARTWORK */}
      <div className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center rounded-3xl bg-[#02050E]/80 border border-white/10 overflow-hidden shadow-inner">
        
        {/* Floating Pollen Light Particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute bottom-16 left-1/3 w-3 h-3 rounded-full bg-emerald-400 animate-pollen" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-24 right-1/3 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pollen" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-3.5 h-3.5 rounded-full bg-purple-400 animate-pollen" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-1/4 w-3 h-3 rounded-full bg-amber-400 animate-pollen" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-40 left-1/2 w-2 h-2 rounded-full bg-emerald-300 animate-pollen" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* SVG Live Plant Tree */}
        <svg className="w-full h-full max-w-3xl animate-sway relative z-10" viewBox="0 0 700 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Trunk Gradient */}
            <linearGradient id="liveTrunkGlow" x1="350" y1="500" x2="350" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="40%" stopColor="#06B6D4" />
              <stop offset="75%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Glowing Branch Colors */}
            <linearGradient id="gradB1" x1="350" y1="360" x2="120" y2="300"><stop offset="0%" stopColor="#06B6D4" /><stop offset="100%" stopColor="#10B981" /></linearGradient>
            <linearGradient id="gradB2" x1="350" y1="280" x2="580" y2="230"><stop offset="0%" stopColor="#4F46E5" /><stop offset="100%" stopColor="#06B6D4" /></linearGradient>
            <linearGradient id="gradB3" x1="350" y1="200" x2="150" y2="120"><stop offset="0%" stopColor="#06B6D4" /><stop offset="100%" stopColor="#A855F7" /></linearGradient>
            <linearGradient id="gradB4" x1="350" y1="130" x2="550" y2="60"><stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#F59E0B" /></linearGradient>
          </defs>

          {/* 1. Neon Roots Base */}
          <ellipse cx="350" cy="470" rx="220" ry="18" fill="url(#liveTrunkGlow)" opacity="0.2" />
          <path d="M 240 470 Q 295 450 350 455 Q 405 450 460 470" stroke="#06B6D4" strokeWidth="4" opacity="0.7" fill="none" />
          <path d="M 280 480 Q 315 465 350 470 Q 385 465 420 480" stroke="#10B981" strokeWidth="3" opacity="0.5" fill="none" />

          {/* 2. Main Trunk Body */}
          <path
            d="M 350 470 Q 342 340 350 220 Q 358 120 350 40"
            stroke="url(#liveTrunkGlow)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            className="drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]"
          />

          {/* 3. Animated Energy Pulse Vein flowing UPWARD */}
          <path
            d="M 350 470 Q 342 340 350 220 Q 358 120 350 40"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="animate-energy-flow opacity-90"
          />

          {/* 🌿 BRANCH 1: Java Core (Bottom Left) */}
          <g onClick={() => setActiveBranchId(defaultPhases[0]?._id)} className="cursor-pointer group">
            <path
              d="M 350 370 C 260 360 180 330 120 300"
              stroke="url(#gradB1)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all group-hover:stroke-width-12"
            />
            {/* Leaves */}
            <path d="M 120 300 C 90 280 80 320 120 300" fill="#10B981" />
            <path d="M 120 300 C 130 270 150 280 120 300" fill="#34D399" />
            {/* Glowing Fruit Orb B1 */}
            <circle cx="120" cy="300" r="18" fill="#10B981" className="animate-pulse opacity-40" />
            <circle cx="120" cy="300" r="12" fill="#10B981" className="drop-shadow-[0_0_15px_#10B981]" />
            <circle cx="120" cy="300" r="6" fill="#FFFFFF" />
          </g>

          {/* 🌿 BRANCH 2: JVM Memory (Bottom Right) */}
          <g onClick={() => setActiveBranchId(defaultPhases[1]?._id)} className="cursor-pointer group">
            <path
              d="M 350 290 C 430 280 500 250 580 230"
              stroke="url(#gradB2)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all group-hover:stroke-width-12"
            />
            {/* Leaves */}
            <path d="M 580 230 C 610 210 620 250 580 230" fill="#06B6D4" />
            <path d="M 580 230 C 570 200 550 210 580 230" fill="#38BDF8" />
            {/* Glowing Fruit Orb B2 */}
            <circle cx="580" cy="230" r="18" fill="#06B6D4" className="animate-pulse opacity-40" />
            <circle cx="580" cy="230" r="12" fill="#06B6D4" className="drop-shadow-[0_0_15px_#06B6D4]" />
            <circle cx="580" cy="230" r="6" fill="#FFFFFF" />
          </g>

          {/* 🌿 BRANCH 3: Spring Boot (Top Left) */}
          <g onClick={() => setActiveBranchId(defaultPhases[2]?._id)} className="cursor-pointer group">
            <path
              d="M 350 200 C 270 180 200 150 150 120"
              stroke="url(#gradB3)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all group-hover:stroke-width-12"
            />
            {/* Leaves */}
            <path d="M 150 120 C 120 100 110 140 150 120" fill="#A855F7" />
            <path d="M 150 120 C 160 90 180 100 150 120" fill="#C084FC" />
            {/* Glowing Fruit Orb B3 */}
            <circle cx="150" cy="120" r="18" fill="#A855F7" className="animate-pulse opacity-40" />
            <circle cx="150" cy="120" r="12" fill="#A855F7" className="drop-shadow-[0_0_15px_#A855F7]" />
            <circle cx="150" cy="120" r="6" fill="#FFFFFF" />
          </g>

          {/* 🌿 BRANCH 4: Spring Security (Top Right) */}
          <g onClick={() => setActiveBranchId(defaultPhases[3]?._id)} className="cursor-pointer group">
            <path
              d="M 350 130 C 420 110 490 80 550 60"
              stroke="url(#gradB4)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all group-hover:stroke-width-12"
            />
            {/* Leaves */}
            <path d="M 550 60 C 580 40 590 80 550 60" fill="#F59E0B" />
            <path d="M 550 60 C 540 30 520 40 550 60" fill="#FBBF24" />
            {/* Glowing Fruit Orb B4 */}
            <circle cx="550" cy="60" r="18" fill="#F59E0B" className="animate-pulse opacity-40" />
            <circle cx="550" cy="60" r="12" fill="#F59E0B" className="drop-shadow-[0_0_15px_#F59E0B]" />
            <circle cx="550" cy="60" r="6" fill="#FFFFFF" />
          </g>

          {/* Apex Golden Crown Lotus Blossom */}
          <circle cx="350" cy="35" r="22" fill="#F43F5E" className="animate-pulse opacity-40" />
          <circle cx="350" cy="35" r="14" fill="#F43F5E" className="drop-shadow-[0_0_20px_#F43F5E]" />
          <circle cx="350" cy="35" r="7" fill="#FFFFFF" />
        </svg>

      </div>

      {/* 🎨 COLORFUL INTERACTIVE BRANCH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {defaultPhases.map((phase, idx) => {
          const prog = progressMap[phase._id] || progressMap[phase.name];
          const isAttempted = prog && prog.score !== undefined;
          const score = prog?.score || 0;
          const total = prog?.totalScore || prog?.totalQuestions || 3;
          const isPassed = isAttempted && (score / total >= 0.5);
          const style = branchStyles[idx % branchStyles.length];

          return (
            <div
              key={phase._id}
              onClick={() => setActiveBranchId(phase._id)}
              className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4 cursor-pointer group ${
                isPassed
                  ? `${style.bg} ${style.border} ${style.glow}`
                  : isAttempted
                  ? 'bg-slate-900/80 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-950/80 border-white/10 hover:border-white/30'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${style.gradient} animate-ping`} />
                  <span className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold uppercase bg-slate-950 ${style.text} border ${style.border}`}>
                    Branch 0{idx + 1} • {style.name}
                  </span>
                </div>

                {isPassed ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Bloomed ({score}/{total})</span>
                  </span>
                ) : isAttempted ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Attempted ({score}/{total})</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono text-slate-400 bg-slate-900 border border-white/10 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Dormant</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading leading-snug group-hover:text-cyan-300 transition-colors">
                  {phase.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">
                  {isPassed
                    ? `Passed with ${score} / ${total} points (${Math.round((score / total) * 100)}%). Glowing foliage active!`
                    : isAttempted
                    ? `Attempted: ${score} / ${total} points. Retake to achieve full blooming status.`
                    : 'Attempt the quiz assessment to sprout this branch on your living tech tree.'}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  State: <strong className={style.text}>{isPassed ? 'Bloomed' : isAttempted ? 'Sprouting' : 'Locked'}</strong>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quiz/${phase._id}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                    isPassed
                      ? `bg-gradient-to-r ${style.gradient} text-white shadow-neon-indigo hover:shadow-neon-cyan`
                      : isAttempted
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-neon-indigo'
                  }`}
                >
                  <span>{isPassed ? 'Retake Quiz' : isAttempted ? 'Retry Quiz' : '⚡ Sprout Branch'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
