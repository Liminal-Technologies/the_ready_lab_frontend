export interface EducatorAnalyticsData {
  overview: {
    educatorName: string;
    totalCourses: number;
    publishedCourses: number;
    totalStudents: number;
    totalRevenue: number;
  };
  enrollments: {
    totalEnrollments: number;
    thisMonthEnrollments: number;
    enrollmentsByCourseName: Array<{ course: string; enrollments: number }>;
  };
  coursePerformance: {
    courses: Array<{
      name: string;
      students: number;
      completionRate: number;
      avgProgress: number;
      revenue: number;
    }>;
    overallCompletionRate: number;
    avgCourseRating: number;
  };
  revenue: {
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    allTimeRevenue: number;
    pendingPayout: number;
    recentTransactions: Array<{
      student: string;
      course: string;
      amount: number;
      date: string;
    }>;
  };
  engagement: {
    activeStudents: number;
    atRiskStudents: number;
    completedStudents: number;
    avgStudentProgress: number;
    questionsReceived: number;
  };
}

export function getDefaultEducatorAnalyticsData(educatorName: string = "Educator"): EducatorAnalyticsData {
  return {
    overview: {
      educatorName,
      totalCourses: 5,
      publishedCourses: 4,
      totalStudents: 156,
      totalRevenue: 15444,
    },
    enrollments: {
      totalEnrollments: 189,
      thisMonthEnrollments: 23,
      enrollmentsByCourseName: [
        { course: "Funding Essentials", enrollments: 45 },
        { course: "Legal Framework", enrollments: 38 },
        { course: "Marketing Basics", enrollments: 32 },
        { course: "Operations Guide", enrollments: 28 },
        { course: "Product Development", enrollments: 13 },
      ],
    },
    coursePerformance: {
      courses: [
        { name: "Funding Essentials", students: 45, completionRate: 72, avgProgress: 68, revenue: 4455 },
        { name: "Legal Framework", students: 38, completionRate: 65, avgProgress: 58, revenue: 3762 },
        { name: "Marketing Basics", students: 32, completionRate: 78, avgProgress: 71, revenue: 3168 },
        { name: "Operations Guide", students: 28, completionRate: 81, avgProgress: 75, revenue: 2772 },
        { name: "Product Development", students: 13, completionRate: 54, avgProgress: 45, revenue: 1287 },
      ],
      overallCompletionRate: 68,
      avgCourseRating: 4.7,
    },
    revenue: {
      thisMonthRevenue: 3847,
      lastMonthRevenue: 3100,
      allTimeRevenue: 15444,
      pendingPayout: 847,
      recentTransactions: [
        { student: "Sarah Johnson", course: "Funding Essentials", amount: 99, date: "2 hours ago" },
        { student: "Michael Chen", course: "Legal Framework", amount: 99, date: "5 hours ago" },
        { student: "Emma Davis", course: "Funding Essentials", amount: 99, date: "1 day ago" },
        { student: "David Martinez", course: "Marketing Basics", amount: 99, date: "1 day ago" },
        { student: "Lisa Anderson", course: "Operations Guide", amount: 99, date: "2 days ago" },
      ],
    },
    engagement: {
      activeStudents: 124,
      atRiskStudents: 12,
      completedStudents: 20,
      avgStudentProgress: 65,
      questionsReceived: 47,
    },
  };
}

export interface EducatorDataInput {
  educatorName?: string;
  totalCourses?: number;
  publishedCourses?: number;
  totalStudents?: number;
  totalRevenue?: number;
  totalEnrollments?: number;
  activeStudents?: number;
  atRiskStudents?: number;
  completedStudents?: number;
  thisMonthRevenue?: number;
  lastMonthRevenue?: number;
  allTimeRevenue?: number;
  pendingPayout?: number;
}

export function mergeEducatorDataWithDefaults(input?: EducatorDataInput | null): EducatorAnalyticsData {
  const defaults = getDefaultEducatorAnalyticsData(input?.educatorName || "Educator");

  if (!input) return defaults;

  return {
    overview: {
      educatorName: input.educatorName || defaults.overview.educatorName,
      totalCourses: input.totalCourses ?? defaults.overview.totalCourses,
      publishedCourses: input.publishedCourses ?? defaults.overview.publishedCourses,
      totalStudents: input.totalStudents ?? defaults.overview.totalStudents,
      totalRevenue: input.totalRevenue ?? defaults.overview.totalRevenue,
    },
    enrollments: {
      totalEnrollments: input.totalEnrollments ?? defaults.enrollments.totalEnrollments,
      thisMonthEnrollments: defaults.enrollments.thisMonthEnrollments,
      enrollmentsByCourseName: defaults.enrollments.enrollmentsByCourseName,
    },
    coursePerformance: defaults.coursePerformance,
    revenue: {
      thisMonthRevenue: input.thisMonthRevenue ?? defaults.revenue.thisMonthRevenue,
      lastMonthRevenue: input.lastMonthRevenue ?? defaults.revenue.lastMonthRevenue,
      allTimeRevenue: input.allTimeRevenue ?? defaults.revenue.allTimeRevenue,
      pendingPayout: input.pendingPayout ?? defaults.revenue.pendingPayout,
      recentTransactions: defaults.revenue.recentTransactions,
    },
    engagement: {
      activeStudents: input.activeStudents ?? defaults.engagement.activeStudents,
      atRiskStudents: input.atRiskStudents ?? defaults.engagement.atRiskStudents,
      completedStudents: input.completedStudents ?? defaults.engagement.completedStudents,
      avgStudentProgress: defaults.engagement.avgStudentProgress,
      questionsReceived: defaults.engagement.questionsReceived,
    },
  };
}

export function generateEducatorAnalyticsCSV(data: EducatorAnalyticsData): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [
    '=== EDUCATOR ANALYTICS REPORT ===',
    `Educator: ${data.overview.educatorName}`,
    `Generated: ${dateStr} at ${timeStr}`,
    '',
    '',
    '--- OVERVIEW ---',
    'Metric,Value',
    `Total Courses,${data.overview.totalCourses}`,
    `Published Courses,${data.overview.publishedCourses}`,
    `Total Students,${data.overview.totalStudents}`,
    `Total Revenue,$${data.overview.totalRevenue.toLocaleString()}`,
    '',
    '',
    '--- STUDENT ENROLLMENTS ---',
    'Metric,Value',
    `Total Enrollments,${data.enrollments.totalEnrollments}`,
    `This Month Enrollments,${data.enrollments.thisMonthEnrollments}`,
    '',
    'Course,Enrollments',
    ...data.enrollments.enrollmentsByCourseName.map(
      (e) => `${e.course},${e.enrollments}`
    ),
    '',
    '',
    '--- COURSE PERFORMANCE ---',
    'Metric,Value',
    `Overall Completion Rate,${data.coursePerformance.overallCompletionRate}%`,
    `Average Course Rating,${data.coursePerformance.avgCourseRating} / 5.0`,
    '',
    'Course,Students,Completion Rate,Avg Progress,Revenue',
    ...data.coursePerformance.courses.map(
      (c) => `${c.name},${c.students},${c.completionRate}%,${c.avgProgress}%,$${c.revenue}`
    ),
    '',
    '',
    '--- REVENUE & TRANSACTIONS ---',
    'Metric,Value',
    `This Month Revenue,$${data.revenue.thisMonthRevenue.toLocaleString()}`,
    `Last Month Revenue,$${data.revenue.lastMonthRevenue.toLocaleString()}`,
    `All-Time Revenue,$${data.revenue.allTimeRevenue.toLocaleString()}`,
    `Pending Payout,$${data.revenue.pendingPayout.toLocaleString()}`,
    '',
    'Recent Transactions',
    'Student,Course,Amount,Date',
    ...data.revenue.recentTransactions.map(
      (t) => `${t.student},${t.course},$${t.amount},${t.date}`
    ),
    '',
    '',
    '--- STUDENT ENGAGEMENT ---',
    'Metric,Value',
    `Active Students,${data.engagement.activeStudents}`,
    `At-Risk Students,${data.engagement.atRiskStudents}`,
    `Completed Students,${data.engagement.completedStudents}`,
    `Average Student Progress,${data.engagement.avgStudentProgress}%`,
    `Questions Received,${data.engagement.questionsReceived}`,
    '',
    '',
    '--- END OF REPORT ---',
  ];

  return lines.join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportEducatorAnalytics(educatorData?: EducatorDataInput | null): void {
  const data = mergeEducatorDataWithDefaults(educatorData);
  const csv = generateEducatorAnalyticsCSV(data);
  const date = new Date().toISOString().split('T')[0];
  const safeName = data.overview.educatorName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  downloadCSV(csv, `educator-analytics-${safeName}-${date}.csv`);
}
