import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { extractProfileFromText } from '../../lib/ai';
import { Sparkles, Loader2, UploadCloud, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export function MagicImport() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { mergeProfileData, preferences, profile } = useStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          extractedText += strings.join(' ') + '\\n';
        }
        setText(extractedText);
      } else {
        const fileText = await file.text();
        setText(fileText);
      }
    } catch (err: any) {
      setError('Failed to extract text from file: ' + err.message);
    } finally {
      setLoading(false);
    }
    
    event.target.value = '';
  };

  const handleExtract = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await extractProfileFromText(text, profile);
      mergeProfileData(data);
      setSuccess(true);
      setText(''); // clear text after successful import
    } catch (err: any) {
      setError(err.message || 'Failed to extract data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="text-amber-500" size={20} /> Magic Import
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload your Resume PDF or LinkedIn Profile PDF, or simply paste the text below. 
          We'll use AI to parse it and populate your vault automatically.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400 rounded-md mb-4 text-sm font-medium">
          Successfully imported data to your profile vault! Check the other tabs to review.
        </div>
      )}

      <div className="mb-6">
        <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-[#141414] border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl appearance-none cursor-pointer hover:border-blue-400 focus:outline-none hover:bg-blue-50 dark:hover:bg-blue-900/10">
          <span className="flex items-center space-x-2">
            <UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Drop resume PDF, or click to browse
            </span>
          </span>
          <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-gray-500" />
          <span className="text-sm font-medium">Or paste text</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste resume content or LinkedIn experience here..."
          className="w-full h-48 p-4 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none font-mono text-sm dark:text-gray-300 dark:placeholder-gray-600"
        ></textarea>
      </div>

      <button
        onClick={handleExtract}
        disabled={loading || !text.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
      >
          {loading ? (
          <><Loader2 className="animate-spin" size={18} /> Processing...</>
        ) : (
          <>{`Extract & Merge Profile (${preferences.aiProvider})`}</>
        )}
      </button>
    </div>
  );
}
