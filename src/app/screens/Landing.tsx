import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Sparkles, BookOpen, Brain, Highlighter, Lightbulb } from 'lucide-react';
import logo from '../../assets/logo.png';
import { supabase } from '../../lib/supabase';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const features = [
    {
      icon: Sparkles,
      title: 'AI Summary',
      description: 'Get concise, intelligent summaries of your notes in seconds with advanced AI',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Explain Like I\'m 10',
      description: 'Complex topics broken down into simple, easy-to-understand explanations',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      title: 'Quiz Generator',
      description: 'Test your knowledge with AI-generated quizzes from your notes',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Highlighter,
      title: 'Smart Highlighting',
      description: 'Automatically identify and highlight key concepts and important terms',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Navbar */}
      <nav className="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Study AI Logo" className="w-8 h-8 rounded-lg object-cover" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Study AI
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-slate-200 transition-colors">Features</a>
            <Button variant="ghost" onClick={() => navigate('/auth', { state: { mode: 'login' } })}>Login</Button>
            <Button onClick={() => navigate('/auth', { state: { mode: 'signup' } })}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-400 text-sm">✨ AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-7xl font-bold text-slate-100 mb-6 leading-tight">
            Turn Notes into
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Understanding with AI
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Upload your study notes and let AI generate summaries, simple explanations, and practice quizzes to help you learn faster and retain more.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/auth', { state: { mode: 'signup' } })} className="text-lg px-10 py-5">
              Start Learning Free
            </Button>
          </div>

          {/* Product Mockup */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-100">Quantum Physics - Summary</div>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles...
                </div>
                <div className="h-px bg-slate-800 w-full"></div>
                
                {/* Rich Informative Section Preview */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {/* Left: What Students Say */}
                  <div className="space-y-3 bg-[#1E293B] p-4 rounded-xl border border-slate-700/50 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-100">What Students Say ⭐</span>
                    </div>
                    {[
                      { name: 'Sarah M.', text: 'Boosted my scores by 25%!' },
                      { name: 'James D.', text: 'Best AI study tool ever.' }
                    ].map((user, i) => (
                      <div key={i} className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
                            {user.name[0]}
                          </div>
                          <div className="text-[10px] font-bold text-slate-200">{user.name}</div>
                        </div>
                        <div className="text-[9px] text-slate-400 italic">"{user.text}"</div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Recommendations */}
                  <div className="space-y-3">
                    <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700/50 shadow-lg">
                      <span className="text-xs font-bold text-slate-100 block mb-2">Recommended 📚</span>
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded shadow-md flex-shrink-0 flex items-center justify-center">
                          <BookOpen size={14} className="text-white" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[10px] font-bold text-slate-200 truncate">Deep Learning</div>
                          <div className="text-[8px] text-slate-500">Neural Networks</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-4 rounded-xl border border-indigo-500/30 shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-bold text-slate-100 uppercase">Pro Tip 💡</span>
                      </div>
                      <div className="text-[9px] text-slate-300 leading-tight">
                        Use AI summaries + quizzes together to improve retention by 40%!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-100 mb-4">Powerful AI Features</h2>
          <p className="text-xl text-slate-400">Everything you need to study smarter</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} glow className="hover:scale-105 transition-transform duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900 border-t border-slate-800 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src={logo} alt="Study AI Logo" className="w-6 h-6 rounded-lg object-cover" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Study AI
                </h3>
              </div>
              <p className="text-slate-500">Learn smarter, not harder</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
