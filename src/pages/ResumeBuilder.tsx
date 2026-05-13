import { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateJSONResume } from '../lib/ai';
import { Download, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumeTemplate } from '../components/ResumeTemplate';

export default function ResumeBuilder() {
  const { profile, saveResume, apiKeys, preferences } = useStore();
  const [jobDesc, setJobDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMd, setGeneratedMd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobDesc.trim()) {
      setError('Please provide a job description.');
      return;
    }
    
    // Check if API key is present
    if (preferences.aiProvider === 'gemini' && !apiKeys.gemini && !(import.meta as any).env?.VITE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
      setError('No Gemini API key found. Please add it in Settings.');
      return;
    }
    if (preferences.aiProvider === 'groq' && !apiKeys.groq) {
      setError('No Groq API key found. Please add it in Settings.');
      return;
    }
    if (preferences.aiProvider === 'openai' && !apiKeys.openai) {
      setError('No OpenAI API key found. Please add it in Settings.');
      return;
    }
    if (preferences.aiProvider === 'anthropic' && !apiKeys.anthropic) {
      setError('No Anthropic API key found. Please add it in Settings.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    const profileContext = JSON.stringify(profile, null, 2);

    try {
      const jsonStr = await generateJSONResume(jobDesc, profileContext);
      setGeneratedMd(jsonStr);
      saveResume({
        jobDescription: jobDesc,
        content: jsonStr,
      });
    } catch (err: any) {
      setError(err.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (generatedMd) {
    return (
      <div className="h-full flex flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <div className="no-print bg-white dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setGeneratedMd(null)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
              <ArrowLeft size={16} /> Back to Editor
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
            <span className="text-sm font-medium dark:text-gray-200">ATS Document Generated</span>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download size={16} /> Save as PDF
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           <ResumeTemplate content={generatedMd} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col dark:text-gray-100">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          Resume Builder <Sparkles size={24} className="text-amber-500" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Paste a job description below. We'll contextualize your profile vault into a targeted, ATS-friendly JSON format rendered as a clean template.</p>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 border border-red-100 dark:border-red-900/50 flex justify-between">
          <span>{error}</span>
          <Link to="/settings" className="text-red-800 dark:text-red-300 underline uppercase text-xs font-bold py-1">Go to Settings</Link>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-[#E5E5E5] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
            <h2 className="font-semibold text-sm">Target Job Description</h2>
        </div>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the requirements, responsibilities, and details of the job here..."
          className="flex-1 p-6 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm leading-relaxed bg-transparent dark:text-gray-300 dark:placeholder-gray-600"
        />
      </div>

      <div className="shrink-0 flex justify-end">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !jobDesc.trim() || profile.experience.length === 0}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Analyzing via {preferences.aiProvider}...</> : `Generate Resume (${preferences.aiProvider.toUpperCase()})`}
        </button>
      </div>
      
      {profile.experience.length === 0 && (
         <p className="text-center text-sm text-amber-600 font-medium mt-4">
           You need to add at least one experience entry in your <Link to="/profile" className="underline">Profile</Link> first.
         </p>
      )}
    </div>
  );
}
