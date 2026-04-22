import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Upload, Search, Clock, TrendingUp, Target, BookOpen, Zap, Star, Lightbulb, Book } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      
      // Fetch Profile for avatar
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);
      
      fetchNotes(user.id);
    };

    const fetchNotes = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('study_materials')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const recentNotes = notes.slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    date: new Date(n.created_at).toLocaleDateString(),
    subject: 'AI Generated',
    progress: Math.floor(Math.random() * 100) // Mock progress for now
  }));

  const continueNotes = notes.slice(0, 2).map(n => ({
    id: n.id,
    title: n.title,
    progress: Math.floor(Math.random() * 100), // Mock progress for now
    subject: 'AI Generated'
  }));


  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold text-slate-100 mb-2">
                Welcome back {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'} 👋
              </h1>
              <p className="text-slate-400 text-lg">Ready to continue learning?</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-100 font-bold">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
                <p className="text-slate-500 text-sm">Pro Member</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-1 shadow-lg shadow-purple-500/20">
                <img 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-xl bg-slate-900 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <Input
                type="text"
                placeholder="Search your notes..."
                className="pl-12"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Notes</p>
                  <p className="text-3xl font-bold text-slate-100">{notes.length}</p>
                  <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {notes.length > 0 ? '+1 today' : 'Ready to start'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
              </div>
            </Card>

            <Card glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Quizzes Taken</p>
                  <p className="text-3xl font-bold text-slate-100">0</p>
                  <p className="text-blue-400 text-sm mt-1 flex items-center gap-1">
                    <Target size={14} />
                    0% avg score
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
              </div>
            </Card>

            <Card glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Study Time</p>
                  <p className="text-3xl font-bold text-slate-100">{Math.round(notes.length * 0.8)}h</p>
                  <p className="text-purple-400 text-sm mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    Total hours
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="text-white" size={24} />
                </div>
              </div>
            </Card>
          </div>

          {/* Upload CTA */}
          <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/20 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Upload New Notes</h2>
                <p className="text-slate-300">Transform your notes into detailed explanations and quizzes</p>
              </div>
              <button 
                onClick={() => navigate('/upload')} 
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
              >
                <Upload size={20} />
                Upload Notes
              </button>
            </div>
          </Card>

          {/* Continue Learning Section */}
          {continueNotes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Continue Learning</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {continueNotes.map((note) => (
                  <Card
                    key={note.id}
                    onClick={() => navigate(`/results/${note.id}`)}
                    glow
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                        {note.subject}
                      </span>
                      <span className="text-slate-400 text-sm">{note.progress}% complete</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-4">{note.title}</h3>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                        style={{ width: `${note.progress}%` }}
                      ></div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Notes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Recent Notes</h2>
              <button
                onClick={() => navigate('/saved')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all →
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentNotes.map((note) => (
                <Card
                  key={note.id}
                  onClick={() => navigate(`/results/${note.id}`)}
                  glow
                >
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                      {note.subject}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{note.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                    <Clock size={16} />
                    <span>{note.date}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                      style={{ width: `${note.progress}%` }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
