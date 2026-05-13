import { useState, useRef, useEffect } from 'react';
import { useStore, PROVIDER_MODELS, AppPreferences } from '../store/useStore';
import { ChatMessage, chatWithCoach } from '../lib/ai';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

export default function InterviewChat() {
  const { profile, preferences, updatePreferences } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm your AI Interview Coach. I've reviewed your profile and experience. What kind of role are you preparing for, or do you have a specific interview question you'd like to practice?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AppPreferences['aiProvider'];
    const defaultModelForProvider = PROVIDER_MODELS[newProvider][0];
    updatePreferences({ aiProvider: newProvider, aiModel: defaultModelForProvider });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const profileContext = JSON.stringify(profile, null, 2);
      const assistantReply = await chatWithCoach(newMessages, profileContext);
      
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    } catch (error: any) {
      setMessages([...newMessages, { role: 'assistant', content: `**Error:** ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh)] w-full max-w-4xl mx-auto md:p-6 p-0">
      <div className="bg-white dark:bg-[#1A1A1A] border-b md:border border-gray-200 dark:border-gray-800 md:rounded-t-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-gray-100">Interview Coach</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Practice questions tailored to your profile</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={preferences.aiProvider}
            onChange={handleProviderChange}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="groq">Groq (Llama)</option>
          </select>
          <select 
            value={preferences.aiModel || PROVIDER_MODELS[preferences.aiProvider]?.[0]}
            onChange={(e) => updatePreferences({ aiModel: e.target.value })}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-32 truncate"
          >
            {PROVIDER_MODELS[preferences.aiProvider]?.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-[#0A0A0A] md:border-x border-gray-200 dark:border-gray-800 space-y-6">
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex max-w-[85%] md:max-w-[75%] gap-3",
              message.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                {message.role === 'user' ? (
                  <div className="bg-gray-200 dark:bg-gray-700 w-full h-full rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                  </div>
                ) : (
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-full h-full rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl",
                message.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-sm" 
                  : "bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] md:max-w-[75%] gap-3 flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-900/30">
                <Bot size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Coach is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] border-t md:border border-gray-200 dark:border-gray-800 md:rounded-b-2xl p-4 shadow-sm z-10 pb-8 md:pb-4 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {messages.length === 1 && [
            "Ask me a behavioral question",
            "What are my strengths?",
            "Any resume gaps to address?",
            "Help me introduce myself"
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInput(prompt)}
              className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
          {messages.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    role: 'assistant',
                    content: "Hi there! I'm your AI Interview Coach. I've reviewed your profile and experience. What kind of role are you preparing for, or do you have a specific interview question you'd like to practice?"
                  }
                ]);
                setInput('');
              }}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap ml-auto"
            >
              Reset Chat
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 relative items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your answer, or ask a question..."
            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white resize-none min-h-[52px] max-h-32"
            rows={1}
            style={{ height: 'auto' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-[52px] w-[52px] flex items-center justify-center"
          >
            <Send size={20} className={cn(input.trim() && !isLoading ? 'ml-1' : '')} />
          </button>
        </form>
        <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          AI can make mistakes. Practice your answers carefully.
        </div>
      </div>
    </div>
  );
}
