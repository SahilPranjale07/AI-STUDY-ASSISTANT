import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CheckCircle, XCircle, Trophy, Target, Award, Star, Timer } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (id === 'latest') {
        const savedResult = localStorage.getItem('last_ai_result');
        if (savedResult) {
          const data = JSON.parse(savedResult);
          if (data.quiz) setQuestions(data.quiz);
        }
        setLoading(false);
        return;
      }

      try {
        const { data: material, error } = await supabase
          .from('study_materials')
          .select('summary')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const parsed = JSON.parse(material.summary);
        // Handle both old structure and new structure
        const quizData = parsed.quiz || parsed;
        setQuestions(quizData || []);
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);


  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    if (showFeedback || quizComplete || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswerSelect(-1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showFeedback, quizComplete, questions.length]);


  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-100 text-xl font-bold">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="text-center">
          <p className="text-slate-100 text-xl font-bold mb-4">No quiz found for this material.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    if (index === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
    } else {
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = percentage === 100;
    const isGreat = percentage >= 80;

    return (
      <div className="flex h-screen bg-slate-950">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <Card glow className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                </div>
                <Trophy className="relative mx-auto text-yellow-400 mb-6 animate-bounce" size={100} />
              </div>

              <h1 className="text-5xl font-bold text-slate-100 mb-6">Quiz Complete!</h1>

              <div className="mb-8">
                <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  {percentage}%
                </div>
                <p className="text-2xl text-slate-300 mb-6">
                  {isPerfect ? '🎉 Perfect Score!' : isGreat ? '🌟 Excellent Work!' : '💪 Keep Practicing!'}
                </p>
                <p className="text-xl text-slate-400">
                  You got <span className="text-purple-400 font-bold">{score}</span> out of {questions.length} questions correct
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <Target className="mx-auto text-purple-400 mb-2" size={32} />
                  <p className="text-slate-400 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-slate-100">{percentage}%</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <Award className="mx-auto text-blue-400 mb-2" size={32} />
                  <p className="text-slate-400 text-sm">Questions</p>
                  <p className="text-2xl font-bold text-slate-100">{score}/{questions.length}</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <Star className="mx-auto text-yellow-400 mb-2" size={32} />
                  <p className="text-slate-400 text-sm">Points Earned</p>
                  <p className="text-2xl font-bold text-slate-100">{score * 10}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setQuizComplete(false);
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                    setTimeLeft(30);
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">Quantum Physics Quiz</h1>
                <p className="text-slate-400">Test your understanding</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
                  <Timer className="text-purple-400" size={20} />
                  <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-100'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <span className="text-slate-400 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
                  Question {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <Card glow className="mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-8 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQ.correctAnswer;
                const showCorrect = showFeedback && isCorrect;
                const showIncorrect = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                      showCorrect
                        ? 'border-green-500 bg-green-500/10 scale-105'
                        : showIncorrect
                        ? 'border-red-500 bg-red-500/10 scale-95'
                        : isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showIncorrect ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-purple-600 text-white' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className={`text-lg ${
                          showCorrect ? 'text-green-300' :
                          showIncorrect ? 'text-red-300' :
                          'text-slate-200'
                        }`}>
                          {option}
                        </span>
                      </div>
                      {showCorrect && <CheckCircle className="text-green-400" size={28} />}
                      {showIncorrect && <XCircle className="text-red-400" size={28} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Feedback */}
          {showFeedback && (
            <Card className="mb-8 bg-blue-900/30 border-blue-500/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Explanation</h3>
                  <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button onClick={handleNext} className="w-full text-lg py-4">
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
