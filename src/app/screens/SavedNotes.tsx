import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Search, Clock, Tag, Trash2, BookMarked, Pin, Folder, Grid3x3, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SavedNotes() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Fetched notes raw data:', data);

      if (error) throw error;

      const formattedNotes = data.map(note => {
        let summaryObj: any = {};
        try {
          if (note.summary) {
            const parsed = JSON.parse(note.summary);
            summaryObj = parsed.explanation || parsed;
          }
        } catch (e) {
          console.warn('Failed to parse summary for note:', note.id);
        }
        
        return {
          id: note.id,
          title: note.title || summaryObj.title || 'Untitled Material',
          date: new Date(note.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          subject: 'General',
          tags: summaryObj.sections?.[0]?.keywords || ['study', 'notes'],
          folder: 'My Notes'
        };
      });

      console.log('Formatted notes:', formattedNotes);
      setSavedNotes(formattedNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = (id: string) => {
    setPinnedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const { error } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSavedNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const filteredNotes = savedNotes.filter(note => {
    const matchesFilter = filter === 'all' || note.subject === filter;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter(note => pinnedIds.includes(note.id));
  const unpinnedNotes = filteredNotes.filter(note => !pinnedIds.includes(note.id));

  const subjects = ['all', ...Array.from(new Set(savedNotes.map(note => note.subject)))];
  const folders = Array.from(new Set(savedNotes.map(note => note.folder)));

  const NoteCard = ({ note, isPinned }: { note: any, isPinned: boolean }) => (
    <Card
      key={note.id}
      glow
      className={`group hover:scale-102 transition-all duration-300 ${isPinned ? 'border-purple-500/30' : ''}`}
    >
      <div
        onClick={() => navigate(`/results/${note.id}`)}
        className="cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/20">
              {note.subject}
            </span>
            {isPinned && <Pin className="text-purple-400" size={16} />}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note.id);
              }}
              className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                isPinned ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              <Pin size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-3 line-clamp-2 leading-tight">
          {note.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Folder size={14} />
          <span>{note.folder}</span>
          <span>•</span>
          <Clock size={14} />
          <span>{note.date}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {note.tags?.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-slate-400 rounded-lg text-xs border border-slate-700"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-slate-100 mb-2">Saved Notes</h1>
            <p className="text-slate-400 text-lg">All your analyzed notes in one place</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
            </select>

            <div className="flex gap-2 bg-slate-800 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Folders Quick Access */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            >
              <Folder size={18} />
              All Folders
            </button>
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => alert(`Filtering by ${folder} folder`)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              >
                <Folder size={18} />
                {folder}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          {filteredNotes.length > 0 ? (
            <>
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Pin className="text-purple-400" size={20} />
                    <h2 className="text-2xl font-bold text-slate-100">Pinned Notes</h2>
                  </div>
                  <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} isPinned={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Notes */}
              {unpinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <BookMarked className="text-slate-400" size={20} />
                    <h2 className="text-2xl font-bold text-slate-100">All Notes</h2>
                  </div>
                  <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {unpinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} isPinned={false} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card glow className="text-center py-20">
              <BookMarked className="mx-auto text-slate-600 mb-6" size={80} />
              <h2 className="text-3xl font-bold text-slate-100 mb-3">No notes found</h2>
              <p className="text-slate-400 text-lg mb-8">
                {filter === 'all'
                  ? 'Upload some notes to get started'
                  : `No notes found in ${filter}`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View all notes →
                </button>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
