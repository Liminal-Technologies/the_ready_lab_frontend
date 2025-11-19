/**
 * Auto Demo Manager
 * Handles the automation after course creation: enrollment, lesson playback, analytics
 */

import { createEnrollment } from './educatorCoursesStorage';

/**
 * Auto-enroll a demo student in the newly created course
 */
export async function autoEnrollStudent(courseId: string): Promise<string> {
  // Create a demo student enrollment
  const enrollment = createEnrollment({
    courseId,
    studentId: 'demo-student-1',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.morgan@demo.com',
    progress: 0,
    completedLessons: [],
    lastActiveAt: new Date().toISOString(),
    status: 'active',
    paidAmount: 99,
  });

  return enrollment.id;
}

/**
 * Navigate to course detail page
 */
export function navigateToCourse(courseId: string): void {
  if (typeof window !== 'undefined') {
    // Use timeout to allow visual transition
    setTimeout(() => {
      window.location.href = `/courses/${courseId}`;
    }, 1000);
  }
}

/**
 * Auto-play a lesson and mark it complete
 */
export function autoPlayLesson(courseId: string, lessonId: string): void {
  if (typeof window !== 'undefined') {
    // Navigate to lesson player
    setTimeout(() => {
      window.location.href = `/courses/${courseId}/lesson/${lessonId}`;
      
      // Auto-mark as complete after a delay
      setTimeout(() => {
        markLessonComplete(courseId, lessonId);
      }, 2000);
    }, 1000);
  }
}

/**
 * Mark a lesson as complete (for demo purposes)
 */
export function markLessonComplete(courseId: string, lessonId: string): void {
  if (typeof window === 'undefined') return;

  const storageKey = `course-${courseId}-completed-lessons`;
  try {
    const existingData = localStorage.getItem(storageKey);
    const completedLessons = existingData ? JSON.parse(existingData) : [];
    
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      
      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent('lessonCompleted', {
        detail: { courseId, lessonId }
      }));
    }
  } catch (error) {
    console.error('Error marking lesson complete:', error);
  }
}

/**
 * Navigate to analytics dashboard
 */
export function navigateToAnalytics(): void {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = '/educator/students';
    }, 1000);
  }
}

/**
 * Complete the auto-demo flow by navigating to the educator dashboard
 */
export function completeAutoDemo(): void {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = '/educator/dashboard';
    }, 2000);
  }
}
