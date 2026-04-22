import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { User, Mail, Bell, Shield, Palette, LogOut, Award, Target, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', age: '' });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [stats, setStats] = useState({ totalNotes: 0, hours: 0, streak: 0 });

  const avatars = Array.from({ length: 12 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar${i + 1}`);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({ ...profileData, email: user.email });
        setEditData({ full_name: profileData.full_name || '', age: profileData.age?.toString() || '' });
      } else {
        setProfile({ email: user.email });
      }

      // Fetch Stats
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
          streak: streak,
          hours: Math.round(notes.length * 0.8)
        });
      }

      setLoading(false);
    };

    fetchProfileAndStats();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: editData.full_name,
          age: parseInt(editData.age),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setProfile({ ...profile, ...editData, age: parseInt(editData.age) });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert('Error updating profile: ' + err.message);
    }
  };

  const handleAvatarSelect = async (url: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: url,
          updated_at: new Date().toISOString()
        });

      if (error) {
        // If it fails, maybe the column doesn't exist yet, we'll just update local state for now
        console.warn('Failed to save avatar to DB (check if avatar_url column exists):', error);
      }
      
      setProfile({ ...profile, avatar_url: url });
      setShowAvatarModal(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };



  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-slate-100 mb-2">Profile Settings</h1>
            <p className="text-slate-400 text-lg">Manage your account and preferences</p>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Profile Card */}
            <div className="space-y-6">
              <Card glow className="text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-white" size={40} />
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 rounded-full text-white text-xs font-bold">
                    Pro
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">
                  {loading ? 'Loading...' : profile?.full_name || 'Anonymous User'}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{profile?.email}</p>
                <div className="text-slate-300 text-sm mb-4">
                  Age: {profile?.age || 'Not set'}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowAvatarModal(true)}
                  className="w-full"
                >
                  Change Avatar
                </Button>
              </Card>

              {/* Avatar Selection Modal */}
              {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <Card className="max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Choose Your Character</h3>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {avatars.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => handleAvatarSelect(url)}
                          className="w-16 h-16 rounded-xl bg-slate-800 hover:bg-slate-700 p-1 border-2 border-transparent hover:border-purple-500 transition-all overflow-hidden"
                        >
                          <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => setShowAvatarModal(false)} className="w-full">
                      Cancel
                    </Button>
                  </Card>
                </div>
              )}
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
              </div>

              {/* Settings Sections */}
              <div className="space-y-6">
              {/* Account Settings */}
              <Card glow>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">Account Settings</h2>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    label="Full Name"
                    value={isEditing ? editData.full_name : (profile?.full_name || '')}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    readOnly={!isEditing}
                  />
                  <Input
                    type="number"
                    label="Age"
                    value={isEditing ? editData.age : (profile?.age || '')}
                    onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                    readOnly={!isEditing}
                  />
                  <Input
                    type="email"
                    label="Email Address"
                    value={profile?.email || ''}
                    readOnly
                  />
                  
                  {isEditing ? (
                    <div className="flex gap-4 mt-6">
                      <Button onClick={handleSave} className="flex-1">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="mt-6">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </Card>



              {/* Danger Zone */}
              <Card className="border-red-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center">
                    <LogOut className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">Account</h2>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

