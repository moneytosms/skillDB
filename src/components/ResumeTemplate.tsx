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
        // Template 3 (John Smith): Left aligned, italicized contacts, newlines
        return (
          <div className="mb-6">
            <h1 className="text-[28px] font-bold text-gray-900 mb-1">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-col text-[14px] text-gray-800 italic space-y-0 text-left">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-blue-700 underline">{personalInfo.email}</a>}
              {personalInfo.linkedin && <a href={personalInfo.linkedin} className="text-blue-700 underline">LinkedIn</a>}
              {personalInfo.github && <a href={personalInfo.github} className="text-blue-700 underline">GitHub</a>}
            </div>
          </div>
        );
      case '4':
      case '5':
        // Template 4 & 5 (Prashant Singh): Two columns. Left: Name + location. Right: icons + contacts
        return (
          <div className="flex justify-between items-start mb-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-[28px] font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
              {personalInfo.location && <div className="flex items-center gap-1.5 text-[14px]"><MapPin size={14}/> {personalInfo.location}</div>}
            </div>
            <div className="text-right text-[14px] space-y-1">
               {personalInfo.phone && <div className="flex justify-end items-center gap-2"><Phone size={14}/> {personalInfo.phone}</div>}
               {personalInfo.email && <div className="flex justify-end items-center gap-2"><Mail size={14}/> <a href={`mailto:${personalInfo.email}`} className="text-blue-700 underline">{personalInfo.email}</a></div>}
               {personalInfo.linkedin && <div className="flex justify-end items-center gap-2"><Linkedin size={14}/> <a href={personalInfo.linkedin} className="text-blue-700 underline">LinkedIn</a></div>}
               {personalInfo.github && <div className="flex justify-end items-center gap-2"><Github size={14}/> <a href={personalInfo.github} className="text-blue-700 underline">GitHub</a></div>}
            </div>
          </div>
        );
      case '6':
        // Template 6: Red Accent Huge Centered
        return (
          <div className="text-center mb-6">
            <h1 className="text-[2.5rem] font-bold text-red-800 mb-2 leading-none">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-2 text-[14px] text-gray-800">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && <><span className="text-red-800 font-bold">|</span><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></>}
              {personalInfo.phone && <><span className="text-red-800 font-bold">|</span><span>{personalInfo.phone}</span></>}
              {personalInfo.linkedin && <><span className="text-red-800 font-bold">|</span><a href={personalInfo.linkedin}>LinkedIn</a></>}
              {personalInfo.github && <><span className="text-red-800 font-bold">|</span><a href={personalInfo.github}>GitHub</a></>}
            </div>
          </div>
        );
      case '2':
        // Template 2: Bold ATS
        return (
          <div className="text-center mb-5 mt-1">
            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px] font-bold text-gray-900">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {(personalInfo.location && personalInfo.email) && <span className="font-normal text-gray-400">|</span>}
              {personalInfo.email && <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>}
              {(personalInfo.email && personalInfo.phone) && <span className="font-normal text-gray-400">|</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.phone && personalInfo.linkedin) && <span className="font-normal text-gray-400">|</span>}
              {personalInfo.linkedin && <a href={personalInfo.linkedin}>LinkedIn</a>}
              {(personalInfo.linkedin && personalInfo.github) && <span className="font-normal text-gray-400">|</span>}
              {personalInfo.github && <a href={personalInfo.github}>GitHub</a>}
            </div>
          </div>
        );
      case '1':
      default:
        // Centered standard header (Alex Webb)
        return (
          <div className="text-center mb-5">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[14px] text-gray-800">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <><span className="font-bold text-gray-400">|</span><span>{personalInfo.phone}</span></>}
              {personalInfo.email && <><span className="font-bold text-gray-400">|</span><a href={`mailto:${personalInfo.email}`} className="text-blue-700 underline">{personalInfo.email}</a></>}
              {personalInfo.linkedin && <><span className="font-bold text-gray-400">|</span><a href={personalInfo.linkedin} className="text-blue-700 underline">LinkedIn</a></>}
              {personalInfo.github && <><span className="font-bold text-gray-400">|</span><a href={personalInfo.github} className="text-blue-700 underline">GitHub</a></>}
            </div>
          </div>
        );
    }
  };

  const SectionHeader = ({ title }: { title: string }) => {
    switch (variant) {
      case '3':
        // Minimalist bold Section (Black line)
        return (
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 border-b pb-0.5 border-black mb-3 mt-4">
            {title}
          </h2>
        );
      case '4':
        // Gray tcolorbox
        return (
          <div className="bg-gray-200 py-1.5 px-3 mt-4 mb-3 font-bold uppercase tracking-widest text-gray-900 text-[15px] rounded-sm">
            {title}
          </div>
        );
      case '5':
        // Blue primary background box
        return (
          <div className="bg-blue-800 text-white py-1.5 px-3 mt-4 mb-3 font-bold uppercase tracking-widest text-[15px] rounded-sm">
            {title}
          </div>
        );
      case '6':
        // Red Accent, thick red rule
        return (
          <h2 className="text-lg font-bold uppercase tracking-wider text-red-800 border-b-2 border-red-800 pb-0.5 mb-3 mt-4">
            {title}
          </h2>
        );
      case '2':
        // Heavy ATS
        return (
          <h2 className="text-[1.15rem] font-black uppercase text-gray-900 border-b-[2.5px] border-black pb-1 mb-3 mt-5">
            {title}
          </h2>
        );
      case '1':
      default:
        // Standard large bold with regular rule
        return (
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-black pb-0.5 mb-3 mt-4">
            {title}
          </h2>
        );
    }
  };

  const LayoutClass = "bg-white p-[0.6in] max-w-[850px] mx-auto min-h-[11in] text-gray-900 shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-full print:max-w-none print:h-auto text-[13px] leading-snug print:bg-transparent";

  // Accent logic for template 6
  const jobTitleColor = variant === '6' ? 'text-red-800' : 'text-gray-900';

  const bulletType = (variant === '4' || variant === '5') ? 'list-[circle]' : 'list-disc';

  return (
    <div className={cn(LayoutClass, getFontFamily())}>
      <Header />

      {/* Cover Letter */}
      {coverLetter && (
        <div 
          className="mb-8 pb-8 border-b-2 border-dashed border-gray-300 print:border-none print:mb-0 print:pb-0" 
          style={{ pageBreakAfter: 'always' }}
        >
          <div className="whitespace-pre-wrap leading-relaxed mt-4 text-[14px]">
             {coverLetter}
          </div>
        </div>
      )}

      {/* Experience */}
      {(experience?.length || 0) > 0 && (
        <div className="mb-2">
          <SectionHeader title="EXPERIENCE" />
          <div className={cn(variant === '4' || variant === '5' ? "pl-0" : "pl-0")}>
            {experience.map((exp: any, i: number) => (
              <div key={i} className="mb-3 break-inside-avoid">
                {variant === '3' ? (
                   // John Smith Style: Company | Role  Date
                   <div className="flex justify-between items-baseline mb-1">
                     <div>
                        <span className="bg-[#fef9c3] px-1 font-bold text-gray-900">{exp.role}</span>
                        <span className="font-bold text-gray-900 mx-1">|</span>
                        <span className="font-normal text-gray-800">{exp.company}</span>
                     </div>
                     <span className="font-normal italic text-xs text-gray-600">{exp.startDate} – {exp.endDate}</span>
                   </div>
                ) : variant === '2' ? (
                   // Heavy Modern
                   <div className="flex justify-between items-baseline font-bold mb-1 text-[14px]">
                     <div>
                        <span className="text-gray-900 text-base">{exp.role}</span>
                        <span className="font-normal text-gray-800 italic ml-2">{exp.company}</span>
                     </div>
                     <span className="font-normal text-xs text-gray-600">{exp.startDate} – {exp.endDate}</span>
                   </div>
                ) : (
                   // Standard
                   <div className="flex justify-between items-baseline font-bold mb-1">
                     <div>
                        <span className={cn(jobTitleColor, "text-[14px]")}>{exp.role}</span>
                        <span className="font-normal text-gray-700 italic ml-2">{exp.company}</span>
                     </div>
                     <span className="font-normal italic text-[13px] text-gray-600">{exp.startDate} – {exp.endDate}</span>
                   </div>
                )}
                
                {exp.description && (
                  <ul className={cn(bulletType, "pl-[1.2rem] mt-1 space-y-1 text-[13px] text-gray-800")}>
                    {exp.description.map((bullet: string, j: number) => (
                      <li key={j} className="pl-1 leading-[1.35]">{bullet}</li>
                    ))}
                  </ul>
                )}
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
                    {variant === '3' ? (
                      <span className="bg-[#fef9c3] px-1 text-gray-900 font-bold">{proj.name}</span>
                    ) : (
                      <span className={cn(jobTitleColor, variant === '2' ? "text-[15px]" : "text-[14px]")}>{proj.name}</span>
                    )}
                    {proj.technologies && (
                      <span className={cn(variant === '3' ? "font-normal italic" : "font-normal italic", "text-[12px] ml-2 text-gray-600")}>
                        {variant !== '2' ? `(${proj.technologies.join(', ')})` : proj.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  {proj.link && <a href={proj.link} className="text-blue-700 font-normal underline text-xs">View</a>}
                </div>
                {proj.description && (
                  <ul className={cn(bulletType, "pl-[1.2rem] mt-1 space-y-1 text-[13px] text-gray-800")}>
                    <li className="pl-1 leading-[1.35]">{proj.description}</li>
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
                {variant === '3' ? (
                   // John Smith Style
                   <div className="flex justify-between items-baseline mb-1">
                     <div>
                        <span className="bg-[#fef9c3] px-1 font-bold text-gray-900">{edu.institution}</span>
                        <span className="font-bold text-gray-900 mx-1">|</span>
                        <span className="font-normal text-gray-800">{edu.degree}</span>
                     </div>
                     <span className="font-normal italic text-xs text-gray-600">{edu.startDate} – {edu.endDate}</span>
                   </div>
                ) : (
                   <div className="flex justify-between items-baseline font-bold mb-1">
                     <div>
                       <span className={cn(jobTitleColor, variant === '2' ? "text-[15px]" : "text-[14px]")}>{edu.institution}</span>
                       <span className="font-normal italic text-[13px] text-gray-700 ml-2">{edu.degree}</span>
                     </div>
                     <span className="font-normal italic text-[12px] text-gray-600">{edu.startDate} – {edu.endDate}</span>
                   </div>
                )}
                
                {/* Optional education details under the title */}
                {(edu.cgpa || edu.percentage || edu.details) && (
                   <div className={cn("text-[13px] text-gray-600", variant === '3' ? "mt-0" : "mt-0.5")}>
                     {[
                       edu.cgpa ? `CGPA: ${edu.cgpa}` : null,
                       edu.percentage ? `${edu.percentage}` : null,
                       edu.details ? edu.details : null
                     ].filter(Boolean).join(' | ')}
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {Object.keys(skills || {}).length > 0 && (
        <div className="mb-2 break-inside-avoid mt-5">
          <SectionHeader title="TECHNICAL SKILLS" />
          {variant === '4' || variant === '5' ? (
             <ul className="pl-2 space-y-1.5 text-[13.5px]">
               {Object.entries(skills).map(([category, items]: [string, any], i: number) => (
                 <li key={i}>
                   <span className="font-bold w-36 inline-block">{category}:</span> <span className="text-gray-800">{items}</span>
                 </li>
               ))}
             </ul>
          ) : (
             <table className="w-full text-[13.5px]">
               <tbody>
                 {Object.entries(skills).map(([category, items]: [string, any], i: number) => (
                   <tr key={i} className="align-top">
                     <td className="w-40 font-bold py-0.5 pr-2">{category}:</td>
                     <td className="py-0.5 text-gray-800">{items}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}
        </div>
      )}

      {/* Certifications and Awards */}
      {((certifications?.length || 0) > 0 || (awards?.length || 0) > 0) && (
        <div className="mb-2 break-inside-avoid mt-5">
          <SectionHeader title="AWARDS & CERTIFICATIONS" />
          <div className="pl-0">
            <ul className={cn(bulletType, "pl-[1.2rem] mt-1 space-y-1.5 text-[13px] text-gray-800")}>
              {awards?.map((award: string, i: number) => (
                 <li key={`a-${i}`} className="pl-1 leading-[1.3]">{award}</li>
              ))}
              {certifications?.map((cert: any, i: number) => (
                 <li key={`c-${i}`} className="pl-1 leading-[1.3]">
                   <span className="font-bold text-gray-900">{cert.name}</span> — {cert.issuer}
                   {cert.link && <a href={cert.link} className="text-blue-700 ml-2 text-[12px] underline">Verify</a>}
                 </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
