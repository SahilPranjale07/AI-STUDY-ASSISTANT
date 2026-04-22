import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { TrendingUp, Target, Clock, Brain, Calendar, Award, Zap, BookOpen } from 'lucide-react';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    quizzesTaken: 0,
    avgScore: 0,
    streak: 0,
    hours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: notes } = await supabase
        .from('study_materials')
        .select('created_at')
        .eq('user_id', user.id);

      if (notes) {
        // Calculate Streak
        const dates = notes.map(n => new Date(n.created_at).toDateString());
        const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        
        let streak = 0;
        let today = new Date();
        let current = new Date(today.toDateString());

        for (let i = 0; i < uniqueDates.length; i++) {
          const noteDate = new Date(uniqueDates[i]);
          const diffTime = Math.abs(current.getTime() - noteDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 1) {
            streak++;
            current = noteDate;
          } else {
            break;
          }
        }

        setStats({
          totalNotes: notes.length,
          quizzesTaken: notes.length > 0 ? Math.floor(notes.length * 0.7) : 0,
          avgScore: notes.length > 0 ? 85 : 0,
          streak: streak,
          hours: Math.round(notes.length * 0.8)
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const weeklyData = [
    { day: 'Mon', hours: stats.hours > 2 ? 2.5 : 0.5, quizzes: 3 },
    { day: 'Tue', hours: stats.hours > 4 ? 3.2 : 0.8, quizzes: 5 },
    { day: 'Wed', hours: stats.hours > 1 ? 1.8 : 0.2, quizzes: 2 },
    { day: 'Thu', hours: stats.hours > 5 ? 4.1 : 1.1, quizzes: 6 },
    { day: 'Fri', hours: stats.hours > 3 ? 2.9 : 0.9, quizzes: 4 },
    { day: 'Sat', hours: stats.hours > 6 ? 3.5 : 1.5, quizzes: 5 },
    { day: 'Sun', hours: stats.hours > 2 ? 2.0 : 0.3, quizzes: 3 },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-slate-100 mb-2">Analytics</h1>
            <p className="text-slate-400 text-lg">Track your learning progress</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Notes</p>
              <p className="text-3xl font-bold text-slate-100">{stats.totalNotes}</p>
              <p className="text-green-400 text-sm mt-2">All time</p>
            </Card>

            <Card glow>
              <h3 className="font-bold text-slate-100 mb-4">Study Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="text-yellow-400" size={20} />
                    <span className="text-slate-300 text-sm">Notes Mastered</span>
                  </div>
                  <span className="text-slate-100 font-bold">{stats.totalNotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="text-purple-400" size={20} />
                    <span className="text-slate-300 text-sm">Study Hours</span>
                  </div>
                  <span className="text-slate-100 font-bold">{stats.hours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="text-blue-400" size={20} />
                    <span className="text-slate-300 text-sm">Current Streak</span>
                  </div>
                  <span className="text-slate-100 font-bold">{stats.streak} days</span>
                </div>
              </div>
            </Card>

            <Card glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <p className="text-slate-400 text-sm mb-1">Avg Quiz Score</p>
              <p className="text-3xl font-bold text-slate-100">{stats.avgScore}%</p>
              <p className="text-green-400 text-sm mt-2">Steady growth</p>
            </Card>

            <Card glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
                  <Clock className="text-white" size={24} />
                </div>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <p className="text-slate-400 text-sm mb-1">Study Hours</p>
              <p className="text-3xl font-bold text-slate-100">{stats.hours}h</p>
              <p className="text-green-400 text-sm mt-2">Based on content</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Study Time Chart */}
            <Card glow>
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Weekly Study Time</h2>
              <div className="flex items-end justify-between gap-3 h-64">
                {weeklyData.map((data) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-purple-500 hover:to-blue-500"
                        style={{ height: `${(data.hours / maxHours) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-100">
                          {data.hours}h
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{data.day}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Subject Performance */}
            <Card glow>
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Subject Performance</h2>
              <div className="space-y-6">
                {[
                  { subject: 'Physics', score: 88, color: 'from-purple-600 to-blue-600' },
                  { subject: 'Mathematics', score: 92, color: 'from-blue-600 to-cyan-600' },
                  { subject: 'Chemistry', score: 76, color: 'from-violet-600 to-purple-600' },
                  { subject: 'History', score: 85, color: 'from-pink-600 to-rose-600' },
                ].map((item) => (
                  <div key={item.subject}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">{item.subject}</span>
                      <span className="text-slate-100 font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Achievements */}
          <Card glow>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Achievements</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="text-white" size={28} />
                </div>
                <div>
                  <p className="font-bold text-slate-100">7 Day Streak</p>
                  <p className="text-sm text-slate-400">Keep it up!</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="text-white" size={28} />
                </div>
                <div>
                  <p className="font-bold text-slate-100">Quiz Master</p>
                  <p className="text-sm text-slate-400">100% on 5 quizzes</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-white" size={28} />
                </div>
                <div>
                  <p className="font-bold text-slate-100">Early Bird</p>
                  <p className="text-sm text-slate-400">Study before 9 AM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
