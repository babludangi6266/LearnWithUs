import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Phase, CommunityItem } from '@/services/api';
import SkillTree3D from '@/components/SkillTree3D';
import GlobalLearnerGlobe from '@/components/GlobalLearnerGlobe';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Users, 
  Zap, 
  Trophy,
  Briefcase,
  Lightbulb,
  AlertTriangle,
  Building2,
  ThumbsUp,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'freelance' | 'ideas' | 'quiz' | 'incidents'>('freelance');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const fetchedPhases = await apiService.getPhases();
        setPhases(fetchedPhases);

        const fetchedCommunity = await apiService.getCommunityItems();
        setCommunityItems(fetchedCommunity);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-28 pb-24 w-full">
      
      {/* 1. HERO SECTION - FULL WIDTH SPAN */}
      <section className="relative pt-16 pb-12 overflow-hidden w-full">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center relative z-10 space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-mono tracking-wide animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Developer Ecosystem • Community Hub • Freelance Accelerator</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white tracking-tight leading-[1.1] max-w-7xl mx-auto font-heading">
            Empowering Developers, Freelancers &{' '}
            <span className="gradient-text-indigo-cyan">Small Agencies to Build & Scale</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-4xl mx-auto font-light leading-relaxed">
            From mastering high-performance backend architecture to posting freelance project gigs, submitting startup ideas, and monitoring critical tech incidents — all in one unified ecosystem.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/community"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-neon-indigo hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Join Developer Community</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/notes"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-slate-200 hover:text-white font-bold text-sm hover:border-cyan-400/40 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Explore Tech Notes Hub</span>
            </Link>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl mx-auto pt-8">
            {[
              { label: 'Community Developers', value: '12,500+', icon: Users },
              { label: 'Freelance Gigs Posted', value: '$450K+', icon: Briefcase },
              { label: 'Tech Ideas Shared', value: '350+', icon: Lightbulb },
              { label: 'Learning Curriculum', value: '100% Free', icon: Trophy },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 text-center space-y-2">
                  <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="text-3xl font-extrabold text-white font-mono">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. WOW FACTOR SHOWCASE: 3D SKILL TREE & GLOBAL LEARNER GLOBE */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 3D Engine Visualization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            Experience <span className="gradient-text-indigo-cyan">Next-Gen Learning Telemetry</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkillTree3D phases={phases} />
          <GlobalLearnerGlobe />
        </div>
      </section>

      {/* 3. FREELANCERS & AGENCIES ACCELERATION GRID */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Building2 className="w-3.5 h-3.5" />
            <span>Built for Independent Engineers & Small Agencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            Accelerate Your <span className="gradient-text-indigo-cyan">Projects & Tech Talent</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto font-light">
            Whether you are a freelance developer scaling client projects or a small agency looking for specialized backend skills, our platform provides instant tools and talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-white/10 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">Freelance Gigs & Hiring</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Post client contract deliverables, set custom budgets, and hire vetted Java, Spring Boot, React, and Fullstack freelancers.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link to="/community" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <span>Browse Freelance Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-white/10 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">Tech Ideas & Startups</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Submit architectural proposals, crowdsource upvotes from fellow engineers, and partner with co-founders for your MVP.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link to="/community" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>Submit Your Idea</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-white/10 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">Incident & Security Watch</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Track real-time tech stack outages, ORM memory leak alerts, and security patch workarounds before they impact production.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link to="/community" className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1">
                <span>View Incident Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE COMMUNITY PREVIEW FEED */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Live Community <span className="gradient-text-indigo-cyan">Discussions & Opportunities</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
              Active freelance contracts, startup ideas, and security notices submitted by developers.
            </p>
          </div>
          <Link
            to="/community"
            className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5 self-start"
          >
            <span>View All Posts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityItems.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.type === 'idea' ? '💡 Idea' : item.type === 'freelance' ? '💼 Gig' : '🚨 Incident'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{item.category}</span>
                </div>
                <h4 className="text-base font-bold text-white font-heading line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">By {item.author}</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {item.upvotes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
