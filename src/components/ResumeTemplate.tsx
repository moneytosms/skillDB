import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Code } from 'lucide-react';
import { cn } from '../lib/utils';

export type TemplateVariant = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type FontStyle = 'sans' | 'serif' | 'mono';

interface ResumeTemplateProps {
  content: string; // JSON string
  variant?: TemplateVariant;
  fontStyle?: FontStyle;
}

export function ResumeTemplate({ content, variant = '1', fontStyle = 'sans' }: ResumeTemplateProps) {
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return <div className="text-red-500">Failed to render resume. Invalid data format.</div>;
  }

  const { personalInfo = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], awards = [], coverLetter } = data;

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'sans': default: return 'font-sans';
    }
  };

  const Header = () => {
    switch (variant) {
      case '3':
        // Template 3: Left aligned, pipe separators, minimal
        return (
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap text-sm text-gray-700 italic gap-2 items-center">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <><span className="text-gray-400">|</span><span>{personalInfo.phone}</span></>}
              {personalInfo.email && <><span className="text-gray-400">|</span><a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">@{personalInfo.email.split('@')[0]}</a></>}
              {personalInfo.linkedin && <><span className="text-gray-400">|</span><a href={personalInfo.linkedin} className="text-blue-600 underline">@linkedin</a></>}
              {personalInfo.github && <><span className="text-gray-400">|</span><a href={personalInfo.github} className="text-blue-600 underline">@github</a></>}
            </div>
          </div>
        );
      case '4':
        // Template 4: Two-column header
        return (
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
              <div className="text-sm mt-1">{personalInfo.location}</div>
            </div>
            <div className="text-right text-xs space-y-1">
               {personalInfo.phone && <div className="flex justify-end items-center gap-1">{personalInfo.phone} <Phone size={12}/></div>}
               {personalInfo.email && <div className="flex justify-end items-center gap-1"><a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">{personalInfo.email}</a> <Mail size={12}/></div>}
               {personalInfo.github && <div className="flex justify-end items-center gap-1"><a href={personalInfo.github} className="text-blue-600 underline">GitHub</a> <Github size={12}/></div>}
               {personalInfo.linkedin && <div className="flex justify-end items-center gap-1"><a href={personalInfo.linkedin} className="text-blue-600 underline">LinkedIn</a> <Linkedin size={12}/></div>}
            </div>
          </div>
        );
      case '6':
        // Template 6: Red Accent Huge Centered
        return (
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-red-800 mb-2">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-2 text-sm text-gray-800">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && <><span className="text-red-800">|</span><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></>}
              {personalInfo.phone && <><span className="text-red-800">|</span><span>{personalInfo.phone}</span></>}
              {personalInfo.linkedin && <><span className="text-red-800">|</span><a href={personalInfo.linkedin}>LinkedIn</a></>}
            </div>
          </div>
        );
      case '2':
      case '5':
      case '1':
      default:
        // Centered standard header
        return (
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900 mb-1">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-700">
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12}/> {personalInfo.location}</span>}
              {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12}/> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12}/> {personalInfo.phone}</span>}
              {personalInfo.linkedin && <a href={personalInfo.linkedin} className="flex items-center gap-1"><Linkedin size={12}/> LinkedIn</a>}
              {personalInfo.github && <a href={personalInfo.github} className="flex items-center gap-1"><Github size={12}/> GitHub</a>}
            </div>
          </div>
        );
    }
  };

  const SectionHeader = ({ title }: { title: string }) => {
    switch (variant) {
      case '3':
        // Blue text, black rule
        return (
          <h2 className="text-lg font-bold uppercase tracking-wide text-blue-800 border-b-2 border-black pb-1 mb-3 mt-4">
            {title}
          </h2>
        );
      case '4':
        // Gray tcolorbox
        return (
          <div className="bg-gray-200 py-1.5 px-3 mt-4 mb-3 rounded-sm font-bold uppercase tracking-wide text-gray-900">
            {title}
          </div>
        );
      case '5':
        // Blue primary background box
        return (
          <div className="bg-blue-800 text-white py-1.5 px-3 mt-4 mb-3 rounded-sm font-bold uppercase tracking-wide">
            {title}
          </div>
        );
      case '6':
        // Red Accent, thick gray rule
        return (
          <h2 className="text-lg font-bold uppercase tracking-wider text-red-800 border-b-2 border-gray-300 pb-1 mb-3 mt-4">
            {title}
          </h2>
        );
      case '1':
      case '2':
      default:
        // Standard large bold with rule
        return (
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b-[1.5px] border-black pb-1 mb-3 mt-4">
            {title}
          </h2>
        );
    }
  };

  const LayoutClass = "bg-white p-[0.6in] max-w-[850px] mx-auto min-h-[11in] text-gray-900 shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-full print:max-w-none print:h-auto text-[13px] leading-snug print:bg-transparent";

  // Accent logic for template 6
  const jobTitleColor = variant === '6' ? 'text-red-800' : 'text-gray-900';

  return (
    <div className={cn(LayoutClass, getFontFamily())}>
      <Header />

      {/* Cover Letter */}
      {coverLetter && (
        <div 
          className="mb-8 pb-8 border-b-2 border-dashed border-gray-300 print:border-none print:mb-0 print:pb-0" 
          style={{ pageBreakAfter: 'always' }}
        >
          <div className="whitespace-pre-wrap leading-relaxed mt-4">
             {coverLetter}
          </div>
        </div>
      )}

      {/* Experience */}
      {(experience?.length || 0) > 0 && (
        <div className="mb-2">
          <SectionHeader title="EXPERIENCE" />
          <div className="pl-0">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold mb-1">
                  <div>
                     <span className={cn(variant === '3' ? "bg-yellow-100" : "")}>{exp.role}</span>
                     {variant === '3' ? (
                       <span className="font-normal text-gray-700"> | {exp.company}</span>
                     ) : (
                       <span className="font-normal text-gray-700 italic ml-2">{exp.company}</span>
                     )}
                  </div>
                  <span className="font-normal italic text-xs text-gray-600">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className={cn("list-disc pl-5 mt-1 space-y-1 text-sm")}>
                  {exp.description?.map((bullet: string, j: number) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {(projects?.length || 0) > 0 && (
        <div className="mb-2">
          <SectionHeader title="PROJECTS" />
          <div className="pl-0">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold mb-1">
                  <div>
                    <span className={cn(variant === '3' ? "bg-yellow-100" : "")}>{proj.name}</span>
                    {proj.technologies && <span className="font-normal italic text-[11px] ml-2 text-gray-600">({proj.technologies.join(', ')})</span>}
                  </div>
                  {proj.link && <a href={proj.link} className="text-blue-700 font-normal underline text-xs">View</a>}
                </div>
                {proj.description && (
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                    <li>{proj.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {(education?.length || 0) > 0 && (
        <div className="mb-2">
          <SectionHeader title="EDUCATION" />
          <div className="pl-0">
            {education.map((edu: any, i: number) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold mb-1">
                  <div>
                    <span className={cn(variant === '3' ? "bg-yellow-100" : "")}>{edu.institution}</span>
                    <span className="font-normal italic text-[13px] text-gray-700 ml-2">{edu.degree}</span>
                    <span className="font-normal text-xs text-gray-500 ml-2">
                      {[
                        edu.cgpa ? `CGPA: ${edu.cgpa}` : null,
                        edu.percentage ? `${edu.percentage}` : null,
                        edu.details ? edu.details : null
                      ].filter(Boolean).join(' | ')}
                    </span>
                  </div>
                  <span className="font-normal italic text-xs text-gray-600">{edu.startDate} – {edu.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {Object.keys(skills || {}).length > 0 && (
        <div className="mb-2 break-inside-avoid">
          <SectionHeader title="TECHNICAL SKILLS" />
          <div className="pl-0">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(skills).map(([category, items]: [string, any], i: number) => (
                  <tr key={i} className="align-top">
                    <td className="w-36 font-bold py-1 pr-2">{category}:</td>
                    <td className="py-1">{items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certifications and Awards */}
      {((certifications?.length || 0) > 0 || (awards?.length || 0) > 0) && (
        <div className="mb-2 break-inside-avoid">
          <SectionHeader title="AWARDS & CERTIFICATIONS" />
          <div className="pl-0">
            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
              {awards?.map((award: string, i: number) => (
                 <li key={`a-${i}`}>{award}</li>
              ))}
              {certifications?.map((cert: any, i: number) => (
                 <li key={`c-${i}`}>
                   <span className="font-bold">{cert.name}</span> — {cert.issuer}
                   {cert.link && <a href={cert.link} className="text-blue-700 ml-2 text-xs underline">Verify</a>}
                 </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
