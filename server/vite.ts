import { createServer as createViteServer } from "vite";
import type { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export async function setupVite(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  // SPA fallback - serve index.html for all non-API routes
  // This middleware runs after vite.middlewares, so it only catches unhandled routes
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    // Skip API routes
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    // Skip if response already sent or it's a file request handled by Vite
    if (res.headersSent) {
      return next();
    }

    try {
      const url = req.originalUrl;

      // Read index.html
      let template = fs.readFileSync(
        path.resolve(process.cwd(), "index.html"),
        "utf-8"
      );

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // Send the HTML
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return vite;
}
