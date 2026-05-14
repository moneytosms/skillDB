import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const PROVIDER_MODELS = {
  gemini: ['gemini-3.1-pro-preview', 'gemini-2.5-pro', 'gemini-1.5-pro', 'gemini-2.5-flash'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'meta-llama/llama-4-scout-17b-16e-instant', 'groq/compound', 'qwen-2.5-coder-32b', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  anthropic: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  cgpa?: string;
  percentage?: string;
};

export type Skill = {
  id: string;
  category: string;
  items: string[];
};

export type MiscItem = {
  id: string;
  type: string; // e.g., Volunteer, Award, Certification
  title: string;
  subtitle: string;
  date: string;
  description: string;
};

export type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  leetcode: string;
  codeforces: string;
  summary: string;
};

export type ProfileData = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];
  miscellaneous: MiscItem[];
};

export type ApiKeys = {
  gemini: string;
  openai: string;
  anthropic: string;
  groq: string;
};

export type AppPreferences = {
  theme: 'light' | 'dark';
  aiProvider: 'gemini' | 'groq' | 'openai' | 'anthropic';
  aiModel: string;
};

export type GeneratedResume = {
  id: string;
  jobDescription: string;
  content: string; // JSON string of tailored profile
  createdAt: string;
};

export type ProfileBackup = {
  id: string;
  timestamp: string;
  profile: ProfileData;
};

interface State {
  profile: ProfileData;
  apiKeys: ApiKeys;
  resumes: GeneratedResume[];
  preferences: AppPreferences;
  backups: ProfileBackup[];
  
  // Actions
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  moveExperience: (id: string, direction: 'up' | 'down') => void;

  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProject: (id: string, direction: 'up' | 'down') => void;

  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  moveEducation: (id: string, direction: 'up' | 'down') => void;

  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  moveSkill: (id: string, direction: 'up' | 'down') => void;

  addMiscItem: (item: Omit<MiscItem, 'id'>) => void;
  updateMiscItem: (id: string, item: Partial<MiscItem>) => void;
  deleteMiscItem: (id: string) => void;
  moveMiscItem: (id: string, direction: 'up' | 'down') => void;

  updateApiKeys: (keys: Partial<ApiKeys>) => void;
  saveResume: (resume: Omit<GeneratedResume, 'id' | 'createdAt'>) => void;
  deleteResume: (id: string) => void;

  importData: (data: any) => void;
  mergeProfileData: (data: any) => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  
  createBackup: () => void;
  restoreBackup: (id: string) => void;
  deleteBackup: (id: string) => void;
  resetStore: () => void;
}

const defaultPersonalInfo: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  leetcode: '',
  codeforces: '',
  summary: '',
};

const moveItem = <T extends { id: string }>(array: T[], id: string, direction: 'up' | 'down'): T[] => {
  const idx = array.findIndex(i => i.id === id);
  if (idx < 0) return array;
  if (direction === 'up' && idx > 0) {
    const newArr = [...array];
    [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
    return newArr;
  }
  if (direction === 'down' && idx < array.length - 1) {
    const newArr = [...array];
    [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
    return newArr;
  }
  return array;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      profile: {
        personalInfo: defaultPersonalInfo,
        experience: [],
        projects: [],
        education: [],
        skills: [],
        miscellaneous: [],
      },
      apiKeys: {
        gemini: '',
        openai: '',
        anthropic: '',
        groq: '',
      },
      preferences: {
        theme: 'light',
        aiProvider: 'gemini',
        aiModel: 'gemini-2.5-pro',
      },
      resumes: [],
      backups: [],

      updatePersonalInfo: (data) =>
        set((state) => ({
          profile: {
            ...state.profile,
            personalInfo: { ...state.profile.personalInfo, ...data },
          },
        })),

      addExperience: (exp) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experience: [...state.profile.experience, { ...exp, id: uuidv4() }],
          },
        })),
      updateExperience: (id, exp) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experience: state.profile.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
          },
        })),
      deleteExperience: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experience: state.profile.experience.filter((e) => e.id !== id),
          },
        })),
      moveExperience: (id, direction) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experience: moveItem(state.profile.experience, id, direction),
          },
        })),

      addProject: (proj) =>
        set((state) => ({
          profile: {
            ...state.profile,
            projects: [...state.profile.projects, { ...proj, id: uuidv4() }],
          },
        })),
      updateProject: (id, proj) =>
        set((state) => ({
          profile: {
            ...state.profile,
            projects: state.profile.projects.map((p) => (p.id === id ? { ...p, ...proj } : p)),
          },
        })),
      deleteProject: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            projects: state.profile.projects.filter((p) => p.id !== id),
          },
        })),
      moveProject: (id, direction) =>
        set((state) => ({
          profile: {
            ...state.profile,
            projects: moveItem(state.profile.projects, id, direction),
          },
        })),

      addEducation: (edu) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: [...state.profile.education, { ...edu, id: uuidv4() }],
          },
        })),
      updateEducation: (id, edu) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: state.profile.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
          },
        })),
      deleteEducation: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: state.profile.education.filter((e) => e.id !== id),
          },
        })),
      moveEducation: (id, direction) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: moveItem(state.profile.education, id, direction),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: [...state.profile.skills, { ...skill, id: uuidv4() }],
          },
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: state.profile.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
          },
        })),
      deleteSkill: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: state.profile.skills.filter((s) => s.id !== id),
          },
        })),
      moveSkill: (id, direction) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: moveItem(state.profile.skills, id, direction),
          },
        })),

      addMiscItem: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            miscellaneous: [...state.profile.miscellaneous, { ...item, id: uuidv4() }],
          },
        })),
      updateMiscItem: (id, item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            miscellaneous: state.profile.miscellaneous.map((m) => (m.id === id ? { ...m, ...item } : m)),
          },
        })),
      deleteMiscItem: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            miscellaneous: state.profile.miscellaneous.filter((m) => m.id !== id),
          },
        })),
      moveMiscItem: (id, direction) =>
        set((state) => ({
          profile: {
            ...state.profile,
            miscellaneous: moveItem(state.profile.miscellaneous, id, direction),
          },
        })),

      updateApiKeys: (keys) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, ...keys },
        })),

      updatePreferences: (prefs) => 
        set((state) => {
          const newPrefs = { ...state.preferences, ...prefs };
          if (newPrefs.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { preferences: newPrefs };
        }),

      saveResume: (resume) =>
        set((state) => ({
          resumes: [
            { ...resume, id: uuidv4(), createdAt: new Date().toISOString() },
            ...state.resumes,
          ],
        })),
      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
        })),

      importData: (data) =>
        set((state) => ({
          profile: data.profile || state.profile,
          apiKeys: data.apiKeys || state.apiKeys,
          resumes: data.resumes || state.resumes,
        })),

      mergeProfileData: (data) =>
        set((state) => {
          const p = state.profile;
          
          const isSimilar = (s1: string, s2: string) => {
            if (!s1 && !s2) return true;
            if (!s1 || !s2) return false;
            
            const norm1 = s1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
            const norm2 = s2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
            
            // exact or substring on compressed
            const comp1 = norm1.replace(/\s+/g, '');
            const comp2 = norm2.replace(/\s+/g, '');
            if (comp1 === comp2) return true;
            if (comp1.includes(comp2) || comp2.includes(comp1)) return true;
            
            const tokens1 = new Set(norm1.split(/\s+/).filter(Boolean));
            const tokens2 = new Set(norm2.split(/\s+/).filter(Boolean));
            
            if (tokens1.size === 0 || tokens2.size === 0) return false;
            
            let intersection = 0;
            for (const t of tokens1) {
              if (tokens2.has(t)) intersection++;
            }
            
            const minTokens = Math.min(tokens1.size, tokens2.size);
            if (intersection / minTokens >= 0.6) return true;
            
            return false;
          };

          const mergeByFields = (existingArray: any[], newArray: any[], fields: string[]) => {
            const merged = [...existingArray];
            for (const newItem of newArray) {
              const duplicateIndex = merged.findIndex(existingItem => 
                fields.every(field => isSimilar(String(existingItem[field] || ''), String(newItem[field] || '')))
              );

              if (duplicateIndex !== -1) {
                // Merge the items
                const existing = merged[duplicateIndex];
                
                // For strings, take the longer one or merge logic
                const mergedItem = { ...existing };
                
                Object.keys(newItem).forEach(key => {
                  if (key === 'id') return;
                  if (Array.isArray(existing[key]) && Array.isArray(newItem[key])) {
                     // Union arrays (e.g. bullets or technologies)
                     const combined = [...existing[key]];
                     newItem[key].forEach((item: any) => {
                       const itemStr = String(item);
                       if (!combined.some(c => isSimilar(String(c), itemStr))) {
                         combined.push(item);
                       }
                     });
                     mergedItem[key] = combined;
                  } else if (typeof existing[key] === 'string' && typeof newItem[key] === 'string') {
                     // Take the longer string
                     if ((newItem[key] as string).length > (existing[key] as string).length) {
                       mergedItem[key] = newItem[key];
                     }
                  } else if (!existing[key] && newItem[key]) {
                     mergedItem[key] = newItem[key];
                  }
                });

                merged[duplicateIndex] = mergedItem;
              } else {
                merged.push({ ...newItem, id: newItem.id || uuidv4() });
              }
            }
            return merged;
          };

          const mergeSkills = (existingSkills: Skill[], newSkills: Skill[]) => {
            const merged = [...existingSkills];
            for (const newSkill of newSkills) {
              const existingIndex = merged.findIndex(s => isSimilar(s.category, newSkill.category));
              if (existingIndex >= 0) {
                const nonDuplicateItems = newSkill.items.filter(newItem => 
                  !merged[existingIndex].items.some(existingItem => isSimilar(existingItem, newItem))
                );
                merged[existingIndex] = {
                  ...merged[existingIndex],
                  items: [...merged[existingIndex].items, ...nonDuplicateItems]
                };
              } else {
                merged.push({ ...newSkill, id: newSkill.id || uuidv4() });
              }
            }
            return merged;
          };

          return {
            profile: {
              personalInfo: {
                ...p.personalInfo,
                ...(data.personalInfo || {})
              },
              experience: data.experience ? mergeByFields(p.experience, data.experience, ['company', 'role']) : p.experience,
              education: data.education ? mergeByFields(p.education, data.education, ['institution', 'degree']) : p.education,
              projects: data.projects ? mergeByFields(p.projects, data.projects, ['name']) : p.projects,
              skills: data.skills ? mergeSkills(p.skills, data.skills) : p.skills,
              miscellaneous: data.miscellaneous ? mergeByFields(p.miscellaneous || [], data.miscellaneous, ['title', 'type']) : (p.miscellaneous || []),
            }
          };
        }),
      
      createBackup: () => 
        set((state) => {
          const newBackup: ProfileBackup = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            profile: JSON.parse(JSON.stringify(state.profile))
          };
          const newBackups = [newBackup, ...(state.backups || [])].slice(0, 5); // Keep max 5
          return { backups: newBackups };
        }),
        
      restoreBackup: (id: string) => 
        set((state) => {
          const backup = (state.backups || []).find(b => b.id === id);
          if (backup) {
            return { profile: JSON.parse(JSON.stringify(backup.profile)) };
          }
          return state;
        }),
        
      deleteBackup: (id: string) =>
        set((state) => ({
          backups: (state.backups || []).filter((b) => b.id !== id),
        })),
        
      resetStore: () =>
        set((state) => ({
          profile: {
            personalInfo: defaultPersonalInfo,
            experience: [],
            projects: [],
            education: [],
            skills: [],
            miscellaneous: [],
          },
          apiKeys: {
            gemini: '',
            openai: '',
            anthropic: '',
            groq: '',
          },
          preferences: {
            theme: 'light',
            aiProvider: 'gemini',
            aiModel: 'gemini-2.5-pro',
          },
          resumes: [],
          backups: [],
        })),
    }),
    {
      name: 'skilldb-storage',
    }
  )
);
