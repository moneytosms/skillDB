import { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateJSONResume } from '../lib/ai';
import { Download, Sparkles, Loader2, ArrowLeft, LayoutTemplate, Type, History, Edit2, Save, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumeTemplate, TemplateVariant, FontStyle } from '../components/ResumeTemplate';

export default function ResumeBuilder() {
  const { profile, saveResume, apiKeys, preferences } = useStore();
  const [jobDesc, setJobDesc] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMd, setGeneratedMd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templateVariant, setTemplateVariant] = useState<TemplateVariant>('standard');
  const [fontStyle, setFontStyle] = useState<FontStyle>('sans');
  const [showHistory, setShowHistory] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);
  const [editedJson, setEditedJson] = useState('');
  
  // also grab resumes from store
  const { resumes, deleteResume } = useStore();

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

    let fullPromptContext = jobDesc;
    if (customInstructions.trim()) {
      fullPromptContext = `Job Description:\n${jobDesc}\n\nUser Custom Instructions/Preferences:\n${customInstructions}`;
    }

    try {
      const jsonStr = await generateJSONResume(fullPromptContext, profileContext);
      setGeneratedMd(jsonStr);
      saveResume({
        jobDescription: fullPromptContext,
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
        <div className="no-print bg-white dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-gray-800 p-4 flex flex-col sm:flex-row justify-between sm:items-center sticky top-0 z-10 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setGeneratedMd(null)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white shrink-0">
              <ArrowLeft size={16} /> Back to Editor
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-sm font-medium dark:text-gray-200 hidden sm:block">ATS Document Generated</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 sm:flex-none">
               <LayoutTemplate size={16} className="text-gray-500 mr-2 shrink-0" />
               <select 
                 value={templateVariant}
                 onChange={(e) => setTemplateVariant(e.target.value as TemplateVariant)}
                 className="bg-transparent text-sm w-full outline-none text-gray-800 dark:text-gray-200"
               >
                 <option value="standard">Standard (ATS)</option>
                 <option value="compact">Compact (Ultra-Tight)</option>
                 <option value="modern">Modern (Clean)</option>
                 <option value="executive">Executive (Classic)</option>
               </select>
            </div>
            
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 sm:flex-none">
               <Type size={16} className="text-gray-500 mr-2 shrink-0" />
               <select 
                 value={fontStyle}
                 onChange={(e) => setFontStyle(e.target.value as FontStyle)}
                 className="bg-transparent text-sm w-full outline-none text-gray-800 dark:text-gray-200"
               >
                 <option value="sans">Sans-Serif</option>
                 <option value="serif">Serif (LaTeX)</option>
                 <option value="mono">Monospace</option>
               </select>
            </div>
            
            <button 
              onClick={() => {
                if (!isEditingJson) setEditedJson(generatedMd || '');
                setIsEditingJson(!isEditingJson);
              }} 
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-sm font-medium shrink-0"
            >
              {isEditingJson ? <><Save size={16} /> Save Data</> : <><Edit2 size={16} /> Edit Data</>}
            </button>
            <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shrink-0">
              <Download size={16} /> Save PDF
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           {isEditingJson ? (
             <div className="max-w-[850px] mx-auto h-full flex flex-col">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="text-sm font-semibold dark:text-gray-200">Raw JSON Edit</h2>
                 <button 
                   onClick={() => {
                     try {
                        JSON.parse(editedJson); // basic validation
                        setGeneratedMd(editedJson);
                        setIsEditingJson(false);
                     } catch(e) {
                        alert("Invalid JSON data");
                     }
                   }}
                   className="text-xs bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-md font-medium"
                 >
                   Apply Changes
                 </button>
               </div>
               <textarea 
                 value={editedJson}
                 onChange={(e) => setEditedJson(e.target.value)}
                 className="w-full flex-1 p-4 font-mono text-xs md:text-sm bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto dark:text-gray-300 min-h-[600px]"
                 spellCheck="false"
               />
             </div>
           ) : (
             <ResumeTemplate content={generatedMd} variant={templateVariant} fontStyle={fontStyle} />
           )}
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

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-[#E5E5E5] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
            <h2 className="font-semibold text-sm">Target Job Description</h2>
        </div>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the requirements, responsibilities, and details of the job here..."
          className="flex-1 p-6 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm leading-relaxed bg-transparent dark:text-gray-300 dark:placeholder-gray-600 min-h-[200px]"
        />
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 shrink-0">
        <div className="p-4 border-b border-[#E5E5E5] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="font-semibold text-sm">Custom Instructions (Optional)</h2>
        </div>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="e.g., 'Emphasize my leadership skills', 'Focus on backend technologies', 'Make sure to include my LeetCode profile', 'Ensure the resume fills the entire page'"
          className="p-4 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm leading-relaxed bg-transparent dark:text-gray-300 dark:placeholder-gray-600 h-24"
        />
      </div>

      <div className="shrink-0 flex justify-end gap-3">
        {resumes.length > 0 && (
          <button 
            onClick={() => setShowHistory(true)}
            className="bg-transparent text-gray-600 dark:text-gray-400 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <History size={16} /> History
          </button>
        )}
        <button 
          onClick={() => {
            setJobDesc('');
            setCustomInstructions('');
          }}
          className="bg-transparent text-gray-600 dark:text-gray-400 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-semibold"
        >
          Clear
        </button>
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

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white dark:bg-[#141414] w-[400px] h-full shadow-2xl flex flex-col border-l border-[#E5E5E5] dark:border-gray-800">
            <div className="p-4 border-b border-[#E5E5E5] dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white"><History size={18} /> Generated Resumes</h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-black dark:hover:text-white p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {resumes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center mt-10">No history yet.</p>
              ) : (
                resumes.map(r => (
                  <div key={r.id} className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 p-3 rounded-lg flex flex-col gap-2 relative">
                     <button 
                       onClick={() => deleteResume(r.id)}
                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                     >
                       <X size={14} />
                     </button>
                     <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                       <Clock size={12} /> {new Date(r.createdAt).toLocaleString()}
                     </p>
                     <p className="text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-2 leading-snug">
                       {r.jobDescription.split('\n')[0] || 'Generated Resume'}
                     </p>
                     <button
                       onClick={() => {
                         setGeneratedMd(r.content);
                         setShowHistory(false);
                       }}
                       className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-1.5 px-3 rounded text-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                     >
                       Load Resume
                     </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
