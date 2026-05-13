import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const PROVIDER_MODELS = {
  gemini: ['gemini-3.1-pro-preview', 'gemini-2.5-pro', 'gemini-1.5-pro', 'gemini-2.5-flash'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-405b-reasoning', 'llama-3.1-8b-instant', 'deepseek-r1-distill-llama-70b', 'deepseek-r1-distill-qwen-32b', 'gpt-oss-120b', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
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

interface State {
  profile: ProfileData;
  apiKeys: ApiKeys;
  resumes: GeneratedResume[];
  preferences: AppPreferences;
  
  // Actions
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;

  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  addMiscItem: (item: Omit<MiscItem, 'id'>) => void;
  updateMiscItem: (id: string, item: Partial<MiscItem>) => void;
  deleteMiscItem: (id: string) => void;

  updateApiKeys: (keys: Partial<ApiKeys>) => void;
  saveResume: (resume: Omit<GeneratedResume, 'id' | 'createdAt'>) => void;
  deleteResume: (id: string) => void;

  importData: (data: any) => void;
  mergeProfileData: (data: any) => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
}

const defaultPersonalInfo: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
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
          
          const mergeByFields = (existingArray: any[], newArray: any[], fields: string[]) => {
            const merged = [...existingArray];
            for (const newItem of newArray) {
              const isDuplicate = merged.some(existingItem => 
                fields.every(field => 
                  String(existingItem[field] || '').toLowerCase().trim() === String(newItem[field] || '').toLowerCase().trim()
                )
              );
              if (!isDuplicate) {
                merged.push({ ...newItem, id: newItem.id || uuidv4() });
              }
            }
            return merged;
          };

          const mergeSkills = (existingSkills: Skill[], newSkills: Skill[]) => {
            const merged = [...existingSkills];
            for (const newSkill of newSkills) {
              const existingIndex = merged.findIndex(s => s.category.toLowerCase().trim() === newSkill.category.toLowerCase().trim());
              if (existingIndex >= 0) {
                const existingItems = merged[existingIndex].items.map(i => i.toLowerCase().trim());
                const nonDuplicateItems = newSkill.items.filter(i => !existingItems.includes(i.toLowerCase().trim()));
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
    }),
    {
      name: 'skilldb-storage',
    }
  )
);
