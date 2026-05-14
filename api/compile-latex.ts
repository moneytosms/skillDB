import fs from 'fs';
import os from 'os';
import path from 'path';
import tar from 'tar';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { latex } = req.body;
    if (!latex) return res.status(400).json({ error: "LaTeX content is required" });

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "latex-"));
    const texPath = path.join(tmpDir, "main.tex");
    const tarPath = path.join(tmpDir, "main.tar.gz");

    fs.writeFileSync(texPath, latex);

    await tar.c({ gzip: true, file: tarPath, cwd: tmpDir }, ["main.tex"]);

    const buffer = fs.readFileSync(tarPath);
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: "application/gzip" }), "main.tar.gz");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch("https://latexonline.cc/data?target=main.tex&command=pdflatex", {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      fs.rmSync(tmpDir, { recursive: true, force: true });
      return res.status(response.status).json({ error: "Compilation failed", details: errorText });
    }

    const pdfBuffer = await response.arrayBuffer();

    fs.rmSync(tmpDir, { recursive: true, force: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
    res.send(Buffer.from(pdfBuffer));

  } catch (err: any) {
    console.error("Vercel /api/compile-latex Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
