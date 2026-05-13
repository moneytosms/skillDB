import { useStore } from '../store/useStore';
import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Download, Trash2, ArrowLeft, LayoutTemplate } from 'lucide-react';
import { ResumeTemplate, TemplateVariant } from '../components/ResumeTemplate';

export default function History() {
  const { resumes, deleteResume } = useStore();
  const [viewingResume, setViewingResume] = useState<string | null>(null);
  const [templateVariant, setTemplateVariant] = useState<TemplateVariant>('standard');

  const activeResume = resumes.find(r => r.id === viewingResume);

  const handlePrint = () => {
    window.print();
  };

  if (viewingResume && activeResume) {
    return (
      <div className="h-full flex flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <div className="no-print bg-white dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-gray-800 p-4 flex flex-col sm:flex-row justify-between sm:items-center sticky top-0 z-10 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewingResume(null)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white shrink-0">
              <ArrowLeft size={16} /> Back to History
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-sm text-gray-500 hidden sm:block">Generated {formatDate(activeResume.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
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
                 <option value="executive">Executive (Serif)</option>
               </select>
            </div>
            <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shrink-0">
              <Download size={16} /> Save PDF
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           <ResumeTemplate content={activeResume.content} variant={templateVariant} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto dark:text-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Resume History</h1>
        <p className="text-gray-500 dark:text-gray-400">Access your previously generated resumes based on past job descriptions.</p>
      </header>

      {resumes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl shadow-sm">
          <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No History Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Use the Resume Builder to generate customized resumes, and they will be saved here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resumes.map(resume => (
            <div key={resume.id} className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:border-black dark:hover:border-white">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg truncate">Target Job Match</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Generated {formatDate(resume.createdAt)}</p>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#141414] p-2 rounded truncate block border border-gray-100 dark:border-gray-800">
                    {resume.jobDescription.substring(0, 150)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center shrink-0 w-full md:w-auto mt-4 md:mt-0 gap-2">
                <button 
                  onClick={() => setViewingResume(resume.id)}
                  className="flex-1 md:flex-none justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                >
                  View Document
                </button>
                <button 
                  onClick={() => deleteResume(resume.id)}
                  className="shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md border border-transparent hover:border-red-100 dark:hover:border-red-900/50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return format(new Date(iso), 'MMM dd, yyyy \u2022 HH:mm');
  } catch(e) { return 'Unknown Date'; }
}
