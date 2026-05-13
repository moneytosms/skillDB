import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { MagicImport } from '../components/profile/MagicImport';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('magic');

  const tabs = [
    { id: 'magic', label: '✨ Magic Import' },
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'misc', label: 'Miscellaneous' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-8 dark:text-gray-100">
      {/* Sidebar Nav */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Profile</h1>
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 font-medium">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-left rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
        {activeTab === 'magic' && <MagicImport />}
        {activeTab === 'personal' && <PersonalInfoForm />}
        {activeTab === 'experience' && <ExperienceManager />}
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'education' && <EducationManager />}
        {activeTab === 'skills' && <SkillManager />}
        {activeTab === 'misc' && <MiscManager />}
      </div>
    </div>
  );
}

function PersonalInfoForm() {
  const { profile, updatePersonalInfo } = useStore();
  const [info, setInfo] = useState(profile.personalInfo);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updatePersonalInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
          <input type="text" value={info.name} onChange={e => setInfo({...info, name: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Job Title / Headline</label>
          <input type="text" value={info.summary} onChange={e => setInfo({...info, summary: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" placeholder="e.g. Senior Software Engineer" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
          <input type="email" value={info.email} onChange={e => setInfo({...info, email: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone</label>
          <input type="tel" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location</label>
          <input type="text" value={info.location} onChange={e => setInfo({...info, location: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" placeholder="City, Country" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Website</label>
          <input type="url" value={info.website} onChange={e => setInfo({...info, website: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">LinkedIn</label>
          <input type="url" value={info.linkedin} onChange={e => setInfo({...info, linkedin: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">GitHub</label>
          <input type="url" value={info.github} onChange={e => setInfo({...info, github: e.target.value})} className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" />
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 dark:border-gray-800 pt-4">
        <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
          {saved ? <><Check size={16} /> Saved</> : 'Save Info'}
        </button>
      </div>
    </div>
  );
}

// Simple implementations for others to fit in a single file
function ExperienceManager() {
  const { profile, addExperience, deleteExperience } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });

  const handleAdd = () => {
    addExperience(form);
    setIsAdding(false);
    setForm({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
        <h2 className="text-xl font-semibold dark:text-gray-100">Experience</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium text-black">
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30 dark:bg-transparent">
        {isAdding && (
          <div className="bg-white dark:bg-[#141414] border text-sm border-gray-200 dark:border-gray-800 p-5 rounded-lg mb-6 shadow-sm">
             <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Company</label><input value={form.company} onChange={e=>setForm({...form, company: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
              <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Role</label><input value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
              <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Start Date</label><input type="month" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
              <div>
                <label className="block text-xs font-medium mb-1 dark:text-gray-300">End Date</label>
                <div className="flex gap-2 items-center">
                  <input type="month" disabled={form.current} value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 disabled:opacity-50" />
                  <label className="flex items-center gap-1 whitespace-nowrap dark:text-gray-300"><input type="checkbox" checked={form.current} onChange={e=>setForm({...form, current: e.target.checked})} /> Current</label>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1 dark:text-gray-300">Description (Bullets, Markdown supported)</label>
                <textarea rows={4} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 font-mono text-sm" placeholder="- Built scalable APIs using Node.js..." />
              </div>
            </div>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full font-medium hover:bg-blue-700">Save Experience</button>
          </div>
        )}

        <div className="space-y-4">
          {profile.experience.map(exp => (
            <div key={exp.id} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-5 rounded-lg flex flex-col shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg dark:text-gray-100">{exp.role} <span className="text-gray-400 dark:text-gray-500 font-normal">at</span> {exp.company}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1 mt-1"><Calendar size={14} /> {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                <button onClick={() => deleteExperience(exp.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
              </div>
              <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
          {profile.experience.length === 0 && !isAdding && (
            <div className="text-center text-gray-400 dark:text-gray-600 p-8 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800">No experience added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM yyyy');
  } catch(e) { return dateString; }
}

function ProjectManager() {
  const { profile, addProject, deleteProject } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', link: '', technologies: '' });

  const handleAdd = () => {
    addProject({ ...form, technologies: form.technologies.split(',').map(s=>s.trim()).filter(Boolean) });
    setIsAdding(false);
    setForm({ name: '', description: '', link: '', technologies: '' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
        <h2 className="text-xl font-semibold dark:text-gray-100">Projects</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium text-black">
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30 dark:bg-transparent">
        {isAdding && (
          <div className="bg-white dark:bg-[#141414] border text-sm border-gray-200 dark:border-gray-800 p-5 rounded-lg mb-6 shadow-sm">
             <div className="space-y-4 mb-4">
              <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Project Name</label><input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
              <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Link (Optional)</label><input value={form.link} onChange={e=>setForm({...form, link: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
              <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Technologies (comma separated)</label><input value={form.technologies} onChange={e=>setForm({...form, technologies: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 font-mono text-xs" placeholder="React, Node.js, Python..." /></div>
              <div>
                <label className="block text-xs font-medium mb-1 dark:text-gray-300">Description</label>
                <textarea rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 text-sm" placeholder="What does this project do?" />
              </div>
            </div>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full font-medium hover:bg-blue-700">Save Project</button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {profile.projects.map(proj => (
            <div key={proj.id} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-5 rounded-lg flex flex-col shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg dark:text-gray-100">{proj.name}</h3>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{proj.link}</a>}
                </div>
                <button onClick={() => deleteProject(proj.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{proj.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {proj.technologies.map((tech, i) => <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded text-xs font-mono">{tech}</span>)}
              </div>
            </div>
          ))}
          {profile.projects.length === 0 && !isAdding && (
            <div className="text-center text-gray-400 dark:text-gray-600 p-8 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800">No projects added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function EducationManager() {
  const { profile, addEducation, deleteEducation } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ institution: '', degree: '', startDate: '', endDate: '', current: false });

  const handleAdd = () => {
    addEducation(form);
    setIsAdding(false);
    setForm({ institution: '', degree: '', startDate: '', endDate: '', current: false });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
        <h2 className="text-xl font-semibold dark:text-gray-100">Education</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium text-black">
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30 dark:bg-transparent">
        {isAdding && (
          <div className="bg-white dark:bg-[#141414] border text-sm border-gray-200 dark:border-gray-800 p-5 rounded-lg mb-6 shadow-sm space-y-4">
             <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Institution</label><input value={form.institution} onChange={e=>setForm({...form, institution: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
             <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Degree / Field of Study</label><input value={form.degree} onChange={e=>setForm({...form, degree: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" placeholder="e.g. B.S. Computer Science" /></div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Start Date</label><input type="month" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
               <div>
                  <label className="block text-xs font-medium mb-1 dark:text-gray-300">End Date</label>
                  <div className="flex gap-2 items-center">
                    <input type="month" disabled={form.current} value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 disabled:opacity-50" />
                    <label className="flex items-center gap-1 text-xs whitespace-nowrap dark:text-gray-300"><input type="checkbox" checked={form.current} onChange={e=>setForm({...form, current: e.target.checked})} /> Present</label>
                  </div>
               </div>
             </div>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full font-medium mt-2 hover:bg-blue-700">Save Education</button>
          </div>
        )}

        <div className="space-y-4">
          {profile.education.map(edu => (
            <div key={edu.id} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-5 rounded-lg flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-semibold text-lg dark:text-gray-100">{edu.degree}</h3>
                <div className="text-gray-700 dark:text-gray-300">{edu.institution}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1"><Calendar className="inline" size={14}/> {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</div>
              </div>
              <button onClick={() => deleteEducation(edu.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {profile.education.length === 0 && !isAdding && (
             <div className="text-center text-gray-400 dark:text-gray-600 p-8 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800">No education added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillManager() {
  const { profile, addSkill, deleteSkill } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ category: '', items: '' });

  const handleAdd = () => {
    addSkill({ category: form.category || 'General', items: form.items.split(',').map(s=>s.trim()).filter(Boolean) });
    setIsAdding(false);
    setForm({ category: '', items: '' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
        <h2 className="text-xl font-semibold dark:text-gray-100">Skills</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium text-black">
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add Group'}
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30 dark:bg-transparent">
        {isAdding && (
          <div className="bg-white dark:bg-[#141414] border text-sm border-gray-200 dark:border-gray-800 p-5 rounded-lg mb-6 shadow-sm space-y-4">
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Category (e.g. Languages, Frameworks)</label><input value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Skills (comma separated)</label><input value={form.items} onChange={e=>setForm({...form, items: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 font-mono text-xs" /></div>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full font-medium hover:bg-blue-700">Save Skills</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.skills.map(skill => (
            <div key={skill.id} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-xs">{skill.category}</h3>
                <button onClick={() => deleteSkill(skill.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 -mr-1.5 -mt-1.5 rounded transition-colors"><Trash2 size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, i) => <span key={i} className="px-2 py-1 bg-black text-white dark:bg-[#1A1A1A] dark:text-gray-200 rounded text-xs">{item}</span>)}
              </div>
            </div>
          ))}
          {profile.skills.length === 0 && !isAdding && (
            <div className="col-span-1 md:col-span-2 text-center text-gray-400 dark:text-gray-600 p-8 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800">No skills added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiscManager() {
  const { profile, addMiscItem, deleteMiscItem } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ type: 'Award', title: '', subtitle: '', date: '', description: '' });

  const handleAdd = () => {
    addMiscItem(form);
    setIsAdding(false);
    setForm({ type: 'Award', title: '', subtitle: '', date: '', description: '' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-semibold dark:text-gray-100">Miscellaneous</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Awards, Certifications, Volunteering, etc.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium text-black">
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30 dark:bg-transparent">
        {isAdding && (
          <div className="bg-white dark:bg-[#141414] border text-sm border-gray-200 dark:border-gray-800 p-5 rounded-lg mb-6 shadow-sm space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium mb-1 dark:text-gray-300">Type</label>
                   <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2">
                      <option>Award</option>
                      <option>Certification</option>
                      <option>Volunteering</option>
                      <option>Language</option>
                      <option>Other</option>
                   </select>
                </div>
                <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Title / Name</label><input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
                <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Subtitle (Issuer, Organization)</label><input value={form.subtitle} onChange={e=>setForm({...form, subtitle: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
                <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Date (Optional)</label><input type="month" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2" /></div>
             </div>
             <div>
                <label className="block text-xs font-medium mb-1 dark:text-gray-300">Description (Optional)</label>
                <textarea rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-[#1A1A1A] dark:text-gray-100 rounded p-2 text-sm max-h-32" />
             </div>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full font-medium mt-2 hover:bg-blue-700">Save Entry</button>
          </div>
        )}

        <div className="space-y-4">
          {profile.miscellaneous?.map(item => (
            <div key={item.id} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-5 rounded-lg flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">{item.type}</div>
                  <h3 className="font-semibold text-lg dark:text-gray-100">{item.title}</h3>
                  {item.subtitle && <div className="text-gray-700 dark:text-gray-300 text-sm mt-0.5">{item.subtitle}</div>}
                  {item.date && <div className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1"><Calendar className="inline mr-1" size={14}/>{formatDate(item.date)}</div>}
                </div>
                <button onClick={() => deleteMiscItem(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
              </div>
              {item.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">{item.description}</p>}
            </div>
          ))}
          {(!profile.miscellaneous || profile.miscellaneous.length === 0) && !isAdding && (
             <div className="text-center text-gray-400 dark:text-gray-600 p-8 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800">No items added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
