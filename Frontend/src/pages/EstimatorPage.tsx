import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Send,
  Zap
} from 'lucide-react';
import { apiService } from '@/services/api';

export default function EstimatorPage() {
  const navigate = useNavigate();
  const [projectType, setProjectType] = useState<'fullstack' | 'backend' | 'frontend' | 'security'>('fullstack');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'auth', 'database', 'rest_api', 'dashboard'
  ]);
  const [urgency, setUrgency] = useState<'standard' | 'expedited' | 'rush'>('standard');
  const [teamSize, setTeamSize] = useState<number>(1);
  const [isPosting, setIsPosting] = useState(false);

  const modulesList = [
    { id: 'auth', label: 'OAuth2 & JWT Authentication', hours: 15, cost: 450 },
    { id: 'database', label: 'Database ORM & Migrations (JPA/Mongoose)', hours: 20, cost: 600 },
    { id: 'rest_api', label: 'RESTful API Controllers & Validation', hours: 25, cost: 750 },
    { id: 'dashboard', label: 'Admin & Analytics Dashboard UI', hours: 30, cost: 900 },
    { id: 'payments', label: 'Stripe / Payment Gateway Integration', hours: 18, cost: 550 },
    { id: 'websockets', label: 'Real-Time WebSockets & Notifications', hours: 22, cost: 650 },
    { id: 'threejs', label: '3D WebGL Canvas / Framer Motion Animations', hours: 25, cost: 800 },
    { id: 'ci_cd', label: 'Docker Containerization & CI/CD Deployment', hours: 12, cost: 400 },
  ];

  const toggleModule = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Calculations
  const baseHours = projectType === 'fullstack' ? 40 : projectType === 'backend' ? 30 : projectType === 'frontend' ? 25 : 20;
  const moduleHours = selectedModules.reduce((acc, mId) => {
    const found = modulesList.find(m => m.id === mId);
    return acc + (found ? found.hours : 0);
  }, 0);

  const totalHours = Math.round((baseHours + moduleHours) * (urgency === 'rush' ? 1.25 : urgency === 'expedited' ? 1.1 : 1));
  const hourlyRate = 45; // $45/hr average
  const totalCost = totalHours * hourlyRate;
  const estimatedWeeks = Math.max(1, Math.round((totalHours / (30 * teamSize)) * 10) / 10);

  const handlePostToGigBoard = async () => {
    setIsPosting(true);
    try {
      const typeLabel = projectType === 'fullstack' ? 'Fullstack App' : projectType === 'backend' ? 'Backend API' : 'Frontend UI';
      await apiService.createCommunityItem({
        type: 'freelance',
        title: `${typeLabel} Contract (${estimatedWeeks} Weeks Deliverable)`,
        author: 'Agency Client',
        category: 'Client Gig',
        description: `Project Scope includes: ${selectedModules.map(m => modulesList.find(x => x.id === m)?.label).join(', ')}. Estimated duration: ${estimatedWeeks} weeks.`,
        techStack: ['Java 21', 'Spring Boot', 'React', 'TypeScript'],
        contactInfo: 'client.gigs@agency.io',
        budget: `$${(totalCost * 0.9).toLocaleString()} - $${(totalCost * 1.15).toLocaleString()} USD`,
      });

      alert('Project Scope posted to Community Freelance Board!');
      navigate('/community');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span>Agency & Client Scope Calculator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
          Project Cost & <span className="gradient-text-indigo-cyan">Timeline Estimator</span>
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Select your project deliverables to calculate instant development hours, budget ranges, and publish directly to our Community Freelance Board.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scope Configurator */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Project Type */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-slate-300">
              1. Select Project Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'fullstack', label: 'Fullstack Web Application' },
                { id: 'backend', label: 'Backend Microservices API' },
                { id: 'frontend', label: 'Frontend React/Vite UI' },
                { id: 'security', label: 'Security & Code Audit' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setProjectType(t.id as any)}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                    projectType === t.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Modules Selection */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-slate-300">
              2. Select Feature Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modulesList.map((m) => {
                const isSelected = selectedModules.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleModule(m.id)}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-500/20 border-cyan-400 text-white shadow-sm'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[10px] font-mono text-slate-400">+{m.hours} hrs</div>
                    </div>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-slate-300">
              3. Development Urgency
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'standard', label: 'Standard Pace' },
                { id: 'expedited', label: 'Expedited (+10%)' },
                { id: 'rush', label: 'Rush MVP (+25%)' },
              ].map((u) => (
                <button
                  key={u.id}
                  onClick={() => setUrgency(u.id as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                    urgency === u.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Estimate Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-8 border border-indigo-500/40 shadow-2xl relative overflow-hidden space-y-6 bg-gradient-to-b from-indigo-500/10 via-slate-900 to-slate-950">
            <div className="glow-point-indigo -top-20 -right-20 opacity-30" />

            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Estimated Project Summary</span>
              <h2 className="text-2xl font-extrabold text-white font-heading mt-1">Scope Calculation</h2>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <Clock className="w-5 h-5 text-indigo-400 mx-auto" />
                <div className="text-2xl font-extrabold text-white font-mono">{totalHours} <span className="text-xs font-normal text-slate-400">hrs</span></div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Total Dev Time</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
                <div className="text-2xl font-extrabold text-white font-mono">{estimatedWeeks} <span className="text-xs font-normal text-slate-400">wks</span></div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Duration</div>
              </div>
            </div>

            {/* Total Estimated Cost */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600/30 via-slate-900 to-cyan-500/30 border border-cyan-400/40 text-center space-y-1">
              <div className="text-xs font-mono text-slate-300 uppercase">Estimated Budget Range</div>
              <div className="text-3xl font-extrabold text-white font-mono gradient-text-indigo-cyan">
                ${(totalCost * 0.9).toLocaleString()} - ${(totalCost * 1.15).toLocaleString()} <span className="text-xs text-slate-300 font-normal">USD</span>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handlePostToGigBoard}
              disabled={isPosting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2"
            >
              {isPosting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Scope to Community Gig Board</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
