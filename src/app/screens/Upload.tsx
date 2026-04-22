import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Upload as UploadIcon, FileText, AlignLeft, Loader2, File } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (user) {
        formData.append('user_id', user.id);
      }

      setUploadProgress(30);

      // Call our backend
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });


      if (!response.ok) throw new Error('Upload failed');
      
      setUploadProgress(80);
      const result = await response.json();
      
      localStorage.setItem('last_ai_result', JSON.stringify(result));
      
      setUploadProgress(100);
      const targetId = result.id || 'latest';
      setTimeout(() => navigate(`/results/${targetId}`), 500);
    } catch (err) {

      console.error(err);
      alert('Error uploading file. Make sure the server is running.');
      setIsUploading(false);
    }
  };


  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <h1 className="text-5xl font-bold text-slate-100 mb-2">Upload Notes</h1>
          <p className="text-slate-400 text-lg mb-8">Upload your study materials and let AI do the work</p>

          {isUploading ? (
            <Card glow className="text-center py-20">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                </div>
                <Loader2 className="relative mx-auto text-purple-400 mb-4 animate-spin" size={80} />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-3">AI is understanding your notes...</h2>
              <p className="text-slate-400 mb-8">This will take just a moment</p>

              {/* Animated Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-slate-500 text-sm mt-3">{uploadProgress}% complete</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Hidden File Input */}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.txt,.docx"
              />

              {/* Drag & Drop Upload Box */}
              <Card glow className="mb-8 hover:border-purple-500/50 transition-all duration-300">
                <div
                  className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center hover:border-purple-500 hover:bg-slate-750 transition-all duration-300 cursor-pointer group"
                  onClick={triggerFileInput}
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                    <UploadIcon className="relative mx-auto text-slate-500 group-hover:text-purple-400 transition-colors" size={64} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-3">
                    Drag & drop your files here
                  </h2>
                  <p className="text-slate-400 mb-4 text-lg">or click to browse</p>
                  <p className="text-sm text-slate-500">Supports PDF, TXT, DOCX (max 10MB)</p>
                </div>
              </Card>

              {/* File Preview */}
              {selectedFile && (
                <Card glow className="mb-8">
                  <h3 className="font-bold text-slate-100 mb-4">Selected File</h3>
                  <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{selectedFile.name}</p>
                        <p className="text-sm text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {selectedFile.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-400 hover:text-red-300 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              )}

              {/* Analyze Button */}
              {selectedFile && (
                <Button onClick={handleAnalyze} className="w-full text-lg py-5">
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={20} />
                    Analyze with AI
                  </span>
                </Button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
