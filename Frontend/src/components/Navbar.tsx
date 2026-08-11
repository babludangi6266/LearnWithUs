import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  BookOpen, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Code2, 
  Users,
  Calculator,
  Wrench,
  Menu,
  X
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Sparkles },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scope Estimator', href: '/estimator', icon: Calculator },
    { name: 'Schema Generator', href: '/generator', icon: Wrench },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Notes Hub', href: '/notes', icon: BookOpen },
    { name: 'Admin Portal', href: '/admin/dashboard', icon: ShieldCheck, adminOnly: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-md">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-400 to-emerald-500 p-[1px] shadow-neon-indigo transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#080C14] rounded-[11px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1 font-heading">
                Learn<span className="gradient-text-indigo-cyan">WithUs</span>
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">
                EdTech Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0F172A]/70 p-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              if (link.adminOnly && user?.role !== 'admin') {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-cyan-400/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-mono">
                  <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="text-slate-200 font-sans font-medium">{user.name || user.email}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    user.role === 'admin' ? 'bg-indigo-500/30 text-indigo-300' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-white/5"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:shadow-neon-indigo transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </button>
                <Link
                  to="/admin/login"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 space-y-2 bg-[#080C14]/95 border-b border-white/10 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              if (link.adminOnly && user?.role !== 'admin') return null;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <Icon className="w-5 h-5 text-cyan-400" />
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout ({user.name || user.email})
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-white/5 text-slate-200 text-sm font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { openAuth('register'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-bold"
                  >
                    Sign Up
                  </button>
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold"
                  >
                    Admin Portal Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
