import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Code } from 'lucide-react';
import { cn } from '../lib/utils';

export type TemplateVariant = 'standard' | 'modern' | 'executive' | 'compact';
export type FontStyle = 'sans' | 'serif' | 'mono';

interface ResumeTemplateProps {
  content: string; // JSON string
  variant?: TemplateVariant;
  fontStyle?: FontStyle;
}

export function ResumeTemplate({ content, variant = 'standard', fontStyle = 'sans' }: ResumeTemplateProps) {
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return <div className="text-red-500">Failed to render resume. Invalid data format.</div>;
  }

  const { personalInfo = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], awards = [] } = data;

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'sans': default: return 'font-sans';
    }
  };

  const Header = () => {
    switch (variant) {
      case 'modern':
        return (
          <div className="mb-2 pb-2 border-b-2 border-gray-800">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight uppercase">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs mt-1 text-gray-600">
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={10}/> {personalInfo.location}</span>}
              {personalInfo.email && <span className="flex items-center gap-1"><Mail size={10}/> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={10}/> {personalInfo.phone}</span>}
              {personalInfo.linkedin && <a href={personalInfo.linkedin} className="flex items-center gap-1 text-gray-600"><Linkedin size={10}/> LinkedIn</a>}
              {personalInfo.github && <a href={personalInfo.github} className="flex items-center gap-1 text-gray-600"><Github size={10}/> GitHub</a>}
              {personalInfo.leetcode && <a href={personalInfo.leetcode} className="flex items-center gap-1 text-gray-600"><Code size={10}/> LeetCode</a>}
              {personalInfo.codeforces && <a href={personalInfo.codeforces} className="flex items-center gap-1 text-gray-600"><Code size={10}/> Codeforces</a>}
            </div>
          </div>
        );
      case 'executive':
        return (
          <div className="text-center mb-3 border-b border-black pb-2">
            <h1 className="text-2xl lg:text-3xl font-bold mb-1 tracking-wide uppercase">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-black">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.linkedin && <a href={personalInfo.linkedin}>LinkedIn</a>}
              {personalInfo.github && <a href={personalInfo.github}>GitHub</a>}
              {personalInfo.leetcode && <a href={personalInfo.leetcode}>LeetCode</a>}
              {personalInfo.codeforces && <a href={personalInfo.codeforces}>Codeforces</a>}
              {personalInfo.website && <a href={personalInfo.website}>Portfolio</a>}
            </div>
          </div>
        );
      case 'compact':
        return (
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold -mb-1">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[11px] mt-1 text-gray-800">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.linkedin && <a href={personalInfo.linkedin} className="text-black">LinkedIn</a>}
              {personalInfo.github && <a href={personalInfo.github} className="text-black">GitHub</a>}
              {personalInfo.leetcode && <a href={personalInfo.leetcode} className="text-black">LeetCode</a>}
              {personalInfo.codeforces && <a href={personalInfo.codeforces} className="text-black">Codeforces</a>}
              {personalInfo.website && <a href={personalInfo.website} className="text-black">Portfolio</a>}
            </div>
          </div>
        );
      case 'standard':
      default:
        return (
          <div className="text-center mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold -mb-1">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs mt-1 text-gray-800">
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={10}/> {personalInfo.location}</span>}
              {personalInfo.email && <span className="flex items-center gap-1"><Mail size={10}/> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={10}/> {personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs mt-0.5 text-gray-800">
              {personalInfo.linkedin && <a href={personalInfo.linkedin} className="flex items-center gap-1 text-blue-700"><Linkedin size={10}/> LinkedIn</a>}
              {personalInfo.github && <a href={personalInfo.github} className="flex items-center gap-1 text-blue-700"><Github size={10}/> GitHub</a>}
              {personalInfo.leetcode && <a href={personalInfo.leetcode} className="flex items-center gap-1 text-blue-700"><Code size={10}/> LeetCode</a>}
              {personalInfo.codeforces && <a href={personalInfo.codeforces} className="flex items-center gap-1 text-blue-700"><Code size={10}/> Codeforces</a>}
              {personalInfo.website && <a href={personalInfo.website} className="flex items-center gap-1 text-blue-700"><Globe size={10}/> Portfolio</a>}
            </div>
          </div>
        );
    }
  };

  const SectionHeader = ({ title }: { title: string }) => {
    switch (variant) {
      case 'modern':
        return <h2 className="text-xs font-bold tracking-wide text-gray-900 bg-gray-100 py-0.5 px-2 mb-1 uppercase">{title}</h2>;
      case 'executive':
        return <h2 className="text-[13px] font-bold tracking-widest text-black border-b border-black pb-0.5 mb-1 mt-2 uppercase">{title}</h2>;
      case 'compact':
        return <h2 className="text-[12px] font-bold tracking-tight text-black border-b border-gray-400 pb-0 mb-1 mt-1 uppercase">{title}</h2>;
      case 'standard':
      default:
        return (
          <div className="mb-1 mt-1.5">
            <h2 className="text-[12px] font-bold tracking-widest text-slate-900 border-b border-black pb-0.5 mb-1 uppercase">
              {title}
            </h2>
          </div>
        );
    }
  };

  const LayoutClass = variant === 'compact' 
    ? "bg-white p-[0.4in] max-w-[850px] mx-auto min-h-[11in] text-black shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-[8.5in] print:h-[11in] text-[12px] leading-tight"
    : "bg-white p-[0.5in] max-w-[850px] mx-auto min-h-[11in] text-black shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-[8.5in] print:h-[11in] text-[13px] leading-snug";

  return (
    <div className={cn(LayoutClass, getFontFamily())}>
      
      <Header />

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-1">
          <SectionHeader title="EXPERIENCE" />
          <div className={cn((variant === 'standard' || variant === 'compact') ? "pl-1" : "")}>
            {experience.map((exp: any, i: number) => (
              <div key={i} className={variant === 'compact' ? "mb-1" : "mb-2"}>
                <div className="flex justify-between font-bold">
                  <span>{exp.role} <span className="font-normal">— {exp.company}</span></span>
                  <span className="font-normal italic text-xs">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className={cn("list-dash pl-4 mt-0.5 space-y-0.5", variant === 'compact' ? "text-[11px]" : "text-xs")}>
                  {exp.description?.map((bullet: string, j: number) => (
                    <li key={j} className={cn("pl-1 relative before:absolute before:-left-3 before:top-0", variant === 'modern' ? "before:content-['•']" : "before:content-['–']")}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-1">
          <SectionHeader title="PROJECTS" />
          <div className={cn((variant === 'standard' || variant === 'compact') ? "pl-1" : "")}>
            {projects.map((proj: any, i: number) => (
              <div key={i} className={variant === 'compact' ? "mb-1" : "mb-1.5"}>
                <div className="flex justify-between font-bold">
                  <span>{proj.name} {proj.technologies && <span className="font-normal italic text-[11px] ml-1">({proj.technologies.join(', ')})</span>}</span>
                  {proj.link && <a href={proj.link} className="text-blue-700 font-normal underline text-[11px]">View</a>}
                </div>
                <div className={cn("mt-0", variant === 'compact' ? "text-[11px]" : "text-xs")}>
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-1">
          <SectionHeader title="EDUCATION" />
          <div className={cn((variant === 'standard' || variant === 'compact') ? "pl-1" : "")}>
            {education.map((edu: any, i: number) => (
              <div key={i} className={variant === 'compact' ? "mb-0.5" : "mb-1"}>
                <div className="flex justify-between font-bold">
                  <span>{edu.institution}</span>
                  <span className="font-normal italic text-xs">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn("italic", variant === 'compact' ? "text-[11px]" : "text-xs")}>{edu.degree}</span>
                  <span className="text-[11px]">{edu.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {Object.keys(skills || {}).length > 0 && (
        <div className="mb-1">
          <SectionHeader title="TECHNICAL SKILLS" />
          <div className={cn((variant === 'standard' || variant === 'compact') ? "pl-1" : "")}>
            <table className={cn("w-full", variant === 'compact' ? "text-[11px]" : "text-xs")}>
              <tbody>
                {Object.entries(skills).map(([category, items]: [string, any], i: number) => (
                  <tr key={i} className="align-top">
                    <td className="w-28 font-bold py-0 pr-2">{category}:</td>
                    <td className="py-0">{items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certifications and Awards */}
      {(certifications.length > 0 || awards.length > 0) && (
        <div className="mb-1">
          <SectionHeader title="AWARDS & CERTIFICATIONS" />
          <div className={cn((variant === 'standard' || variant === 'compact') ? "pl-1" : "")}>
            <ul className={cn("list-dash pl-4 space-y-0.5", variant === 'compact' ? "text-[11px]" : "text-xs")}>
              {awards.map((award: string, i: number) => (
                 <li key={`a-${i}`} className={cn("pl-1 relative before:absolute before:-left-3 before:top-0", variant === 'modern' ? "before:content-['•']" : "before:content-['–']")}>{award}</li>
              ))}
              {certifications.map((cert: any, i: number) => (
                 <li key={`c-${i}`} className={cn("pl-1 relative before:absolute before:-left-3 before:top-0", variant === 'modern' ? "before:content-['•']" : "before:content-['–']")}>
                   <span className="font-bold">{cert.name}</span> — {cert.issuer}
                   {cert.link && <a href={cert.link} className="text-blue-700 ml-2">Verify</a>}
                 </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
