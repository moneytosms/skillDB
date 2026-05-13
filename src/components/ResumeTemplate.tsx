import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ResumeTemplateProps {
  content: string; // JSON string
}

export function ResumeTemplate({ content }: ResumeTemplateProps) {
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return <div className="text-red-500">Failed to render resume. Invalid data format.</div>;
  }

  const { personalInfo = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], awards = [] } = data;

  return (
    <div className="bg-white p-[1in] max-w-[850px] mx-auto min-h-[11in] text-black bg-white shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-[8.5in] print:h-[11in] font-sans text-sm leading-tight">
      
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold font-serif -mb-1">{personalInfo.name || 'Your Name'}</h1>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2 text-gray-800">
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12}/> {personalInfo.location}</span>}
          {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12}/> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12}/> {personalInfo.phone}</span>}
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-xs mt-1 text-gray-800">
          {personalInfo.linkedin && <a href={personalInfo.linkedin} className="flex items-center gap-1 text-blue-700"><Linkedin size={12}/> LinkedIn</a>}
          {personalInfo.github && <a href={personalInfo.github} className="flex items-center gap-1 text-blue-700"><Github size={12}/> GitHub</a>}
          {personalInfo.website && <a href={personalInfo.website} className="flex items-center gap-1 text-blue-700"><Globe size={12}/> Portfolio</a>}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="EDUCATION" />
          <div className="pl-1">
            {education.map((edu: any, i: number) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between font-bold text-[13px]">
                  <span>{edu.institution}</span>
                  <span className="font-normal italic text-xs">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="italic">{edu.degree}</span>
                  <span className="text-xs">{edu.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="EXPERIENCE" />
          <div className="pl-1">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between font-bold text-[13px]">
                  <span>{exp.role} <span className="font-normal">— {exp.company}</span></span>
                  <span className="font-normal italic text-xs">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-dash pl-4 mt-1 text-[13px] space-y-0.5">
                  {exp.description?.map((bullet: string, j: number) => (
                    <li key={j} className="pl-1 relative before:content-['–'] before:absolute before:-left-3 before:top-0">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {Object.keys(skills || {}).length > 0 && (
        <div className="mb-3">
          <SectionHeader title="TECHNICAL SKILLS" />
          <div className="pl-1 text-[13px]">
            <table className="w-full">
              <tbody>
                {Object.entries(skills).map(([category, items]: [string, any], i: number) => (
                  <tr key={i} className="align-top">
                    <td className="w-32 font-bold py-0.5 pr-2">{category}:</td>
                    <td className="py-0.5">{items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="PROJECTS" />
          <div className="pl-1">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between font-bold text-[13px]">
                  <span>{proj.name} {proj.technologies && <span className="font-normal italic text-xs ml-1">({proj.technologies.join(', ')})</span>}</span>
                  {proj.link && <a href={proj.link} className="text-blue-700 font-normal underline text-xs">View</a>}
                </div>
                <div className="text-[13px] mt-0.5 leading-snug">
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications and Awards */}
      {(certifications.length > 0 || awards.length > 0) && (
        <div className="mb-3">
          <SectionHeader title="AWARDS & CERTIFICATIONS" />
          <div className="pl-1">
            <ul className="list-dash pl-4 text-[13px] space-y-0.5">
              {awards.map((award: string, i: number) => (
                 <li key={`a-${i}`} className="pl-1 relative before:content-['•'] before:absolute before:-left-3 before:top-0">{award}</li>
              ))}
              {certifications.map((cert: any, i: number) => (
                 <li key={`c-${i}`} className="pl-1 relative before:content-['•'] before:absolute before:-left-3 before:top-0">
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-[13px] font-bold font-serif tracking-widest text-slate-900 border-b border-black pb-0.5 mb-1 uppercase">
        {title}
      </h2>
    </div>
  );
}
