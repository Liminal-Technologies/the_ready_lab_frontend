import { pgTable, uuid, text, timestamp, decimal, integer, boolean, jsonb, inet } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: text("role").notNull().default("student"),
  subscriptionStatus: text("subscription_status").notNull().default("trial"),
  subscriptionTier: text("subscription_tier"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tracks = pgTable("tracks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  certificationType: text("certification_type").notNull().default("completion"),
  completionRequirement: integer("completion_requirement").notNull().default(70),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: uuid("created_by").references(() => profiles.id),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").notNull(),
  level: text("level").notNull().default("beginner"),
  estimatedHours: integer("estimated_hours").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull().default("video"),
  contentUrl: text("content_url"),
  duration: integer("duration"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"),
  progress: integer("progress").notNull().default(0),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  watchedDuration: integer("watched_duration").default(0),
  lastWatchedAt: timestamp("last_watched_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  certificateUrl: text("certificate_url"),
  verificationCode: text("verification_code").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("public"),
  trackId: uuid("track_id").references(() => tracks.id),
  createdBy: uuid("created_by").notNull().references(() => profiles.id),
  thumbnailUrl: text("thumbnail_url"),
  memberCount: integer("member_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const communityMembers = pgTable("community_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const digitalProducts = pgTable("digital_products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: uuid("creator_id").notNull().references(() => profiles.id),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  salesCount: integer("sales_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  productId: uuid("product_id").notNull().references(() => digitalProducts.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentId: text("stripe_payment_id"),
  status: text("status").notNull().default("pending"),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
});

export const stripeConnectAccounts = pgTable("stripe_connect_accounts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  stripeAccountId: text("stripe_account_id").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  detailsSubmitted: boolean("details_submitted").notNull().default(false),
  chargesEnabled: boolean("charges_enabled").notNull().default(false),
  payoutsEnabled: boolean("payouts_enabled").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const stripeSubscriptions = pgTable("stripe_subscriptions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").notNull(),
  planId: text("plan_id").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
  features: jsonb("features"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminRoles = pgTable("admin_roles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  role: text("role").notNull(),
  grantedBy: uuid("granted_by").references(() => profiles.id),
  grantedAt: timestamp("granted_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  featureFlags: jsonb("feature_flags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: uuid("actor_id").notNull().references(() => profiles.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  metadata: jsonb("metadata"),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const educatorAgreements = pgTable("educator_agreements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  educatorId: uuid("educator_id").notNull().references(() => profiles.id),
  agreementVersion: text("agreement_version").notNull(),
  agreedAt: timestamp("agreed_at").notNull().defaultNow(),
  ipAddress: inet("ip_address"),
});

export const liveEvents = pgTable("live_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: uuid("host_id").notNull().references(() => profiles.id),
  title: text("title").notNull(),
  description: text("description"),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  status: text("status").notNull().default("scheduled"),
  streamUrl: text("stream_url"),
  maxParticipants: integer("max_participants"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Micro Lessons - Short-form educational videos (<5 min)
export const microLessons = pgTable("micro_lessons", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  instructorId: uuid("instructor_id").notNull().references(() => profiles.id),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  level: text("level").notNull().default("beginner"), // beginner, intermediate, advanced
  category: text("category").notNull(),
  interestTags: jsonb("interest_tags").$type<string[]>().default([]),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  viewsCount: integer("views_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Track user interactions with micro lessons
export const microLessonLikes = pgTable("micro_lesson_likes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  microLessonId: uuid("micro_lesson_id").notNull().references(() => microLessons.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const microLessonComments = pgTable("micro_lesson_comments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  microLessonId: uuid("micro_lesson_id").notNull().references(() => microLessons.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Community Polls - For community engagement on Explore page
export const communityPolls = pgTable("community_polls", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdBy: uuid("created_by").notNull().references(() => profiles.id),
  question: text("question").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  endsAt: timestamp("ends_at"), // Optional expiration
  totalVotes: integer("total_votes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const communityPollOptions = pgTable("community_poll_options", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pollId: uuid("poll_id").notNull().references(() => communityPolls.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  votesCount: integer("votes_count").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const communityPollVotes = pgTable("community_poll_votes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pollId: uuid("poll_id").notNull().references(() => communityPolls.id, { onDelete: "cascade" }),
  optionId: uuid("option_id").notNull().references(() => communityPollOptions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").notNull().default(70),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  points: integer("points").notNull().default(1),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(),
  passed: boolean("passed").notNull(),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  bookmarkableType: text("bookmarkable_type").notNull(),
  bookmarkableId: uuid("bookmarkable_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ createdAt: true, updatedAt: true });
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCertificationSchema = createInsertSchema(certifications).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCommunitySchema = createInsertSchema(communities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDigitalProductSchema = createInsertSchema(digitalProducts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertMicroLessonSchema = createInsertSchema(microLessons).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMicroLessonCommentSchema = createInsertSchema(microLessonComments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCommunityPollSchema = createInsertSchema(communityPolls).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCommunityPollOptionSchema = createInsertSchema(communityPollOptions).omit({ id: true, createdAt: true });
export const insertCommunityPollVoteSchema = createInsertSchema(communityPollVotes).omit({ id: true, createdAt: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type DigitalProduct = typeof digitalProducts.$inferSelect;
export type InsertDigitalProduct = z.infer<typeof insertDigitalProductSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type MicroLesson = typeof microLessons.$inferSelect;
export type InsertMicroLesson = z.infer<typeof insertMicroLessonSchema>;
export type MicroLessonComment = typeof microLessonComments.$inferSelect;
export type InsertMicroLessonComment = z.infer<typeof insertMicroLessonCommentSchema>;
export type MicroLessonLike = typeof microLessonLikes.$inferSelect;
export type CommunityPoll = typeof communityPolls.$inferSelect;
export type InsertCommunityPoll = z.infer<typeof insertCommunityPollSchema>;
export type CommunityPollOption = typeof communityPollOptions.$inferSelect;
export type InsertCommunityPollOption = z.infer<typeof insertCommunityPollOptionSchema>;
export type CommunityPollVote = typeof communityPollVotes.$inferSelect;
export type InsertCommunityPollVote = z.infer<typeof insertCommunityPollVoteSchema>;
