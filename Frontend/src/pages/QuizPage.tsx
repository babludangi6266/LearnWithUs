import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { apiService, Question, Phase } from '@/services/api';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Trophy, 
  RotateCcw, 
  LayoutDashboard, 
  HelpCircle
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function QuizPage() {
  const params = useParams();
  const navigate = useNavigate();
  const phaseId = params.phaseId as string;
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; totalQuestions: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      setIsLoading(true);
      try {
        const phases = await apiService.getPhases();
        const foundPhase = phases.find(p => p._id === phaseId);
        if (foundPhase) setPhase(foundPhase);

        const qList = await apiService.getQuestionsByPhase(phaseId);
        setQuestions(qList);
      } catch (err) {
        console.error('Error loading quiz:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (phaseId) loadQuiz();
  }, [phaseId]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    const currentQ = questions[currentIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ._id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      let finalScore = 0;
      questions.forEach(q => {
        if (selectedAnswers[q._id] === q.correctOption) {
          finalScore += 1;
        }
      });

      if (user.role === 'student') {
        try {
          await apiService.submitAnswers(phaseId, selectedAnswers);
        } catch (e) {
          console.log('Submitted answers locally fallback');
        }
      }

      setResult({ score: finalScore, totalQuestions: questions.length });
      setIsSubmitted(true);

      // Trigger Celebration Confetti if score >= 50%
      if (finalScore / questions.length >= 0.5) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-mono text-sm">Loading Phase Assessment Questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="glass-card rounded-3xl p-10 border border-white/10 space-y-4">
          <HelpCircle className="w-16 h-16 text-purple-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">No Questions Found</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            This learning phase does not have questions assigned yet. Ask an admin to add questions via the Admin Portal!
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white border border-white/10 text-xs font-bold"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-neon-violet"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {phase?.name || 'Phase Assessment'}
          </h1>
        </div>

        {!isSubmitted && (
          <div className="flex items-center gap-3 bg-gray-800/80 px-4 py-2 rounded-2xl border border-white/10">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-gray-200">
              Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Quiz Flow */}
      {!isSubmitted ? (
        <div className="space-y-6">
          
          {/* Progress Indicator */}
          <div className="w-full bg-[#06080D] rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden"
            >
              <div className="glow-point-cyan -top-20 -right-20 opacity-20" />

              <div className="space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Multiple Choice Question
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const selected = selectedAnswers[currentQ._id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between group ${
                        selected
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-white shadow-neon-cyan'
                          : 'bg-[#06080D]/60 border-white/5 text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center border transition-all ${
                          selected
                            ? 'bg-cyan-400 text-[#06080D] border-cyan-400'
                            : 'bg-gray-800 text-gray-400 border-white/10 group-hover:border-white/30'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation & Submit Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 text-[#06080D] text-xs font-bold shadow-neon-emerald flex items-center gap-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white text-xs font-bold shadow-neon-violet hover:opacity-90 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit & Finish Quiz</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Result Score Card */}
          <div className="glass-card rounded-3xl p-8 border border-cyan-400/30 text-center space-y-6 relative overflow-hidden">
            <div className="glow-point-cyan -top-20 -right-20 opacity-30" />
            <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />

            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Assessment Finished
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                You Scored <span className="gradient-text-cyan-violet">{result?.score}</span> / {result?.totalQuestions}
              </h2>
              <p className="text-sm text-gray-300">
                {result && result.score / result.totalQuestions >= 0.8
                  ? 'Outstanding performance! You have mastered this learning phase.'
                  : 'Good effort! Review the answer breakdown below to reinforce your knowledge.'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentIndex(0);
                  setSelectedAnswers({});
                }}
                className="px-6 py-3 rounded-xl glass-card text-gray-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 text-[#06080D] text-xs font-bold shadow-neon-emerald flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Answer Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Detailed Answer Review</h3>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q._id];
              const isCorrect = userAns === q.correctOption;

              return (
                <div
                  key={q._id}
                  className={`glass-card rounded-2xl p-6 border ${
                    isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-gray-400">Q{idx + 1}.</span>
                        {isCorrect ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white">{q.question}</h4>
                      
                      <div className="text-xs space-y-1 font-mono pt-2">
                        <div className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                          Your choice: <strong>{userAns !== undefined ? q.options[userAns] : 'Not answered'}</strong>
                        </div>
                        {!isCorrect && (
                          <div className="text-emerald-400">
                            Correct answer: <strong>{q.options[q.correctOption]}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
