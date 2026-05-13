import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { User, Briefcase, GraduationCap, Code, PenTool, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const { profile, resumes } = useStore();
  const { personalInfo, experience, projects, education, skills } = profile;

  return (
    <div className="p-8 max-w-5xl mx-auto dark:text-gray-100">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back, {personalInfo.name || 'User'}</h1>
        <p className="text-gray-500 dark:text-gray-400">Here is a snapshot of your local career vault.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Briefcase />} title="Experiences" value={experience.length} to="/profile?tab=experience" />
        <StatCard icon={<Code />} title="Projects" value={projects.length} to="/profile?tab=projects" />
        <StatCard icon={<GraduationCap />} title="Education" value={education.length} to="/profile?tab=education" />
        <StatCard icon={<PenTool />} title="Skill Groups" value={skills.length} to="/profile?tab=skills" />
        <StatCard icon={<User />} title="Profile Completeness" value={calculateCompleteness(profile)} to="/profile" />
        <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <ExternalLink size={16} /> Generated Resumes
            </div>
            <div className="text-4xl font-light">{resumes.length}</div>
          </div>
          <Link to="/history" className="text-sm text-blue-600 hover:text-blue-500 hover:underline mt-4">View History &rarr;</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Quick Generator</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Need a resume right now? Jump straight to the builder to paste a job description and leverage AI.</p>
        <Link to="/builder" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          Start Resume Builder
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, to }: { icon: React.ReactNode, title: string, value: number | string, to: string }) {
  return (
    <Link to={to} className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-black dark:hover:border-gray-400 transition-colors shadow-sm block group">
      <div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
          <span className="group-hover:text-black dark:group-hover:text-white transition-colors">{icon}</span> {title}
        </div>
        <div className="text-4xl font-light">{value}</div>
      </div>
      <div className="text-sm text-gray-400 dark:text-gray-500 mt-4 group-hover:text-black dark:group-hover:text-white transition-colors">Manage &rarr;</div>
    </Link>
  );
}

function calculateCompleteness(profile: any) {
  let score = 0;
  if (profile.personalInfo.name) score += 20;
  if (profile.personalInfo.email) score += 10;
  if (profile.experience.length > 0) score += 30;
  if (profile.projects.length > 0) score += 20;
  if (profile.education.length > 0) score += 10;
  if (profile.skills.length > 0) score += 10;
  return `${score}%`;
}
