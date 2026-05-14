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
\\begin{tabular*}{0.97\\textwidth}[t]{ l@ {\\extracolsep{\\fill}}r}
\\textbf{#1} & #2 \\\\
\\textit{#3} & \\textit{#4} \\\\
\\end{tabular*}\\vspace{-7pt}
}
\\renewcommand\\labelitemii{$\\bullet$}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}`,
  
  2: `\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{wrapfig}
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
\\newcommand{\\resumeItem}[2]{\\item{\\textbf{#1}{\\hspace{0.5mm}#2 \\vspace{-0.5mm}}}}
\\newcommand{\\resumePOR}[3]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.97\\textwidth}[t]{ l@ {\\extracolsep{\\fill}}r}
\\textbf{#1}\\hspace{0.3mm}#2 & \\textit{\\small{#3}}
\\end{tabular*}
\\vspace{-2mm}
}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.98\\textwidth}[t]{ l@ {\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\footnotesize{#4}} \\\\
\\textit{\\footnotesize{#3}} &  \\footnotesize{#2}\\\\
\\end{tabular*}
\\vspace{-2.4mm}
}
\\newcommand{\\resumeProject}[4]{
\\vspace{0.5mm}\\item
\\begin{tabular*}{0.98\\textwidth}[t]{ l@ {\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
\\footnotesize{\\textit{#2}} & \\footnotesize{#4}
\\end{tabular*}
\\vspace{-2.4mm}
}
\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}
\\renewcommand{\\labelitemi}{$\\bullet$}
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
\\newcolumntype{L}{>{\\raggedright\\arraybackslash}X}
\\newcolumntype{R}{>{\\raggedleft\\arraybackslash}X}
\\newcolumntype{C}{>{\\centering\\arraybackslash}X}`,
  
  3: `\\documentclass[letterpaper,11pt]{article}
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
\\pdfgentounicode=1`,

  4: `\\documentclass[10pt, letterpaper]{article}
\\usepackage[letterpaper,margin=0.5in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{tgpagella}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{color}
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0pt}{}[\\normalsize\\vspace{-0.5\\baselineskip}\\rule{\\textwidth}{0.4pt}]
\\newcommand{\\name}[1]{\\centerline{\\Huge\\bfseries #1}\\vspace{0.5ex}}
\\newcommand{\\contact}[1]{\\centerline{\\small #1}\\vspace{1ex}}
\\newcommand{\\entry}[4]{
  \\noindent\\textbf{#1}\\hfill\\textbf{#2}\\\\
  \\noindent\\textit{#3}\\hfill\\textit{#4}\\\\
}`,

  5: `\\documentclass[11pt, a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=0.7in}
\\usepackage{charter}
\\usepackage{enumitem}
\\usepackage{tabularx}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\titleformat{\\section}{\\large\\scshape\\bfseries\\raggedright}{}{0em}{}[\\titlerule]
\\renewcommand{\\arraystretch}{1.2}
\\newcommand{\\heading}[3]{\\begin{center}{\\LARGE \\textbf{#1}}\\\\[2pt]{#2} | {#3}\\end{center}}
\\newcommand{\\experience}[4]{\\noindent\\textbf{#1} \\hfill #2\\\\\\textit{#3} \\hfill \\textit{#4}\\\\}`,

  6: `\\documentclass[10pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{libertine}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\titleformat{\\section}{\\large\\bfseries\\scshape\\raggedright}{}{0pt}{}[\\vspace{-0.5em}\\rule{\\textwidth}{1pt}]
\\newcommand{\\header}[4]{\\begin{center}{\\Huge\\bfseries #1}\\\\\\vspace{1mm} #2 $\\vert$ #3 $\\vert$ #4\\end{center}}
\\newcommand{\\subentry}[4]{\\vspace{1mm}\\noindent\\textbf{#1}, \\textit{#2} \\hfill #3\\\\[-1mm]\\noindent\\textit{#4}}`
};
