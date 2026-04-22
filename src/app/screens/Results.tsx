import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Save, BookOpen, Brain, ListChecks, Download, Bookmark, MessageSquare, Lightbulb, Sun, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Results() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'explanation' | 'keypoints'>('explanation');
  const [focusMode, setFocusMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id === 'latest') {
        const savedResult = localStorage.getItem('last_ai_result');
        if (savedResult) {
          const parsed = JSON.parse(savedResult);
          setResult({
            explanationContent: parsed.explanationContent,
            quiz: parsed.quiz,
            extracted_text: parsed.extracted_text,
            title: parsed.explanationContent?.title || 'Study Material'
          });
        }
        setLoading(false);
        return;
      }

      try {
        const { data: material, error } = await supabase
          .from('study_materials')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        let parsedSummary: any = {};
        try {
          parsedSummary = JSON.parse(material.summary);
        } catch (e) {
          parsedSummary = { explanation: {} };
        }

        const explanation = parsedSummary.explanation || parsedSummary;
        
        setResult({
          explanationContent: explanation,
          quiz: parsedSummary.quiz || [],
          title: material.title,
          isFromDB: true
        });
        setIsSaved(true);
      } catch (err) {
        console.error('Error fetching material:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const mockData = {
    explanationContent: {
      title: 'Quantum Physics - Wave-Particle Duality',
      sections: [
        {
          heading: 'Key Concepts',
          points: [
            'Light exhibits both wave and particle properties depending on observation',
            'Electrons behave as waves in certain experiments like double-slit',
            'The double-slit experiment demonstrates wave-particle duality fundamentally',
          ],
          keywords: ['wave-particle duality', 'photons', 'electrons'],
        },
        {
          heading: 'Important Principles',
          points: [
            'Heisenberg Uncertainty Principle limits simultaneous measurement precision',
            'Quantum superposition allows particles to exist in multiple states simultaneously',
            'Observation affects quantum behavior through wave function collapse',
          ],
          keywords: ['uncertainty', 'superposition', 'measurement', 'wave function'],
        },
      ],
    },
    keyPoints: [
      'Wave-particle duality is fundamental to quantum mechanics',
      'Observation changes quantum behavior',
      'Double-slit experiment proves wave properties',
      'Uncertainty principle limits measurement',
      'Superposition enables quantum computing',
    ]
  };

  const finalData = result || mockData;
  const { explanationContent } = finalData;
  const keyPoints = explanationContent?.key_takeaways || [];
  
  const activeExplanation = explanationContent;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-100 text-xl font-bold">Loading your results...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className={`${focusMode ? 'max-w-4xl' : 'max-w-7xl'} mx-auto p-8`}>
          <div className={`grid ${focusMode ? 'grid-cols-1' : 'lg:grid-cols-[1fr_300px]'} gap-8`}>
            {/* Main Content */}
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-2">
                    {activeExplanation?.title || 'Study Material'}
                  </h1>
                  <p className="text-slate-400">Notes analyzed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setFocusMode(!focusMode)} className="flex items-center gap-2">
                    <Sun size={20} />
                    {focusMode ? 'Exit Focus' : 'Focus'}
                  </Button>
                  <Button 
                    variant={isSaved ? "ghost" : "outline"}
                    className="flex items-center gap-2"
                    disabled={isSaved || saving}
                    onClick={async () => {
                      if (id !== 'latest') {
                        setIsSaved(true);
                        return;
                      }
                      
                      setSaving(true);
                      try {
                        const { data: { user } } = await supabase.auth.getUser();
                        if (!user) throw new Error('User not logged in');

                        const { error } = await supabase
                          .from('study_materials')
                          .insert([{
                            user_id: user.id,
                            title: result.explanationContent?.title || 'Untitled',
                            summary: JSON.stringify({
                              explanation: result.explanationContent,
                              quiz: result.quiz
                            }),
                            content: result.extracted_text
                          }]);

                        if (error) throw error;
                        
                        setIsSaved(true);
                        alert('Note saved to your library!');
                      } catch (err: any) {
                        console.error('Save error:', err);
                        alert('Error saving note: ' + err.message);
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaved ? 'Saved to Library' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mb-8 border-b border-slate-800">
                <button
                  onClick={() => setActiveTab('explanation')}
                  className={`pb-4 px-2 font-medium transition-all duration-300 relative ${
                    activeTab === 'explanation'
                      ? 'text-purple-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} />
                    Explanation
                  </div>
                  {activeTab === 'explanation' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('keypoints')}
                  className={`pb-4 px-2 font-medium transition-all duration-300 relative ${
                    activeTab === 'keypoints'
                      ? 'text-purple-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ListChecks size={20} />
                    Key Points
                  </div>
                  {activeTab === 'keypoints' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  )}
                </button>
              </div>

              {/* Content Area */}
              {activeTab === 'explanation' ? (
                <div className="space-y-6">
                  {activeExplanation?.sections?.map((section: any, index: number) => (
                    <Card key={index} glow>
                      <h2 className="text-2xl font-bold text-slate-100 mb-6">
                        {section.heading}
                      </h2>
                      <ul className="space-y-4 mb-6">
                        {section.points.map((point: string, i: number) => (
                          <li key={i} className="flex gap-4">
                            <span className="text-purple-400 mt-1 text-xl">•</span>
                            <span className="text-slate-300 leading-relaxed text-lg">{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 flex-wrap">
                        {section.keywords.map((keyword: string) => (
                          <span
                            key={keyword}
                            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl text-sm border border-purple-500/20"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card glow>
                  <h2 className="text-2xl font-bold text-slate-100 mb-6">Key Takeaways</h2>
                  <div className="space-y-4">
                    {keyPoints?.map((point: string, index: number) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-purple-500/30 transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-lg pt-1">{point}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Quiz CTA */}
              <Card className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      Test Your Knowledge
                    </h3>
                    <p className="text-slate-300">
                      Take a quiz to see how well you understand this material
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/quiz/${id}`)} className="flex items-center gap-2">
                    <Brain size={20} />
                    Start Quiz
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Sidebar - Quick Actions */}
            {!focusMode && (
              <div className="space-y-6">
                <Card glow>
                  <h3 className="text-lg font-bold text-slate-100 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/quiz/${id}`)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-750 rounded-xl transition-colors text-left border border-slate-700 hover:border-purple-500/30"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">Generate Quiz</p>
                        <p className="text-slate-500 text-xs">Test yourself</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate(`/chat/${id}`)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-750 rounded-xl transition-colors text-left border border-slate-700 hover:border-blue-500/30"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">Ask AI</p>
                        <p className="text-slate-500 text-xs">Get clarification</p>
                      </div>
                    </button>
                  </div>
                </Card>


              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
