import express, { Request, Response } from "express";
import { storage } from "./storage";
import { insertProfileSchema, insertTrackSchema, insertEnrollmentSchema, insertPostSchema } from "@shared/schema";
import { stripeRouter } from "./stripe-routes";
import { streamCertificatePDF } from "./certificate-generator";
import { verifySupabaseToken } from "./supabase";

export const router = express.Router();

router.use(stripeRouter);

router.post("/api/profiles/create-on-signup", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    const user = await verifySupabaseToken(authHeader || null);
    
    const role = user.user_metadata?.role || 'student';
    const fullName = user.user_metadata?.full_name || user.email;
    
    const allowedRoles = ['student', 'educator'];
    const sanitizedRole = allowedRoles.includes(role) ? role : 'student';
    
    const profileData = {
      id: user.id,
      email: user.email!,
      fullName: fullName,
      role: sanitizedRole
    };
    
    const profile = await storage.createProfile(profileData);
    
    res.status(201).json(profile);
  } catch (error: any) {
    console.error("Error creating profile on signup:", error);
    res.status(401).json({ error: error.message || "Unauthorized" });
  }
});

router.get("/api/profiles/:id", async (req: Request, res: Response) => {
  try {
    const profile = await storage.getProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/profiles", async (req: Request, res: Response) => {
  try {
    const data = insertProfileSchema.parse(req.body);
    const profile = await storage.createProfile(data);
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(400).json({ error: "Invalid profile data" });
  }
});

router.get("/api/tracks", async (req: Request, res: Response) => {
  try {
    const tracks = await storage.getTracks();
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/tracks/:id", async (req: Request, res: Response) => {
  try {
    const track = await storage.getTrack(req.params.id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(track);
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/tracks/:id/modules", async (req: Request, res: Response) => {
  try {
    const modules = await storage.getModulesByTrackId(req.params.id);
    res.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/modules/:id/lessons", async (req: Request, res: Response) => {
  try {
    const lessons = await storage.getLessonsByModuleId(req.params.id);
    res.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/lessons/:id", async (req: Request, res: Response) => {
  try {
    const lesson = await storage.getLesson(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/enrollments/user/:userId", async (req: Request, res: Response) => {
  try {
    const enrollments = await storage.getEnrollmentsByUserId(req.params.userId);
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/enrollments", async (req: Request, res: Response) => {
  try {
    const data = insertEnrollmentSchema.parse(req.body);
    const enrollment = await storage.createEnrollment(data);
    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(400).json({ error: "Invalid enrollment data" });
  }
});

router.get("/api/certifications/user/:userId", async (req: Request, res: Response) => {
  try {
    const certifications = await storage.getCertificationsByUserId(req.params.userId);
    res.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/certifications/:id/download", async (req: Request, res: Response) => {
  try {
    const certification = await storage.getCertification(req.params.id);
    if (!certification) {
      return res.status(404).json({ error: "Certification not found" });
    }

    const track = await storage.getTrack(certification.trackId);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const profile = await storage.getProfile(certification.userId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const pdfStream = streamCertificatePDF({
      certification,
      track,
      profile
    });

    const fileName = `certificate-${track.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    pdfStream.pipe(res);
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
});

router.get("/api/communities", async (req: Request, res: Response) => {
  try {
    const communities = await storage.getCommunities();
    res.json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/communities/:id/posts", async (req: Request, res: Response) => {
  try {
    const posts = await storage.getPostsByCommunityId(req.params.id);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/posts", async (req: Request, res: Response) => {
  try {
    const data = insertPostSchema.parse(req.body);
    const post = await storage.createPost(data);
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ error: "Invalid post data" });
  }
});

router.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await storage.getDigitalProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/notifications/user/:userId", async (req: Request, res: Response) => {
  try {
    const notifications = await storage.getNotificationsByUserId(req.params.userId);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
