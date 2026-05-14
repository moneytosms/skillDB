export function jsonToLatex(jsonString: string, variant: string, fontStyle: string): string {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    return 'Invalid JSON data.';
  }

  const { personalInfo = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], awards = [], coverLetter } = data;

  const esc = (str: string | undefined | null) => {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\textbackslash ')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/~/g, '\\textasciitilde ')
      .replace(/\^/g, '\\textasciicircum ');
  };

  const getFontPackage = (style: string) => {
    if (style === 'serif') return '\\usepackage{libertine}';
    if (style === 'mono') return '\\usepackage{inconsolata}';
    return '\\usepackage[sfdefault]{roboto}';
  };

  const name = esc(personalInfo.name);
  const location = esc(personalInfo.location);
  const phone = esc(personalInfo.phone);
  const email = esc(personalInfo.email);
  const linkedin = esc(personalInfo.linkedin);
  const github = esc(personalInfo.github);

  let latexCode = '';
  let bodyCode = '';

  // -------------------------------------------------------------
  // BODY GENERATION HELPER (Shared but highly customizable per variant constraints)
  // -------------------------------------------------------------
  
  if (coverLetter) {
    bodyCode += `${esc(coverLetter)}\n\n\\newpage\n\n`;
  }

  // Variant 1 & 2: Classic ATS / Bold Modern
  // Variant 3: Minimalist Highlight (John Smith style)
  // Variant 4: Tech Icons & Boxed (Prashant style)
  // Variant 5: Colored Headers
  // Variant 6: Accent Color

  const sectionCmd = (variant === '4' || variant === '5') ? '\\cvsection' : '\\section';

  if (experience && experience.length > 0) {
    bodyCode += `${sectionCmd}{EXPERIENCE}\n\\resumeSubHeadingListStart\n`;
    experience.forEach((exp: any) => {
      bodyCode += `  \\resumeSubheading{${esc(exp.role)}}{${esc(exp.startDate)} -- ${esc(exp.endDate)}}{${esc(exp.company)}}{}\n`;
      if (exp.description && exp.description.length > 0) {
        bodyCode += `  \\resumeItemListStart\n`;
        exp.description.forEach((desc: string) => {
          bodyCode += `    \\resumeItem{${esc(desc)}}\n`;
        });
        bodyCode += `  \\resumeItemListEnd\n`;
      }
    });
    bodyCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  if (projects && projects.length > 0) {
    bodyCode += `${sectionCmd}{PROJECTS}\n\\resumeSubHeadingListStart\n`;
    projects.forEach((proj: any) => {
      const techs = proj.technologies ? proj.technologies.join(', ') : '';
      bodyCode += `  \\resumeProjectHeading{${esc(proj.name)}}{}{${esc(techs)}}{}\n`;
      if (proj.description) {
        bodyCode += `  \\resumeItemListStart\n    \\resumeItem{${esc(proj.description)}}\n  \\resumeItemListEnd\n`;
      }
    });
    bodyCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  if (education && education.length > 0) {
    bodyCode += `${sectionCmd}{EDUCATION}\n\\resumeSubHeadingListStart\n`;
    education.forEach((edu: any) => {
      const detailsParts = [
        edu.cgpa ? `CGPA: ${esc(edu.cgpa)}` : null,
        edu.percentage ? `Percentage: ${esc(edu.percentage)}` : null,
        edu.details ? esc(edu.details) : null
      ].filter(Boolean).join(' | ');
      bodyCode += `  \\resumeSubheading{${esc(edu.institution)}}{${esc(edu.startDate)} -- ${esc(edu.endDate)}}{${esc(edu.degree)}}{${detailsParts}}\n`;
    });
    bodyCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  if (skills && Object.keys(skills).length > 0) {
    bodyCode += `${sectionCmd}{TECHNICAL SKILLS}\n`;
    if (variant === '4' || variant === '5') {
       bodyCode += `\\begin{itemize}[leftmargin=0.05in, label={}]\n\\small{\\item{\n`;
       Object.entries(skills).forEach(([category, items]: [string, any]) => {
          bodyCode += `\\textbf{${esc(category)}}{: ${esc(items)}} \\\\\n`;
       });
       bodyCode += `}}\n\\end{itemize}\n\n`;
    } else {
       bodyCode += `\\begin{itemize}[leftmargin=0.15in, label={}]\n\\small{\\item{\n`;
       Object.entries(skills).forEach(([category, items]: [string, any]) => {
          bodyCode += `\\textbf{${esc(category)}}{: ${esc(items)}} \\\\\n`;
       });
       bodyCode += `}}\n\\end{itemize}\n\n`;
    }
  }

  if ((certifications && certifications.length > 0) || (awards && awards.length > 0)) {
    bodyCode += `${sectionCmd}{AWARDS \\& CERTIFICATIONS}\n\\resumeSubHeadingListStart\n`;
    if (awards) {
      awards.forEach((award: string) => {
        bodyCode += `  \\resumeItem{${esc(award)}}\n`;
      });
    }
    if (certifications) {
      certifications.forEach((cert: any) => {
         // Re-using the sub-heading structure structurally for distinct formatting
        bodyCode += `  \\resumeProjectHeading{${esc(cert.name)}}{}{${esc(cert.issuer)}}{}\n`;
      });
    }
    bodyCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  // -------------------------------------------------------------
  // PREAMBLE & COMBINATION BASED ON VARIANT
  // -------------------------------------------------------------

  if (variant === '1') {
    // VARIANT 1: ALEX WEBB (Standard ATS)
    latexCode += `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\input{glyphtounicode}
${getFontPackage(fontStyle)}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\Large\\bfseries\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{-1pt}\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & #2 \\\\
\\textit{#3} & \\textit{#4} \\\\
\\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{-1pt}\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} \\textit{\\small #3} & \\textit{\\small #2} \\\\
\\end{tabular*}\\vspace{-7pt}
}
\\renewcommand\\labelitemii{$\\bullet$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}
\\begin{center}
\\textbf{\\Huge ${name}} \\\\
\\vspace{3pt}
\\small`;
    const contactParts = [];
    if (location) contactParts.push(`${location}`);
    if (phone) contactParts.push(`${phone}`);
    if (email) contactParts.push(`\\href{mailto:${personalInfo.email}}{${email}}`);
    if (linkedin) contactParts.push(`\\href{${personalInfo.linkedin}}{LinkedIn}`);
    if (github) contactParts.push(`\\href{${personalInfo.github}}{GitHub}`);
    latexCode += ' ' + contactParts.join(' $|$ ') + '\n\\end{center}\n\n';
    latexCode += bodyCode;
    latexCode += `\\end{document}\n`;

  } else if (variant === '2') {
    // VARIANT 2: ATS BOLD MODERN
    latexCode += `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\input{glyphtounicode}
${getFontPackage(fontStyle)}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
\\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule\\vspace{-5pt}]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}\\vspace{-1pt}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\large #1}\\hspace{2mm}\\textit{\\small #3} \\textit{\\footnotesize #4} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-1pt}}

\\begin{document}
\\begin{center}
\\textbf{\\Huge\\uppercase{${name}}} \\\\
\\vspace{4pt}
\\small`;
    const contactParts = [];
    if (location) contactParts.push(`\\textbf{${location}}`);
    if (email) contactParts.push(`\\href{mailto:${personalInfo.email}}{\\textbf{${email}}}`);
    if (phone) contactParts.push(`\\textbf{${phone}}`);
    if (linkedin) contactParts.push(`\\href{${personalInfo.linkedin}}{\\textbf{LinkedIn}}`);
    if (github) contactParts.push(`\\href{${personalInfo.github}}{\\textbf{GitHub}}`);
    latexCode += ' ' + contactParts.join(' $|$ ') + '\n\\end{center}\n\n';
    latexCode += bodyCode;
    latexCode += `\\end{document}\n`;

  } else if (variant === '3') {
    // VARIANT 3: JOHN SMITH (Highlight / Minimalist Pipeline style)
    latexCode += `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}
\\usepackage{soul}
\\input{glyphtounicode}
\\usepackage[margin=0.5in]{geometry}
${getFontPackage(fontStyle)}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\definecolor{lightyellow}{cmyk}{0.00, 0.05, 0.20, 0.00} 
\\sethlcolor{lightyellow}

\\titleformat{\\section}{
\\vspace{-5pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-4pt}]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{\\item{{#1 \\vspace{-4pt}}}}
\\newcommand{\\resumeSubheading}[4]{
\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@{\\extracolsep{\\fill}} l@{}l}
{#1} & \\textbf{#3} | {#2} & \\textit{#4}\\\\
\\end{tabular*}\\vspace{-10pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\item
\\begin{tabular*}{0.97\\textwidth}{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{#2} \\\\
\\end{tabular*}\\vspace{-9pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\vspace{-3pt}\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-8pt}}

\\begin{document}
\\begin{flushleft}
\\textbf{\\large ${name}} \\\\
`;
    if(location) latexCode += `\\textit{${location}}\\\\\n`;
    if(phone) latexCode += `\\textit{${phone}}\\\\\n`;
    if(email) latexCode += `\\href{mailto:${personalInfo.email}}{\\textit{${email}}}\\\\\n`;
    if(linkedin) latexCode += `\\href{${personalInfo.linkedin}}{\\textit{LinkedIn}}\\\\\n`;
    if(github) latexCode += `\\href{${personalInfo.github}}{\\textit{GitHub}}\\\\\n`;
    latexCode += `\\vspace{-8pt}\n\\end{flushleft}\n\n`;
    latexCode += bodyCode;
    latexCode += `\\end{document}\n`;

  } else if (variant === '4' || variant === '5') {
    // VARIANT 4 & 5: PRASHANT SINGH / ACADEMIC OR TCOLORBOX
    const titleBoxOptions = variant === '5' 
      ? `colback=blue!80!black,coltext=white,fontupper=\\bfseries\\large\\scshape,boxrule=0pt,arc=4pt,outer arc=4pt,top=4pt,bottom=4pt,width=\\linewidth`
      : `colback=gray!20,colframe=white,boxsep=4pt,arc=0pt,outer arc=0pt,top=0pt,bottom=0pt,width=\\dimexpr\\textwidth\\relax`;

    latexCode += `\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
${getFontPackage(fontStyle)}

\\geometry{left=1.4cm, top=0.8cm, right=1.2cm, bottom=1cm}
\\usepackage[most]{tcolorbox}
\\tcbset{
frame code={},
center title,
left=0pt,
right=0pt,
enlarge left by=-2mm,
${titleBoxOptions}
}

\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-7pt}]

\\newcommand{\\cvsection}[1]{%
\\vspace{2mm}
\\begin{tcolorbox}
\\textbf{ #1}
\\end{tcolorbox}
\\vspace{-4mm}
}

\\newcommand{\\resumeItem}[1]{\\item{\\textbf{$\\circ$}{\\hspace{0.5mm}#1 \\vspace{-0.5mm}}}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.98\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\footnotesize{#4}} \\\\
\\textit{\\footnotesize{#3}} &  \\footnotesize{#2}\\\\
\\end{tabular*}
\\vspace{-2.4mm}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.98\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
\\footnotesize{\\textit{#2}} & \\footnotesize{#4}\\\\
\\end{tabular*}
\\vspace{-2.4mm}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*,labelsep=0mm]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{2mm}}
\\newcommand{\\resumeItemListStart}{\\begin{justify}\\begin{itemize}[leftmargin=3ex, rightmargin=2ex, noitemsep,labelsep=1.2mm,itemsep=0mm]\\small}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\end{justify}\\vspace{-2mm}}

\\pagestyle{empty}
\\begin{document}

\\begin{tabularx}{\\linewidth}{X r}
\\textbf{\\Large ${name}} & \\faPhone\\ ${phone} \\\\
\\faMapMarker*\\ ${location} & \\href{mailto:${personalInfo.email}}{\\faEnvelope\\ ${email}} \\\\
 & \\href{${personalInfo.linkedin}}{\\faLinkedin\\ LinkedIn} \\\\
 & \\href{${personalInfo.github}}{\\faGithub\\ GitHub} \\\\
\\end{tabularx}
\\vspace{2mm}
`;
    // We stripped the regular header out from body, and handled custom here
    latexCode += bodyCode;
    latexCode += `\\end{document}\n`;

  } else if (variant === '6') {
    // VARIANT 6: CREATIVE ACCENT
    latexCode += `\\documentclass[letterpaper,10pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
${getFontPackage(fontStyle)}

\\definecolor{accent}{RGB}{124, 45, 18}

\\titleformat{\\section}{\\large\\bfseries\\scshape\\raggedright\\color{accent}}{}{0pt}{}[{\\color{accent}\\vspace{-0.5em}\\rule{\\textwidth}{1.5pt}}]

\\newcommand{\\resumeSubheading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} \\textit{\\footnotesize #4} & \\textbf{\\color{accent}\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textbf{\\color{accent}\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in,noitemsep,topsep=2pt]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-3pt}}

\\pagestyle{empty}
\\begin{document}

\\begin{center}
{\\Huge\\bfseries\\color{accent} ${name}} \\\\
\\vspace{2mm} \\small`;
    const contactParts = [];
    if (location) contactParts.push(`\\faMapMarker*\\ ${location}`);
    if (email) contactParts.push(`\\href{mailto:${personalInfo.email}}{\\faEnvelope\\ ${email}}`);
    if (phone) contactParts.push(`\\faPhone\\ ${phone}`);
    if (linkedin) contactParts.push(`\\href{${personalInfo.linkedin}}{\\faLinkedin\\ LinkedIn}`);
    if (github) contactParts.push(`\\href{${personalInfo.github}}{\\faGithub\\ GitHub}`);
    latexCode += ' ' + contactParts.join(' $\\vert$ ') + '\n\\end{center}\n\n';
    
    latexCode += bodyCode;
    latexCode += `\\end{document}\n`;

  } else {
    // Fallback if an unsupported variant is selected
    latexCode += '\\documentclass{article}\n\\begin{document}\nTemplate not supported directly.\n\\end{document}';
  }

  return latexCode;
}

