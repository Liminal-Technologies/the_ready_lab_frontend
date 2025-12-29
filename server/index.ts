import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { router } from "./routes";
import { setupVite } from "./vite";
import path from "path";

const app = express();
const server = createServer(app);

app.use((req, res, next) => {
  if (req.path === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use(router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "dist/public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist/public/index.html"));
  });
} else {
  await setupVite(app);
}

const PORT = process.env.PORT || 5001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
