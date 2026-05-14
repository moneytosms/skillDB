import { useState, useEffect } from 'react';
import { useStore, AppPreferences, PROVIDER_MODELS, ApiKeyItem } from '../store/useStore';
import { Download, Upload, Save, Shield, FileJson, Moon, Sun, Cpu, AlertTriangle, Plus, Trash2, Key, Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const migrateToStructured = (apiKeysParam: any) => {
  const defaultKeys: any = { gemini: [], openai: [], anthropic: [], groq: [] };
  for (const key of ['gemini', 'openai', 'anthropic', 'groq']) {
      const val = apiKeysParam[key];
      if (typeof val === 'string') {
        defaultKeys[key] = val.split(',').map(k => k.trim()).filter(k => k.length > 0).map(k => ({ id: uuidv4(), name: 'Legacy Key', key: k }));
      } else if (Array.isArray(val)) {
        defaultKeys[key] = val;
      }
  }
  return defaultKeys;
};

export default function Settings() {
  const { apiKeys, updateApiKeys, profile, resumes, importData, preferences, updatePreferences, resetStore } = useStore();
  const [keysState, setKeysState] = useState<Record<string, ApiKeyItem[]>>(migrateToStructured(apiKeys));
  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addKey = () => {
    setKeysState(prev => ({
      ...prev,
      [activeProvider]: [...prev[activeProvider], { id: uuidv4(), name: `Key ${prev[activeProvider].length + 1}`, key: '' }]
    }));
  };

  const removeKey = (id: string) => {
    setKeysState(prev => ({
      ...prev,
      [activeProvider]: prev[activeProvider].filter((k: ApiKeyItem) => k.id !== id)
    }));
  };

  const updateKey = (id: string, field: 'name' | 'key', value: string) => {
    setKeysState(prev => ({
      ...prev,
      [activeProvider]: prev[activeProvider].map((k: ApiKeyItem) => k.id === id ? { ...k, [field]: value } : k)
    }));
  };

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
          setKeysState(migrateToStructured(json.apiKeys || { gemini: '', openai: '', anthropic: '', groq: '' }));
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

  const handleReset = () => {
    if (window.confirm('Are you absolutely sure you want to delete ALL data? This includes your profile, resumes, API keys, and backups. This action cannot be undone.')) {
      resetStore();
      setKeysState(migrateToStructured({ gemini: '', openai: '', anthropic: '', groq: '' }));
      alert('All data has been reset.');
    }
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
          <Key className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl font-semibold">API Keys (Local Storage)</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your keys are saved directly in your browser's local storage. We highly <strong className="text-black dark:text-white font-semibold">recommend adding multiple API keys per provider</strong> to enable auto-rotation. If one key hits a rate limit or depletes credits, the app will automatically try the next one!
        </p>

        <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
          {/* Sidebar for selecting providers */}
          <div className="md:w-48 flex-shrink-0 flex flex-col gap-2">
             {[
               { id: 'gemini', label: 'Google Gemini' },
               { id: 'openai', label: 'OpenAI' },
               { id: 'anthropic', label: 'Anthropic' },
               { id: 'groq', label: 'Groq (Llama)' }
             ].map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setActiveProvider(provider.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeProvider === provider.id ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  {provider.label}
                </button>
             ))}
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-medium capitalize">{activeProvider} Keys</h3>
               <button 
                 onClick={addKey}
                 className="flex items-center gap-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white px-3 py-1.5 rounded-md transition-colors"
               >
                 <Plus size={16} /> Add Key
               </button>
            </div>
            
            <div className="space-y-3 mb-6 flex-1 max-h-[300px] overflow-y-auto pr-2">
              {keysState[activeProvider]?.length === 0 ? (
                 <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                   <p className="text-gray-500 dark:text-gray-400 text-sm">No keys added for {activeProvider} yet.</p>
                 </div>
              ) : (
                keysState[activeProvider]?.map((k) => (
                  <div key={k.id} className="flex gap-3 bg-gray-50 dark:bg-[#111111] border border-[#E5E5E5] dark:border-gray-800 rounded-lg p-3 group items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={k.name}
                          onChange={(e) => updateKey(k.id, 'name', e.target.value)}
                          placeholder="e.g. Free Tier Key 1"
                          className="w-1/3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1A1A] rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <div className="relative flex-1">
                          <input 
                            type={visibleKeys[k.id] ? "text" : "password"}
                            value={k.key}
                            onChange={(e) => updateKey(k.id, 'key', e.target.value)}
                            placeholder="API Key..."
                            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1A1A] rounded-md p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                          />
                          <button
                            onClick={() => toggleKeyVisibility(k.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            {visibleKeys[k.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeKey(k.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                onClick={handleSaveKeys}
                className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Save size={16} /> Save All Keys
              </button>
            </div>
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

      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-500">Danger Zone</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Irreversible actions to clear your data from this browser.
        </p>

        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-red-900 dark:text-red-400 text-lg">Clear All Data</h3>
            <p className="text-sm text-red-700 dark:text-red-500/80 mt-1">
              Delete your profile, resumes, settings, and API keys. This cannot be undone.
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors shrink-0 text-sm font-medium"
          >
            <AlertTriangle size={16} /> Reset Everything
          </button>
        </div>
      </section>
    </div>
  );
}
