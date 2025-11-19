/**
 * Clear all student-specific demo data from localStorage
 * This ensures the demo student account starts fresh on each login
 */
export const clearDemoStudentData = () => {
  const keysToRemove: string[] = [];
  
  // Iterate through all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    // Identify student-specific keys to remove
    if (
      key.startsWith('course-') ||           // Course progress: course-{id}-completed-lessons, course-{id}-shown-milestones
      key === 'onboardingData' ||            // Onboarding data
      key === 'joinedCommunities' ||         // Community memberships
      key === 'bookmarkedCourses' ||         // Bookmarked courses
      key === 'enrolledCourses' ||           // Enrolled courses
      key === 'completedCourses' ||          // Completed courses
      key.startsWith('enrollment-') ||       // Enrollment-specific data
      key.startsWith('certificate-') ||      // Certificate data
      key.startsWith('community-posts-')     // Community posts
    ) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all identified keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`[Demo Reset] Cleared ${keysToRemove.length} student-specific localStorage keys`);
};
