import { useState, useEffect } from 'react';
import { Home, Upload, BookMarked, BarChart3, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import logo from '../../assets/logo.png';
import { supabase } from '../../lib/supabase';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Profile for avatar
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      const { data } = await supabase
        .from('study_materials')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const dates = Array.from(new Set(data.map(n => new Date(n.created_at).toDateString())));
        
        // Calculate consecutive streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let checkDate = new Date(today);
        
        for (const dateStr of dates) {
          const d = new Date(dateStr);
          if (d.getTime() === checkDate.getTime()) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (d.getTime() < checkDate.getTime()) {
            break;
          }
        }
        setStreak(currentStreak);
      }
    };
    fetchData();
  }, []);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: BookMarked, label: 'Saved Notes', path: '/saved' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Study AI Logo" className="w-8 h-8 rounded-lg object-cover" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Study AI
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="px-4 py-3 bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">Study Streak</p>
          <p className="text-2xl font-bold text-purple-400">{streak} days 🔥</p>
        </div>
      </div>
    </div>
  );
}
