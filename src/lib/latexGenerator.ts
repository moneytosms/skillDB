export function jsonToLatex(jsonString: string, variant: string, fontStyle: string): string {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    return 'Invalid JSON data.';
  }

  const { personalInfo = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], awards = [], coverLetter } = data;

  // Escape LaTeX special characters
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

  let latexCode = '';

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

  if (variant === '1') {
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

\\titleformat{\\section}{\\Large\\bfseries\\scshape\\raggedright}{}{0em}{}[\\vspace{-1pt}\\titlerule\\vspace{2pt}]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{#3} & \\textit{\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textit{\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-4pt}}

\\begin{document}

\\begin{center}
\\textbf{\\Huge ${name}} \\\\
\\vspace{2pt}
\\small`;
    const contactParts = [];
    if (location) contactParts.push(`\\faMapMarker*\\ ${location}`);
    if (email) contactParts.push(`\\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${email}}`);
    if (phone) contactParts.push(`\\faPhone\\ ${phone}`);
    if (linkedin) contactParts.push(`\\faLinkedin\\ \\href{${personalInfo.linkedin}}{LinkedIn}`);
    if (github) contactParts.push(`\\faGithub\\ \\href{${personalInfo.github}}{GitHub}`);
    latexCode += ' ' + contactParts.join(' $|$ ') + '\n\\end{center}\n\n';

  } else if (variant === '2') {
    latexCode += `\\documentclass[letterpaper,11pt]{article}
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

\\titleformat{\\section}{
\\vspace{0pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule\\vspace{-2pt}]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{1pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
  \\vspace{1pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
\\textbf{\\Huge ${name}} \\\\
\\vspace{2pt}
\\small`;
    const contactParts = [];
    if (location) contactParts.push(`\\faMapMarker*\\ ${location}`);
    if (email) contactParts.push(`\\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${email}}`);
    if (phone) contactParts.push(`\\faPhone\\ ${phone}`);
    if (linkedin) contactParts.push(`\\faLinkedin\\ \\href{${personalInfo.linkedin}}{LinkedIn}`);
    if (github) contactParts.push(`\\faGithub\\ \\href{${personalInfo.github}}{GitHub}`);
    latexCode += ' ' + contactParts.join(' $|$ ') + '\n\\end{center}\n\n';

  } else if (variant === '3') {
    latexCode += `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{tabularx}
\\usepackage{soul}
\\usepackage{fontawesome5}
\\input{glyphtounicode}
\\usepackage[margin=0.5in]{geometry}
${getFontPackage(fontStyle)}

\\pagestyle{empty}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\definecolor{darkblue}{RGB}{30, 64, 175}
\\definecolor{lightyellow}{cmyk}{0.00, 0.05, 0.20, 0.00} 
\\sethlcolor{lightyellow} 

\\titleformat{\\section}{
\\vspace{2pt}\\scshape\\raggedright\\large\\bfseries\\color{darkblue}
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-1pt}]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{\\item{#1 \\vspace{-4pt}}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{2pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\colorbox{lightyellow}{\\textbf{#1}} $|$ \\textit{#3} & \\textit{\\small #2}\\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{2pt}\\item
\\begin{tabular*}{1.0\\textwidth}{ l@{\\extracolsep{\\fill}}r}
\\colorbox{lightyellow}{\\textbf{#1}} \\textit{\\small(#3)} & \\textit{\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeSubHeadingList}{\\vspace{-3pt}\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-8pt}}

\\begin{document}

\\begin{flushleft}
\\textbf{\\huge ${name}} \\\\
\\vspace{2pt}
\\textit{`;
    const contactParts = [];
    if (location) contactParts.push(`\\faMapMarker*\\ ${location}`);
    if (phone) contactParts.push(`\\faPhone\\ ${phone}`);
    if (email) contactParts.push(`\\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${email}}`);
    if (linkedin) contactParts.push(`\\faLinkedin\\ \\href{${personalInfo.linkedin}}{LinkedIn}`);
    if (github) contactParts.push(`\\faGithub\\ \\href{${personalInfo.github}}{GitHub}`);
    latexCode += contactParts.join('} $|$ \\textit{') + '} \n\\end{flushleft}\n\n';

  } else if (variant === '4') {
    latexCode += `\\documentclass[a4paper,11pt]{article}
\\usepackage{xcolor}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage[hidelinks]{hyperref}
${getFontPackage(fontStyle)}

\\geometry{left=1.4cm, top=1.4cm, right=1.2cm, bottom=1cm}
\\usepackage[most]{tcolorbox}
\\tcbset{
frame code={},
center title,
left=4pt,
right=4pt,
top=2pt,
bottom=2pt,
colback=gray!20,
colframe=white,
width=\\dimexpr\\textwidth\\relax,
enlarge left by=0mm,
boxsep=2pt,
arc=2pt,outer arc=2pt,
}
\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-7pt}]

\\newcommand{\\cvsection}[1]{%
\\vspace{2mm}
\\begin{tcolorbox}
\\textbf{\\large\\scshape #1}
\\end{tcolorbox}
\\vspace{-1mm}
}

\\newcommand{\\resumeItem}[1]{\\item{\\textbf{#1} \\vspace{-0.5mm}}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{1.5mm}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\footnotesize{#3}} & \\textit{\\footnotesize{#2}} \\\\
\\end{tabular*}
\\vspace{-3mm}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{1.5mm}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\footnotesize{#3}} & \\textit{\\footnotesize{#2}} \\\\
\\end{tabular*}
\\vspace{-3mm}
}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.0in,labelsep=0mm]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{2mm}}
\\newcommand{\\resumeItemListStart}{\\begin{justify}\\begin{itemize}[leftmargin=3ex, rightmargin=2ex, noitemsep,labelsep=1.2mm,itemsep=0mm]\\small}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\end{justify}\\vspace{-2mm}}

\\pagestyle{empty}
\\begin{document}

\\begin{tabularx}{\\linewidth}{X r}
\\textbf{\\Large ${name}} & \\faPhone\\ ${phone} \\\\
\\faMapMarker*\\ ${location} & \\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${email}} \\\\
 & \\faLinkedin\\ \\href{${personalInfo.linkedin}}{LinkedIn} \\\\
 & \\faGithub\\ \\href{${personalInfo.github}}{GitHub} \\\\
\\end{tabularx}
`;
  } else if (variant === '5') {
    latexCode += `\\documentclass[a4paper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{tabularx}
\\usepackage{geometry}
\\usepackage{fontawesome5}
\\geometry{left=1.5cm, top=1.5cm, right=1.5cm, bottom=1.5cm}
${getFontPackage(fontStyle)}

\\definecolor{primarybg}{RGB}{30, 64, 175} 
\\definecolor{primarytext}{RGB}{255, 255, 255}

\\usepackage[most]{tcolorbox}
\\tcbset{
  sectionbox/.style={
    colback=primarybg,
    coltext=primarytext,
    fontupper=\\bfseries\\large\\scshape,
    boxrule=0pt,
    arc=4pt,
    outer arc=4pt,
    top=4pt, bottom=4pt,
    enlarge left by=0mm,
    enlarge right by=0mm,
    width=\\linewidth
  }
}

\\newcommand{\\cvsection}[1]{
  \\vspace{2ex}
  \\begin{tcolorbox}[sectionbox]
  #1
  \\end{tcolorbox}
  \\vspace{-1ex}
}

\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textit{\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textit{\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\pagestyle{empty}
\\begin{document}

\\begin{center}
{\\Huge \\textbf{${name}}} \\\\
\\vspace{2pt}
\\small`;
    const contactParts = [];
    if (location) contactParts.push(`\\faMapMarker*\\ ${location}`);
    if (email) contactParts.push(`\\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${email}}`);
    if (phone) contactParts.push(`\\faPhone\\ ${phone}`);
    if (linkedin) contactParts.push(`\\faLinkedin\\ \\href{${personalInfo.linkedin}}{LinkedIn}`);
    if (github) contactParts.push(`\\faGithub\\ \\href{${personalInfo.github}}{GitHub}`);
    latexCode += ' ' + contactParts.join(' $|$ ') + '\n\\end{center}\n\n';

  } else if (variant === '6') {
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

\\newcommand{\\header}[4]{\\begin{center}{\\Huge\\bfseries\\color{accent} #1}\\\\\\vspace{2mm} \\small #2 $\\vert$ \\href{mailto:#3}{#3} $\\vert$ #4\\end{center}}

\\newcommand{\\resumeSubheading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textbf{\\color{accent}\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeProjectHeading}[4]{
\\vspace{1pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{2mm}\\textit{\\small #3} & \\textbf{\\color{accent}\\small #2} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.0in, label={}]}
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
    if (email) contactParts.push(`\\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${email}}`);
    if (phone) contactParts.push(`\\faPhone\\ ${phone}`);
    if (linkedin) contactParts.push(`\\faLinkedin\\ \\href{${personalInfo.linkedin}}{LinkedIn}`);
    if (github) contactParts.push(`\\faGithub\\ \\href{${personalInfo.github}}{GitHub}`);
    latexCode += ' ' + contactParts.join(' $\\vert$ ') + '\n\\end{center}\n\n';

  } else {
    latexCode += '\\documentclass{article}\n\\begin{document}\nTemplate not supported directly.\n\\end{document}';
  }

  // Cover Letter
  if (coverLetter) {
      latexCode += `${esc(coverLetter)}\n\n\\newpage\n\n`;
  }

  // Sections Generation
  const sectionCmd = (variant === '4' || variant === '5') ? '\\cvsection' : '\\section';

  if (experience && experience.length > 0) {
    latexCode += `${sectionCmd}{EXPERIENCE}\n\\resumeSubHeadingList\n`;
    experience.forEach((exp: any) => {
        latexCode += `  \\resumeSubheading{${esc(exp.role)}}{${esc(exp.startDate)} -- ${esc(exp.endDate)}}{${esc(exp.company)}}{}\n`;
        if (exp.description && exp.description.length > 0) {
            latexCode += `  \\resumeItemListStart\n`;
            exp.description.forEach((desc: string) => {
                latexCode += `    \\resumeItem{${esc(desc)}}\n`;
            });
            latexCode += `  \\resumeItemListEnd\n`;
        }
    });
    latexCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  if (projects && projects.length > 0) {
    latexCode += `${sectionCmd}{PROJECTS}\n\\resumeSubHeadingList\n`;
    projects.forEach((proj: any) => {
        const techs = proj.technologies ? proj.technologies.join(', ') : '';
        latexCode += `  \\resumeProjectHeading{${esc(proj.name)}}{}{${esc(techs)}}{}\n`;
        if (proj.description) {
            latexCode += `  \\resumeItemListStart\n    \\resumeItem{${esc(proj.description)}}\n  \\resumeItemListEnd\n`;
        }
    });
    latexCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  if (education && education.length > 0) {
    latexCode += `${sectionCmd}{EDUCATION}\n\\resumeSubHeadingList\n`;
    education.forEach((edu: any) => {
        latexCode += `  \\resumeSubheading{${esc(edu.institution)}}{${esc(edu.startDate)} -- ${esc(edu.endDate)}}{${esc(edu.degree)}}{${esc(edu.details)}}\n`;
    });
    latexCode += `\\resumeSubHeadingListEnd\n\n`;
  }

  if (skills && Object.keys(skills).length > 0) {
    latexCode += `${sectionCmd}{TECHNICAL SKILLS}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{\n`;
    Object.entries(skills).forEach(([category, items]: [string, any]) => {
        latexCode += `    \\textbf{${esc(category)}}{: ${esc(items)}} \\\\\n`;
    });
    latexCode += `  }}\n\\end{itemize}\n\n`;
  }

  if ((certifications && certifications.length > 0) || (awards && awards.length > 0)) {
    latexCode += `${sectionCmd}{AWARDS \\& CERTIFICATIONS}\n\\begin{itemize}[leftmargin=0.15in]\n`;
    if (awards) {
        awards.forEach((award: string) => {
            latexCode += `  \\resumeItem{${esc(award)}}\n`;
        });
    }
    if (certifications) {
        certifications.forEach((cert: any) => {
            latexCode += `  \\resumeItem{\\textbf{${esc(cert.name)}} --- ${esc(cert.issuer)}}\n`;
        });
    }
    latexCode += `\\end{itemize}\n\n`;
  }

  latexCode += `\\end{document}\n`;
  return latexCode;
}
