import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getProfile(id: string): Promise<schema.Profile | undefined>;
  createProfile(data: schema.InsertProfile): Promise<schema.Profile>;
  updateProfile(id: string, data: Partial<schema.InsertProfile>): Promise<schema.Profile | undefined>;
  
  getTracks(): Promise<schema.Track[]>;
  getTrack(id: string): Promise<schema.Track | undefined>;
  createTrack(data: schema.InsertTrack): Promise<schema.Track>;
  
  getModulesByTrackId(trackId: string): Promise<schema.Module[]>;
  createModule(data: schema.InsertModule): Promise<schema.Module>;
  
  getLessonsByModuleId(moduleId: string): Promise<schema.Lesson[]>;
  getLesson(id: string): Promise<schema.Lesson | undefined>;
  createLesson(data: schema.InsertLesson): Promise<schema.Lesson>;
  
  getEnrollmentsByUserId(userId: string): Promise<schema.Enrollment[]>;
  createEnrollment(data: schema.InsertEnrollment): Promise<schema.Enrollment>;
  
  getLessonProgress(userId: string, lessonId: string): Promise<any>;
  updateLessonProgress(userId: string, lessonId: string, data: any): Promise<any>;
  
  getCertification(id: string): Promise<schema.Certification | undefined>;
  getCertificationsByUserId(userId: string): Promise<schema.Certification[]>;
  createCertification(data: schema.InsertCertification): Promise<schema.Certification>;
  
  getCommunities(): Promise<schema.Community[]>;
  createCommunity(data: schema.InsertCommunity): Promise<schema.Community>;
  
  getPostsByCommunityId(communityId: string): Promise<schema.Post[]>;
  createPost(data: schema.InsertPost): Promise<schema.Post>;
  
  getDigitalProducts(): Promise<schema.DigitalProduct[]>;
  createDigitalProduct(data: schema.InsertDigitalProduct): Promise<schema.DigitalProduct>;
  
  getNotificationsByUserId(userId: string): Promise<schema.Notification[]>;
  createNotification(data: schema.InsertNotification): Promise<schema.Notification>;
}

export class PostgresStorage implements IStorage {
  async getProfile(id: string): Promise<schema.Profile | undefined> {
    const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, id));
    return profile;
  }

  async createProfile(data: schema.InsertProfile): Promise<schema.Profile> {
    const [profile] = await db.insert(schema.profiles).values(data).returning();
    return profile;
  }

  async updateProfile(id: string, data: Partial<schema.InsertProfile>): Promise<schema.Profile | undefined> {
    const [profile] = await db.update(schema.profiles).set(data).where(eq(schema.profiles.id, id)).returning();
    return profile;
  }

  async getTracks(): Promise<schema.Track[]> {
    return await db.select().from(schema.tracks).where(eq(schema.tracks.isActive, true));
  }

  async getTrack(id: string): Promise<schema.Track | undefined> {
    const [track] = await db.select().from(schema.tracks).where(eq(schema.tracks.id, id));
    return track;
  }

  async createTrack(data: schema.InsertTrack): Promise<schema.Track> {
    const [track] = await db.insert(schema.tracks).values(data).returning();
    return track;
  }

  async getModulesByTrackId(trackId: string): Promise<schema.Module[]> {
    return await db.select().from(schema.modules).where(eq(schema.modules.trackId, trackId));
  }

  async createModule(data: schema.InsertModule): Promise<schema.Module> {
    const [module] = await db.insert(schema.modules).values(data).returning();
    return module;
  }

  async getLessonsByModuleId(moduleId: string): Promise<schema.Lesson[]> {
    return await db.select().from(schema.lessons).where(eq(schema.lessons.moduleId, moduleId));
  }

  async getLesson(id: string): Promise<schema.Lesson | undefined> {
    const [lesson] = await db.select().from(schema.lessons).where(eq(schema.lessons.id, id));
    return lesson;
  }

  async createLesson(data: schema.InsertLesson): Promise<schema.Lesson> {
    const [lesson] = await db.insert(schema.lessons).values(data).returning();
    return lesson;
  }

  async getEnrollmentsByUserId(userId: string): Promise<schema.Enrollment[]> {
    return await db.select().from(schema.enrollments).where(eq(schema.enrollments.userId, userId));
  }

  async createEnrollment(data: schema.InsertEnrollment): Promise<schema.Enrollment> {
    const [enrollment] = await db.insert(schema.enrollments).values(data).returning();
    return enrollment;
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<any> {
    const [progress] = await db.select().from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId)));
    return progress;
  }

  async updateLessonProgress(userId: string, lessonId: string, data: any): Promise<any> {
    const existing = await this.getLessonProgress(userId, lessonId);
    if (existing) {
      const [progress] = await db.update(schema.lessonProgress)
        .set(data)
        .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId)))
        .returning();
      return progress;
    } else {
      const [progress] = await db.insert(schema.lessonProgress)
        .values({ userId, lessonId, ...data })
        .returning();
      return progress;
    }
  }

  async getTrackProgress(userId: string, trackId: string): Promise<any[]> {
    const modules = await this.getModulesByTrackId(trackId);
    const moduleIds = modules.map(m => m.id);
    
    if (moduleIds.length === 0) {
      return [];
    }
    
    const lessons = await db.select().from(schema.lessons)
      .where(sql`${schema.lessons.moduleId} = ANY(${moduleIds})`);
    const lessonIds = lessons.map(l => l.id);
    
    if (lessonIds.length === 0) {
      return [];
    }
    
    return await db.select().from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        sql`${schema.lessonProgress.lessonId} = ANY(${lessonIds})`
      ));
  }

  async getCertification(id: string): Promise<schema.Certification | undefined> {
    const [certification] = await db.select().from(schema.certifications).where(eq(schema.certifications.id, id));
    return certification;
  }

  async getCertificationsByUserId(userId: string): Promise<schema.Certification[]> {
    return await db.select().from(schema.certifications).where(eq(schema.certifications.userId, userId));
  }

  async createCertification(data: schema.InsertCertification): Promise<schema.Certification> {
    const [certification] = await db.insert(schema.certifications).values(data).returning();
    return certification;
  }

  async getCommunities(): Promise<schema.Community[]> {
    return await db.select().from(schema.communities).orderBy(desc(schema.communities.createdAt));
  }

  async createCommunity(data: schema.InsertCommunity): Promise<schema.Community> {
    const [community] = await db.insert(schema.communities).values(data).returning();
    return community;
  }

  async getPostsByCommunityId(communityId: string): Promise<schema.Post[]> {
    return await db.select().from(schema.posts)
      .where(eq(schema.posts.communityId, communityId))
      .orderBy(desc(schema.posts.createdAt));
  }

  async createPost(data: schema.InsertPost): Promise<schema.Post> {
    const [post] = await db.insert(schema.posts).values(data).returning();
    return post;
  }

  async getDigitalProducts(): Promise<schema.DigitalProduct[]> {
    return await db.select().from(schema.digitalProducts)
      .where(eq(schema.digitalProducts.isActive, true))
      .orderBy(desc(schema.digitalProducts.createdAt));
  }

  async createDigitalProduct(data: schema.InsertDigitalProduct): Promise<schema.DigitalProduct> {
    const [product] = await db.insert(schema.digitalProducts).values(data).returning();
    return product;
  }

  async getNotificationsByUserId(userId: string): Promise<schema.Notification[]> {
    return await db.select().from(schema.notifications)
      .where(eq(schema.notifications.userId, userId))
      .orderBy(desc(schema.notifications.createdAt));
  }

  async createNotification(data: schema.InsertNotification): Promise<schema.Notification> {
    const [notification] = await db.insert(schema.notifications).values(data).returning();
    return notification;
  }
}

export const storage = new PostgresStorage();
