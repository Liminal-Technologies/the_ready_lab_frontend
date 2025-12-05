// localStorage utilities for educator-created courses

export interface CourseLesson {
  id: string;
  title: string;
  type: "video" | "quiz" | "reading" | "audio";
  duration: number; // in minutes
  videoUrl?: string;
  audioUrl?: string; // For audio lessons (MP3, WAV, M4A) - auditory learners
  content?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  order: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  order: number;
}

export interface EducatorCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail?: string;
  
  // Curriculum
  modules: CourseModule[];
  totalLessons: number;
  totalDuration: number; // in minutes
  
  // Pricing
  pricing: {
    type: "free" | "paid";
    amount?: number;
  };
  
  // Status
  published: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Educator info
  educatorId: string;
  educatorName: string;
  
  // Stats (tracked separately)
  enrollmentCount: number;
  revenue: number;
  rating?: number;
  reviewCount?: number;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
  progress: number; // 0-100
  completedLessons: string[];
  lastActiveAt: string;
  status: "active" | "at-risk" | "completed";
  paidAmount: number;
}

export interface RevenueTransaction {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: "pending" | "completed";
}

const STORAGE_KEYS = {
  COURSES: "educator_courses",
  ENROLLMENTS: "course_enrollments",
  TRANSACTIONS: "revenue_transactions",
};

// ============= Course CRUD Operations =============

export function getAllEducatorCourses(): EducatorCourse[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading educator courses:", error);
    return [];
  }
}

export function getAllPublishedCourses(): EducatorCourse[] {
  return getAllEducatorCourses().filter(course => course.published);
}

export function getEducatorCourseById(courseId: string): EducatorCourse | null {
  const courses = getAllEducatorCourses();
  return courses.find((course) => course.id === courseId) || null;
}

export function saveEducatorCourse(course: EducatorCourse): void {
  try {
    const courses = getAllEducatorCourses();
    const existingIndex = courses.findIndex((c) => c.id === course.id);
    
    if (existingIndex >= 0) {
      // Update existing course
      courses[existingIndex] = {
        ...course,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new course
      courses.push({
        ...course,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('educatorCoursesUpdated'));
    }
  } catch (error) {
    console.error("Error saving educator course:", error);
    throw error;
  }
}

export function deleteEducatorCourse(courseId: string): void {
  try {
    const courses = getAllEducatorCourses();
    const filtered = courses.filter((course) => course.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(filtered));
    
    // Also delete associated enrollments and transactions
    deleteEnrollmentsByCourseId(courseId);
    deleteTransactionsByCourseId(courseId);
    
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('educatorCoursesUpdated'));
    }
  } catch (error) {
    console.error("Error deleting educator course:", error);
    throw error;
  }
}

export function duplicateEducatorCourse(courseId: string): EducatorCourse | null {
  try {
    const course = getEducatorCourseById(courseId);
    if (!course) return null;
    
    const timestamp = Date.now();
    
    // Deep clone modules with new IDs for lessons to avoid collisions
    const newModules: CourseModule[] = course.modules.map((module, modIdx) => ({
      ...module,
      id: `module-${timestamp}-${modIdx}`,
      lessons: module.lessons.map((lesson, lessonIdx) => ({
        ...lesson,
        id: `lesson-${timestamp}-${modIdx}-${lessonIdx}`,
      })),
    }));
    
    const newCourse: EducatorCourse = {
      ...course,
      id: `course-${timestamp}`,
      title: `${course.title} (Copy)`,
      published: false,
      enrollmentCount: 0,
      revenue: 0,
      modules: newModules,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveEducatorCourse(newCourse);
    return newCourse;
  } catch (error) {
    console.error("Error duplicating course:", error);
    return null;
  }
}

export function toggleCoursePublished(courseId: string): boolean {
  const course = getEducatorCourseById(courseId);
  if (!course) {
    throw new Error(`Course not found: ${courseId}`);
  }
  
  course.published = !course.published;
  course.updatedAt = new Date().toISOString();
  saveEducatorCourse(course);
  return course.published;
}

// ============= Enrollment Operations =============

export function getAllEnrollments(): CourseEnrollment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading enrollments:", error);
    return [];
  }
}

export function getEnrollmentsByCourseId(courseId: string): CourseEnrollment[] {
  const enrollments = getAllEnrollments();
  return enrollments.filter((e) => e.courseId === courseId);
}

export function createEnrollment(enrollment: Omit<CourseEnrollment, "id" | "enrolledAt">): CourseEnrollment {
  try {
    // Validate courseId exists
    const course = getEducatorCourseById(enrollment.courseId);
    if (!course) {
      throw new Error(`Course not found: ${enrollment.courseId}`);
    }

    const newEnrollment: CourseEnrollment = {
      ...enrollment,
      id: `enrollment-${Date.now()}`,
      enrolledAt: new Date().toISOString(),
    };
    
    const enrollments = getAllEnrollments();
    enrollments.push(newEnrollment);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
    
    // Update course enrollment count
    updateCourseEnrollmentCount(enrollment.courseId);
    
    // Create revenue transaction if paid
    if (enrollment.paidAmount > 0) {
      createTransaction({
        courseId: enrollment.courseId,
        courseName: course.title, // Use actual course name
        studentId: enrollment.studentId,
        studentName: enrollment.studentName,
        amount: enrollment.paidAmount,
        status: "completed",
      });
    }
    
    return newEnrollment;
  } catch (error) {
    console.error("Error creating enrollment:", error);
    throw error;
  }
}

export function updateEnrollmentProgress(enrollmentId: string, completedLessons: string[]): void {
  try {
    const enrollments = getAllEnrollments();
    const enrollment = enrollments.find((e) => e.id === enrollmentId);
    
    if (!enrollment) return;
    
    const course = getEducatorCourseById(enrollment.courseId);
    if (!course) return;
    
    const progress = (completedLessons.length / course.totalLessons) * 100;
    enrollment.completedLessons = completedLessons;
    enrollment.progress = Math.round(progress);
    enrollment.lastActiveAt = new Date().toISOString();
    
    // Update status based on progress and activity
    const daysSinceActive = Math.floor(
      (Date.now() - new Date(enrollment.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (progress >= 100) {
      enrollment.status = "completed";
    } else if (daysSinceActive > 7 && progress < 50) {
      enrollment.status = "at-risk";
    } else {
      enrollment.status = "active";
    }
    
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  } catch (error) {
    console.error("Error updating enrollment progress:", error);
  }
}

function deleteEnrollmentsByCourseId(courseId: string): void {
  try {
    const enrollments = getAllEnrollments();
    const filtered = enrollments.filter((e) => e.courseId !== courseId);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting enrollments:", error);
  }
}

function updateCourseEnrollmentCount(courseId: string): void {
  try {
    const course = getEducatorCourseById(courseId);
    if (!course) return;
    
    const enrollments = getEnrollmentsByCourseId(courseId);
    course.enrollmentCount = enrollments.length;
    saveEducatorCourse(course);
  } catch (error) {
    console.error("Error updating enrollment count:", error);
  }
}

// ============= Revenue Transaction Operations =============

export function getAllTransactions(): RevenueTransaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading transactions:", error);
    return [];
  }
}

export function getTransactionsByCourseId(courseId: string): RevenueTransaction[] {
  const transactions = getAllTransactions();
  return transactions.filter((t) => t.courseId === courseId);
}

export function createTransaction(transaction: Omit<RevenueTransaction, "id" | "date">): RevenueTransaction {
  try {
    const newTransaction: RevenueTransaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    const transactions = getAllTransactions();
    transactions.push(newTransaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    // Update course revenue
    updateCourseRevenue(transaction.courseId, transaction.amount);
    
    return newTransaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

function deleteTransactionsByCourseId(courseId: string): void {
  try {
    const transactions = getAllTransactions();
    const filtered = transactions.filter((t) => t.courseId !== courseId);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting transactions:", error);
  }
}

function updateCourseRevenue(courseId: string, amount: number): void {
  try {
    const course = getEducatorCourseById(courseId);
    if (!course) return;
    
    course.revenue = (course.revenue || 0) + amount;
    saveEducatorCourse(course);
  } catch (error) {
    console.error("Error updating course revenue:", error);
  }
}

// ============= Analytics Helpers =============

export function getEducatorStats() {
  const courses = getAllEducatorCourses();
  const enrollments = getAllEnrollments();
  const transactions = getAllTransactions();
  
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.published).length;
  const totalStudents = new Set(enrollments.map((e) => e.studentId)).size;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalEnrollments = enrollments.length;
  
  const activeStudents = enrollments.filter((e) => e.status === "active").length;
  const atRiskStudents = enrollments.filter((e) => e.status === "at-risk").length;
  const completedStudents = enrollments.filter((e) => e.status === "completed").length;
  
  return {
    totalCourses,
    publishedCourses,
    totalStudents,
    totalRevenue,
    totalEnrollments,
    activeStudents,
    atRiskStudents,
    completedStudents,
  };
}

export function getCourseRevenueBreakdown() {
  const courses = getAllEducatorCourses();
  const transactions = getAllTransactions();
  
  return courses.map((course) => {
    const courseTransactions = transactions.filter((t) => t.courseId === course.id);
    const revenue = courseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      courseId: course.id,
      courseName: course.title,
      revenue,
      enrollments: course.enrollmentCount,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function getRevenueMetrics() {
  const transactions = getAllTransactions();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate this month's revenue
  const thisMonthRevenue = transactions
    .filter((t) => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && t.status === "completed";
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate last month's revenue
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthRevenue = transactions
    .filter((t) => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear && t.status === "completed";
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate all-time revenue
  const allTimeRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate pending payout (last 7 days of completed transactions)
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const pendingPayout = transactions
    .filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= sevenDaysAgo && t.status === "completed";
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate revenue by course for this month
  const courseBreakdown = getCourseRevenueBreakdown();
  const thisMonthCourseRevenue = courseBreakdown.map((course) => {
    const thisMonthCourseTransactions = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return t.courseId === course.courseId && 
             txDate.getMonth() === currentMonth && 
             txDate.getFullYear() === currentYear &&
             t.status === "completed";
    });
    return {
      ...course,
      revenue: thisMonthCourseTransactions.reduce((sum, t) => sum + t.amount, 0),
    };
  }).filter((c) => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  
  // Calculate monthly trend (last 6 months)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const targetMonth = currentMonth - i;
    const targetYear = currentYear;
    let month = targetMonth;
    let year = targetYear;
    
    if (targetMonth < 0) {
      month = 12 + targetMonth;
      year = targetYear - 1;
    }
    
    const monthRevenue = transactions
      .filter((t) => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === month && txDate.getFullYear() === year && t.status === "completed";
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyTrend.push({
      month: monthNames[month],
      amount: monthRevenue,
    });
  }
  
  return {
    thisMonthRevenue,
    lastMonthRevenue,
    allTimeRevenue,
    pendingPayout,
    thisMonthCourseRevenue,
    monthlyTrend,
    percentageChange: lastMonthRevenue > 0 
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0,
  };
}

// ============= Clear Demo Data =============

export function clearAllEducatorData(): void {
  localStorage.removeItem(STORAGE_KEYS.COURSES);
  localStorage.removeItem(STORAGE_KEYS.ENROLLMENTS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
}
