import React, { useEffect, useState } from 'react';
import { apiService, CommunityItem, Proposal } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Lightbulb, 
  Briefcase, 
  AlertTriangle, 
  Plus, 
  ThumbsUp, 
  Search, 
  Mail, 
  X, 
  Send, 
  CheckCircle2, 
  Clock,
  DollarSign,
  Server,
  Zap,
  FileText,
  Eye,
  Check
} from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'idea' | 'freelance' | 'incident'>('all');
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal Form States
  const [formType, setFormType] = useState<'idea' | 'freelance' | 'incident'>('idea');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(user?.name || '');
  const [category, setCategory] = useState('Web Architecture');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [contactInfo, setContactInfo] = useState(user?.email || '');
  const [budget, setBudget] = useState('$1,000 - $3,000');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');

  // Proposal & Bidding States
  const [selectedGigForProposal, setSelectedGigForProposal] = useState<CommunityItem | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [bidAmount, setBidAmount] = useState('$2,500 USD');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // View Proposals Drawer State
  const [selectedGigForViewProposals, setSelectedGigForViewProposals] = useState<CommunityItem | null>(null);
  const [proposalsList, setProposalsList] = useState<Proposal[]>([]);

  // Server Warmup Loader State
  const [submitting, setSubmitting] = useState(false);
  const [warmupProgress, setWarmupProgress] = useState(15);
  const [warmupStage, setWarmupStage] = useState('Waking up server on Render cloud...');
  const [notification, setNotification] = useState<string | null>(null);

  async function fetchCommunityData() {
    setLoading(true);
    try {
      const data = await apiService.getCommunityItems(activeTab === 'all' ? undefined : activeTab);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCommunityData();
  }, [activeTab]);

  const handleUpvote = async (id: string) => {
    try {
      await apiService.upvoteCommunityItem(id);
      setItems(prev => prev.map(item => item._id === id ? { ...item, upvotes: item.upvotes + 1 } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiService.updateGigStatus(id, newStatus);
      setItems(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitProposalForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGigForProposal || !proposalText.trim()) return;

    setIsSubmittingProposal(true);
    try {
      await apiService.submitProposal(selectedGigForProposal._id, {
        freelancerName: user?.name || user?.email || 'Freelancer',
        freelancerEmail: user?.email || 'dev@freelance.io',
        proposalText,
        bidAmount
      });

      setSelectedGigForProposal(null);
      setProposalText('');
      setNotification('Proposal submitted successfully to the job poster!');
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleOpenProposalsDrawer = async (gig: CommunityItem) => {
    setSelectedGigForViewProposals(gig);
    try {
      const list = await apiService.getProposalsForGig(gig._id);
      setProposalsList(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !contactInfo.trim()) return;

    setSubmitting(true);
    setWarmupProgress(20);
    setWarmupStage('Spinning up backend container on Render...');

    const interval = setInterval(() => {
      setWarmupProgress(prev => {
        if (prev < 45) {
          setWarmupStage('Establishing SSL MongoDB Database connection...');
          return prev + 12;
        } else if (prev < 80) {
          setWarmupStage('Validating community post schema & security token...');
          return prev + 8;
        } else if (prev < 95) {
          setWarmupStage('Finalizing database write & updating feed...');
          return prev + 3;
        }
        return prev;
      });
    }, 900);

    try {
      const techStack = techStackInput.split(',').map(s => s.trim()).filter(Boolean);
      const created = await apiService.createCommunityItem({
        type: formType,
        title,
        author: author || 'Developer',
        category,
        description,
        techStack,
        contactInfo,
        budget: formType === 'freelance' ? budget : undefined,
        severity: formType === 'incident' ? severity : undefined,
      });

      clearInterval(interval);
      setWarmupProgress(100);
      setWarmupStage('Post Published Successfully!');

      setTimeout(() => {
        setItems(prev => [created, ...prev]);
        setIsModalOpen(false);
        setSubmitting(false);
        setTitle('');
        setDescription('');
        setTechStackInput('');
        setNotification('Submission posted successfully to the Community Hub!');
        setTimeout(() => setNotification(null), 4000);
      }, 600);

    } catch (err: any) {
      clearInterval(interval);
      setSubmitting(false);
      alert(err.message || 'Failed to submit post');
    }
  };

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.techStack.some(t => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Developer Ecosystem & Knowledge Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Developer <span className="gradient-text-indigo-cyan">Community Hub</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl font-light">
            Share tech ideas, hire freelance talent, submit project proposals, and report critical technical outages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Idea / Freelance / Incident</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-[#0F172A]/80 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Posts', icon: Users },
            { id: 'idea', label: 'Tech Ideas', icon: Lightbulb },
            { id: 'freelance', label: 'Freelance & Gigs', icon: Briefcase },
            { id: 'incident', label: 'Incident Watch', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, stack, ideas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium"
          />
        </div>
      </div>

      {/* Community Items List - Fluid 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="lg:col-span-3 glass-card rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300 font-heading">No community posts found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to submit a new tech proposal, project gig, or incident report!
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isIdea = item.type === 'idea';
            const isFreelance = item.type === 'freelance';
            const isIncident = item.type === 'incident';

            return (
              <div
                key={item._id}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase border ${
                        isIdea ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                        isFreelance ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {isIdea ? '💡 Tech Idea' : isFreelance ? '💼 Freelance Gig' : '🚨 Incident Report'}
                      </span>

                      {/* Milestone Status Picker for Gigs */}
                      {isFreelance && (
                        <select
                          value={item.status || 'Open'}
                          onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-white/10 text-cyan-300"
                        >
                          <option value="Open">Status: Open</option>
                          <option value="In-Progress">Status: In-Progress</option>
                          <option value="Delivered">Status: Delivered</option>
                          <option value="Closed">Status: Closed</option>
                        </select>
                      )}
                    </div>

                    {isIncident && item.severity && (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase ${
                        item.severity === 'Critical' ? 'bg-rose-600 text-white animate-pulse' :
                        item.severity === 'High' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        Severity: {item.severity}
                      </span>
                    )}

                    {isFreelance && item.budget && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {item.budget}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 font-heading leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  {item.techStack && item.techStack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 text-[11px] font-mono text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>By <strong className="text-slate-200">{item.author}</strong></span>
                    <button
                      onClick={() => handleUpvote(item._id)}
                      className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3 h-3 text-indigo-400" />
                      <span>{item.upvotes}</span>
                    </button>
                  </div>

                  {/* Freelance Bidding Action Buttons */}
                  {isFreelance && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedGigForProposal(item)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Submit Proposal</span>
                      </button>

                      <button
                        onClick={() => handleOpenProposalsDrawer(item)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1"
                        title="View Bids"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Bids</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 📝 SUBMIT PROPOSAL MODAL */}
      {selectedGigForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-500/40 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Freelance Proposal</span>
                <h3 className="text-lg font-bold text-white font-heading">{selectedGigForProposal.title}</h3>
              </div>
              <button onClick={() => setSelectedGigForProposal(null)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposalForm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Proposed Bid ($USD)</label>
                <input
                  type="text"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Proposal & Cover Letter</label>
                <textarea
                  required
                  rows={4}
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Describe your relevant experience, technical approach, and deliverables timeline..."
                  className="w-full p-3.5 rounded-xl glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProposal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Proposal & Rate</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 👁️ VIEW PROPOSALS DRAWER MODAL */}
      {selectedGigForViewProposals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-cyan-500/40 space-y-6 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Proposals & Bids Board</span>
                <h3 className="text-lg font-bold text-white font-heading">{selectedGigForViewProposals.title}</h3>
              </div>
              <button onClick={() => setSelectedGigForViewProposals(null)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {proposalsList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No proposals submitted for this gig yet.</div>
              ) : (
                proposalsList.map((p) => (
                  <div key={p._id} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <strong className="text-white">{p.freelancerName} ({p.freelancerEmail})</strong>
                      <span className="text-emerald-400 font-bold">{p.bidAmount}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{p.proposalText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] flex flex-col border border-indigo-500/30 relative overflow-hidden shadow-2xl my-auto">
            <div className="glow-point-indigo -top-20 -right-20 opacity-30" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Submit Post to Community
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">Submission Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'idea', label: '💡 Tech Idea', icon: Lightbulb },
                    { type: 'freelance', label: '💼 Freelance Gig', icon: Briefcase },
                    { type: 'incident', label: '🚨 Incident Watch', icon: AlertTriangle },
                  ].map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setFormType(t.type as any)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                        formType === t.type
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    formType === 'idea' ? 'e.g. AI-Powered Memory Leak Detector' :
                    formType === 'freelance' ? 'e.g. Senior Spring Boot Engineer Needed' :
                    'e.g. High Memory Spike in Spring Data JPA EAGER Queries'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Author Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name / Organization"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Contact Email / Handle</label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="email@domain.com or Discord"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              {formType === 'freelance' && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Budget / Reward Range</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. $2,000 - $3,500 USD"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              )}

              {formType === 'incident' && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value="Low">Low - Informational Warning</option>
                    <option value="Medium">Medium - Non-Blocking Issue</option>
                    <option value="High">High - Significant Impact</option>
                    <option value="Critical">Critical - Downtime / Security Risk</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. Java 21, Spring Boot, PostgreSQL, Docker"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">Description & Details</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about the idea, project deliverables, or incident workaround..."
                  className="w-full p-3 rounded-xl glass-input text-xs font-sans"
                />
              </div>

              <div className="pt-2 shrink-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Community Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER SERVER WARMUP FULLSCREEN LOADER SCREEN */}
      {submitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full border border-indigo-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="glow-point-indigo -top-20 -right-20 opacity-40" />

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
              <Server className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-mono">
                <Zap className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Render Cloud Server Initialization</span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                Connecting to Render Cloud...
              </h3>
              <p className="text-xs text-slate-300 font-mono transition-all">
                {warmupStage}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 shadow-neon-indigo"
                  style={{ width: `${warmupProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Warming up free cloud instance</span>
                <span className="text-cyan-400 font-bold">{warmupProgress}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] text-slate-400 leading-relaxed font-mono text-left space-y-1">
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Render Cold Start Note:
              </div>
              <p className="text-[10.5px]">
                Free tier Render web services spin down after inactivity. Cold boots take ~15-20 seconds to initialize MongoDB SSL connections. Thank you for your patience!
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
