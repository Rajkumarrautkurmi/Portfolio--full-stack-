import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Database Setup (SQLite as a reliable local alternative to MongoDB for this environment)
  const db = new Database("portfolio.db");
  
  // Initialize Database Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      tags TEXT,
      link TEXT,
      github TEXT
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level INTEGER
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      email TEXT,
      location TEXT,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial data if empty
  const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (projectCount.count === 0) {
    db.prepare("INSERT INTO projects (title, description, image, tags, link, github) VALUES (?, ?, ?, ?, ?, ?)").run(
      "E-Commerce Platform",
      "A full-featured online store with payment integration.",
      "https://picsum.photos/seed/shop/800/600",
      "React,Node.js,MongoDB",
      "https://github.com/Rajkumarrautkurmi",
      "https://github.com/Rajkumarrautkurmi"
    );
    db.prepare("INSERT INTO projects (title, description, image, tags, link, github) VALUES (?, ?, ?, ?, ?, ?)").run(
      "AI Chat Assistant",
      "Intelligent chatbot powered by Gemini API.",
      "https://picsum.photos/seed/ai/800/600",
      "TypeScript,Gemini,Vite",
      "https://github.com/Rajkumarrautkurmi",
      "https://github.com/Rajkumarrautkurmi"
    );
    db.prepare("INSERT INTO projects (title, description, image, tags, link, github) VALUES (?, ?, ?, ?, ?, ?)").run(
      "Recipe Sharing Platform",
      "A community-driven platform for sharing and discovering recipes.",
      "https://picsum.photos/seed/recipe/800/600",
      "React,Tailwind,SQLite",
      "https://github.com/Rajkumarrautkurmi",
      "https://github.com/Rajkumarrautkurmi"
    );
  }

  const profileCount = db.prepare("SELECT COUNT(*) as count FROM profile").get() as { count: number };
  if (profileCount.count === 0) {
    db.prepare("INSERT INTO profile (name, role, bio, email, location, avatar) VALUES (?, ?, ?, ?, ?, ?)").run(
      "rajkumar raut kurmi",
      "Full Stack Software Engineer",
      "Passionate developer proficient in C, C++, Java, and Python. I specialize in building scalable web applications using MongoDB and SQLite, and love turning complex problems into simple, beautiful, and intuitive designs.",
      "rajkumarraut_kurmi@srmap.edu.in",
      "India",
      "https://github.com/Rajkumarrautkurmi.png"
    );
  } else {
    // Ensure the avatar is updated to the GitHub profile picture for existing records
    db.prepare("UPDATE profile SET avatar = ? WHERE id = 1").run("https://github.com/Rajkumarrautkurmi.png");
  }

  // API Routes
  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM profile LIMIT 1").get();
    res.json(profile);
  });

  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects.map((p: any) => ({ ...p, tags: p.tags.split(",") })));
  });

  app.get("/api/skills", (req, res) => {
    const skills = db.prepare("SELECT * FROM skills").all();
    res.json(skills);
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      db.prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)").run(
        name, email, subject || "No Subject", message
      );
      res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save message" });
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
