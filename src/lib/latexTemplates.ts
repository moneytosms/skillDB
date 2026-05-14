export const LATEX_TEMPLATES: Record<string, string> = {
  1: `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}
\\usepackage[sfdefault]{roboto}  

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
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\begin{document}
%% INSERT CONTENT HERE %%
% EXAMPLES FOR FORMATTING CONTENT:
%
% \\begin{center}
% \\textbf{\\Huge Alex Webb} \\\\
% \\small 555-123-4567 $|$
% \\href{mailto:alex@email.com}{alex@email.com} $|$
% \\href{https://linkedin.com/in/alexwebbx}{linkedin.com/in/alexwebbx} $|$
% \\href{https://github.com/alexwebbx}{github.com/alexwebbx}
% \\end{center}
% 
% \\section*{Summary}
% Passionate AI/ML engineer...
\\end{document}
`,
  2: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{fontawesome5}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}
\\usepackage[default]{lato}

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
\\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule\\vspace{-5pt}]
\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}
%% INSERT CONTENT HERE %%
% NOTE: Put everything in this file. Do NOT use \\input or \\include.
%
% \\begin{center}
% \\textbf{\\Huge Full Name} \\\\
% Phone $|$ \\href{mailto:email}{email}
% \\end{center}
\\end{document}
`,
  3: `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{amsmath}
\\usepackage{soul}
\\input{glyphtounicode}
\\usepackage[margin=0.5in]{geometry}
\\usepackage[default]{sourcesanspro}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
\\vspace{-5pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-4pt}]
\\pdfgentounicode=1

\\definecolor{lightyellow}{cmyk}{0.00, 0.05, 0.20, 0.00} 
\\sethlcolor{lightyellow} 

\\newcommand{\\sectionspace}{\\vspace{-20pt}}
\\newcommand{\\subheadingtitlevspace}{\\vspace{-3pt}}

\\newcommand{\\resumeItem}[1]{
\\item{
{#1 \\vspace{-4pt}}
}
}
\\newcommand{\\titleItem}[1]{\\textbf{#1}}
\\newcommand{\\highlight}[1]{\\textsl{\\textbf{#1}}}

\\newcommand{\\resumeSubheading}[4]{
\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@{\\extracolsep{\\fill}} l@{}l}
{#1} & \\titleItem{#3} $|$ {#2} & \\textit{#4}\\\\
\\end{tabular*}\\vspace{-10pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
\\item
\\begin{tabular*}{0.97\\textwidth}{ l@{\\extracolsep{\\fill}}r}
\\textit{#1} & \\textit{#2} \\\\
\\end{tabular*}\\vspace{-2pt}
}

\\newcommand{\\resumeProjectHeading}[4]{
\\item
\\begin{tabular*}{0.97\\textwidth}{ l@{\\extracolsep{\\fill}}r}
#1 & \\textit{#2} \\\\
\\end{tabular*}\\vspace{-9pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\subheadingtitlevspace\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-8pt}}

\\begin{document}
%% INSERT CONTENT HERE %%
% EXAMPLE FOR FLUSHLEFT HEADING:
% \\begin{flushleft}
% \\textbf{\\large John Smith} \\\\
% \\textit{Salt Lake City, Utah} $|$ \\textit{111-111-1111} $|$
% \\href{mailto:email@email.com}{{\\textit{@mail}}}
% \\vspace{-8pt}
% \\end{flushleft}
\\end{document}
`,
  4: `\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{wrapfig}
\\usepackage{lipsum}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}
\\usepackage{marvosym}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{graphicx}
\\usepackage{cfr-lm}
\\usepackage[T1]{fontenc}
\\setlength{\\multicolsep}{0pt}
\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\geometry{left=1.4cm, top=0.8cm, right=1.2cm, bottom=1cm}

\\usepackage[most]{tcolorbox}
\\tcbset{
frame code={},
center title,
left=0pt,
right=0pt,
top=0pt,
bottom=0pt,
colback=gray!20,
colframe=white,
width=\\dimexpr\\textwidth\\relax,
enlarge left by=-2mm,
boxsep=4pt,
arc=0pt,outer arc=0pt,
}
\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
\\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-7pt}]

\\newcommand{\\resumeItem}[2]{
\\item{
\\textbf{#1}{\\hspace{0.5mm}#2 \\vspace{-0.5mm}}
}
}
\\newcommand{\\resumePOR}[3]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{0.3mm}#2 & \\textit{\\small{#3}}
\\end{tabular*}
\\vspace{-2mm}
}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.98\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\footnotesize{#4}} \\\\
\\textit{\\footnotesize{#3}} &  \\footnotesize{#2}\\\\
\\end{tabular*}
\\vspace{-2.4mm}
}
\\newcommand{\\resumeProject}[4]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.98\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
\\footnotesize{\\textit{#2}} & \\footnotesize{#4}
\\end{tabular*}
\\vspace{-2.4mm}
}
\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}
\\renewcommand{\\labelitemi}{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*,labelsep=0mm]}
\\newcommand{\\resumeHeadingSkillStart}{\\begin{itemize}[leftmargin=*,itemsep=1.7mm, rightmargin=2ex]}
\\newcommand{\\resumeItemListStart}{\\begin{justify}\\begin{itemize}[leftmargin=3ex, rightmargin=2ex, noitemsep,labelsep=1.2mm,itemsep=0mm]\\small}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{2mm}}
\\newcommand{\\resumeHeadingSkillEnd}{\\end{itemize}\\vspace{-2mm}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\end{justify}\\vspace{-2mm}}

\\newcommand{\\cvsection}[1]{%
\\vspace{2mm}
\\begin{tcolorbox}
\\textbf{\\large #1}
\\end{tcolorbox}
\\vspace{-4mm}
}

\\begin{document}
\\fontfamily{cmr}\\selectfont
%% INSERT CONTENT HERE %%
% EXAMPLE: Use \\cvsection{Title} instead of \\section{Title}
%
% \\begin{tabularx}{\\linewidth}{L r} \\\\
% \\textbf{\\Large Name} & {\\raisebox{0.0\\height}{\\footnotesize \\faPhone}\\ Phone}\\\\
% \\end{tabularx}
% \\cvsection{Education}
\\end{document}
`,
  5: `\\documentclass[a4paper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{tabularx}
\\usepackage[sfdefault,light]{FiraSans}
\\usepackage{geometry}
\\geometry{left=1.5cm, top=1.5cm, right=1.5cm, bottom=1.5cm}

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
\\vspace{-1pt}\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textbf{#2} \\\\
\\textit{#3} & \\textit{#4} \\\\
\\end{tabular*}\\vspace{-5pt}
}
\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\pagestyle{empty}
\\begin{document}
%% INSERT CONTENT HERE %%
% Example:
% \\begin{center}
% {\\Huge \\textbf{Your Name}} \\\\
% \\vspace{2mm}
% \\small \\href{mailto:email@example.com}{email@example.com} $|$ Phone
% \\end{center}
% \\cvsection{Experience}
\\end{document}
`,
  6: `\\documentclass[letterpaper,10pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{libertine}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}

\\definecolor{accent}{RGB}{124, 45, 18} % Deep orange/red accent

\\titleformat{\\section}{\\large\\bfseries\\scshape\\raggedright\\color{accent}}{}{0pt}{}[{\\color{accent}\\vspace{-0.5em}\\rule{\\textwidth}{1.5pt}}]

\\newcommand{\\header}[4]{\\begin{center}{\\Huge\\bfseries\\color{accent} #1}\\\\\\vspace{2mm} \\small #2 $\\vert$ \\href{mailto:#3}{#3} $\\vert$ #4\\end{center}}

\\newcommand{\\subentry}[4]{
\\vspace{1mm}\\noindent\\textbf{#1}, \\textit{#2} \\hfill \\textbf{\\color{accent}#3}\\\\[1mm]\\noindent\\textit{#4}
}

\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeItemList}{\\begin{itemize}[leftmargin=*,noitemsep,topsep=2pt]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

\\pagestyle{empty}
\\begin{document}
%% INSERT CONTENT HERE %%
% Example:
% \\header{Jane Doe}{New York}{jane.doe@email.com}{linkedin.com/in/jane}
% \\section{Work History}
% \\subentry{Company Name}{Position}{Dates}{Location}
% \\resumeItemList
% \\resumeItem{Did some work}
% \\resumeItemListEnd
\\end{document}
`
};
