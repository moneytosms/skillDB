import { useState, useEffect } from 'react';
import { useStore, AppPreferences, PROVIDER_MODELS } from '../store/useStore';
import { Download, Upload, Save, Shield, FileJson, Moon, Sun, Cpu } from 'lucide-react';

export default function Settings() {
  const { apiKeys, updateApiKeys, profile, resumes, importData, preferences, updatePreferences } = useStore();
  const [keysState, setKeysState] = useState(apiKeys);

  const handleSaveKeys = () => {
    updateApiKeys(keysState);
    alert('API Keys saved locally.');
  };

  const handleExport = () => {
    const data = { profile, apiKeys, resumes, preferences };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skilldb-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (window.confirm('Are you sure you want to overwrite your current data? This cannot be undone.')) {
          importData(json);
          setKeysState(json.apiKeys || { gemini: '', openai: '', anthropic: '', groq: '' });
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AppPreferences['aiProvider'];
    const defaultModelForProvider = PROVIDER_MODELS[newProvider][0];
    updatePreferences({ aiProvider: newProvider, aiModel: defaultModelForProvider });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto dark:text-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your local vault, providers, and app preferences.</p>
      </header>
      
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select light or dark interface.</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button 
                onClick={() => updatePreferences({ theme: 'light' })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${preferences.theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Sun size={16} /> Light
              </button>
              <button 
                onClick={() => updatePreferences({ theme: 'dark' })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${preferences.theme === 'dark' ? 'bg-black text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div>
              <h3 className="font-medium">AI Provider</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose which model to generate your resumes.</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <select 
                value={preferences.aiProvider}
                onChange={handleProviderChange}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="groq">Groq (Llama)</option>
              </select>

              <select 
                value={preferences.aiModel || PROVIDER_MODELS[preferences.aiProvider]?.[0]}
                onChange={(e) => updatePreferences({ aiModel: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {PROVIDER_MODELS[preferences.aiProvider]?.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl font-semibold">API Keys (Local Storage)</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your keys are saved directly in your browser's local storage. They are never sent to our servers. Because this app is fully local, you own your data.
        </p>

        <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gemini API Key</label>
            <input 
              type="password" 
              value={keysState.gemini || ''} 
              onChange={(e) => setKeysState({...keysState, gemini: e.target.value})}
              placeholder="AIzaSy..."
              className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-md p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
            <input 
              type="password" 
              value={keysState.openai || ''} 
              onChange={(e) => setKeysState({...keysState, openai: e.target.value})}
              placeholder="sk-proj-..."
              className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-md p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Anthropic API Key</label>
            <input 
              type="password" 
              value={keysState.anthropic || ''} 
              onChange={(e) => setKeysState({...keysState, anthropic: e.target.value})}
              placeholder="sk-ant-..."
              className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-md p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Groq API Key</label>
            <input 
              type="password" 
              value={keysState.groq || ''} 
              onChange={(e) => setKeysState({...keysState, groq: e.target.value})}
              placeholder="gsk_..."
              className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-md p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button 
              onClick={handleSaveKeys}
              className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Save size={16} /> Save Keys
            </button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <FileJson className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl font-semibold">Data Portable Vault</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Export your entire profile, experience, and history as a JSON file. You can import it later on another device or browser.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col items-start gap-4">
            <div>
              <h3 className="font-medium text-lg">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Download your vault to your computer.</p>
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 border border-black dark:border-white text-black dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full justify-center text-sm font-medium"
            >
              <Download size={16} /> Export JSON
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col items-start gap-4">
            <div>
              <h3 className="font-medium text-lg">Import Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Restore your vault from a JSON file.</p>
            </div>
            <label className="flex items-center gap-2 border border-black dark:border-white text-black dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full justify-center text-sm font-medium cursor-pointer">
              <Upload size={16} /> Import JSON
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={handleImport}
              />
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl font-semibold">Auto-Backups</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The app automatically saves a backup of your profile right before you do a Magic Import. If something doesn't look right, you can restore a previous version from here.
        </p>

        <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-start gap-2">
          {!(useStore((state) => state.backups)?.length > 0) ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No backups available yet. Try using Magic Import!</p>
          ) : (
             <div className="w-full flex flex-col gap-2">
                {useStore((state) => state.backups)?.map(backup => (
                   <div key={backup.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg gap-3">
                      <div>
                        <p className="text-sm font-medium">Backup Tool</p>
                        <p className="text-xs text-gray-500">{new Date(backup.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                         <button 
                           className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors font-medium"
                           onClick={() => {
                             if(window.confirm('Are you sure you want to restore this backup? Your current profile will be overwritten.')) {
                               useStore.getState().restoreBackup(backup.id);
                               alert('Backup restored!');
                             }
                           }}
                         >
                           Restore
                         </button>
                         <button 
                           className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors"
                           onClick={() => {
                              useStore.getState().deleteBackup(backup.id)
                           }}
                         >
                           Delete
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
