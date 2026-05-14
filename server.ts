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

      // We'll post the form data to latexonline.cc
      const formData = new URLSearchParams();
      formData.append("text", latex);

      const response = await fetch("https://latexonline.cc/compile", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("LaTeX compilation failed:", errorText);
        return res.status(response.status).json({ error: "Compilation failed", details: errorText });
      }

      // Get the PDF as an arraybuffer
      const pdfBuffer = await response.arrayBuffer();

      // Send the PDF back to the client
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; inline=resume.pdf");
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
