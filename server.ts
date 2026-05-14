import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json({ limit: "10mb" }));

  // API route for LaTeX compilation
  app.post("/api/compile-latex", async (req, res) => {
    try {
      const { latex } = req.body;
      
      if (!latex) {
        return res.status(400).json({ error: "LaTeX content is required" });
      }

      // We'll create a tarball to upload to latexonline
      const os = require('os');
      const fs = require('fs');
      const tar = require('tar');
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "latex-"));
      const texPath = path.join(tmpDir, "main.tex");
      const tarPath = path.join(tmpDir, "main.tar.gz");

      fs.writeFileSync(texPath, latex);

      await tar.c({ gzip: true, file: tarPath, cwd: tmpDir }, ["main.tex"]);

      const buffer = fs.readFileSync(tarPath);
      const form = new FormData();
      form.append("file", new Blob([buffer], { type: "application/gzip" }), "main.tar.gz");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch("https://latexonline.cc/data?target=main.tex&command=pdflatex", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("LaTeX compilation failed:", errorText);
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return res.status(response.status).json({ error: "Compilation failed", details: errorText });
      }

      // Get the PDF as an arraybuffer
      const pdfBuffer = await response.arrayBuffer();

      fs.rmSync(tmpDir, { recursive: true, force: true });

      // Send the PDF back to the client
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
      res.send(Buffer.from(pdfBuffer));
    } catch (err: any) {
      console.error("/api/compile-latex Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
