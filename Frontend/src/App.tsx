import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ThreeBackground from '@/components/ThreeBackground';

import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import QuizPage from '@/pages/QuizPage';
import NotesPage from '@/pages/NotesPage';
import CommunityPage from '@/pages/CommunityPage';
import EstimatorPage from '@/pages/EstimatorPage';
import GeneratorPage from '@/pages/GeneratorPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-[#080C14] text-slate-200 min-h-screen flex flex-col relative selection:bg-indigo-500/30 selection:text-indigo-300 font-sans overflow-x-hidden">
        <ThreeBackground />
        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quiz/:phaseId" element={<QuizPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/estimator" element={<EstimatorPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <footer className="relative z-10 border-t border-white/10 glass-panel py-8 mt-20">
          <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400">
                © 2026 <span className="gradient-text-indigo-cyan font-heading font-bold">LearnWithUs</span> EdTech & Developer Hub.
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <a href="/" className="hover:text-cyan-400 transition-colors">Home</a>
              <a href="/estimator" className="hover:text-cyan-400 transition-colors">Scope Estimator</a>
              <a href="/generator" className="hover:text-indigo-400 transition-colors">Schema Generator</a>
              <a href="/community" className="hover:text-indigo-400 transition-colors">Community</a>
              <a href="/notes" className="hover:text-cyan-400 transition-colors">Documentation</a>
              <a href="/admin/login" className="hover:text-indigo-400 transition-colors">Admin Portal</a>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
