import * as XLSX from 'xlsx';

export interface AnalyticsData {
  users: {
    totalUsers: number;
    students: number;
    educators: number;
    admins: number;
    activeUsers: number;
    newUsersThisMonth: number;
  };
  courses: {
    totalCourses: number;
    totalEnrollments: number;
    completionRate: number;
    courseCompletions: number;
    averageRating: number;
  };
  certifications: {
    certificatesIssued: number;
    verificationsThisMonth: number;
    linkedInShares: number;
  };
  products: {
    totalProducts: number;
    productsPurchased: number;
    totalRevenue: number;
    totalDownloads: number;
  };
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    avgSessionDuration: string;
    retentionRate: number;
  };
  community: {
    activeCommunities: number;
    totalPosts: number;
    totalMembers: number;
  };
  revenue: {
    monthlyRevenue: number;
    totalGMV: number;
    platformFeePercent: number;
    pendingPayouts: number;
  };
}

export interface CourseDetail {
  name: string;
  instructor: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  rating: number;
  revenue: number;
  category: string;
}

export interface StudentDetail {
  name: string;
  email: string;
  enrolledCourses: number;
  completedCourses: number;
  certifications: number;
  totalSpent: number;
  joinDate: string;
  lastActive: string;
}

export interface RevenueDetail {
  month: string;
  courseRevenue: number;
  productRevenue: number;
  subscriptionRevenue: number;
  totalRevenue: number;
  platformFees: number;
  netRevenue: number;
}

export function getDefaultAnalyticsData(): AnalyticsData {
  return {
    users: {
      totalUsers: 2847,
      students: 2234,
      educators: 486,
      admins: 127,
      activeUsers: 1823,
      newUsersThisMonth: 234,
    },
    courses: {
      totalCourses: 45,
      totalEnrollments: 3247,
      completionRate: 68,
      courseCompletions: 2208,
      averageRating: 4.7,
    },
    certifications: {
      certificatesIssued: 873,
      verificationsThisMonth: 156,
      linkedInShares: 423,
    },
    products: {
      totalProducts: 28,
      productsPurchased: 156,
      totalRevenue: 4890,
      totalDownloads: 1480,
    },
    engagement: {
      dailyActiveUsers: 423,
      weeklyActiveUsers: 1247,
      monthlyActiveUsers: 2156,
      avgSessionDuration: "18 min",
      retentionRate: 72,
    },
    community: {
      activeCommunities: 24,
      totalPosts: 1567,
      totalMembers: 2134,
    },
    revenue: {
      monthlyRevenue: 45670,
      totalGMV: 234500,
      platformFeePercent: 15,
      pendingPayouts: 8750,
    },
  };
}

export function getDetailedCourseData(): CourseDetail[] {
  return [
    { name: "Business Foundations for Entrepreneurs", instructor: "Dr. Sarah Chen", enrollments: 456, completions: 312, completionRate: 68, rating: 4.8, revenue: 22800, category: "Business" },
    { name: "Digital Marketing Mastery", instructor: "Marcus Johnson", enrollments: 389, completions: 278, completionRate: 71, rating: 4.6, revenue: 19450, category: "Marketing" },
    { name: "Financial Planning & Analysis", instructor: "Dr. Emily Watson", enrollments: 312, completions: 198, completionRate: 63, rating: 4.9, revenue: 31200, category: "Finance" },
    { name: "Leadership & Team Management", instructor: "James Rodriguez", enrollments: 287, completions: 201, completionRate: 70, rating: 4.7, revenue: 14350, category: "Leadership" },
    { name: "Product Development Strategy", instructor: "Lisa Park", enrollments: 245, completions: 178, completionRate: 73, rating: 4.5, revenue: 24500, category: "Product" },
    { name: "Sales Fundamentals", instructor: "Michael Brown", enrollments: 234, completions: 156, completionRate: 67, rating: 4.4, revenue: 11700, category: "Sales" },
    { name: "Data-Driven Decision Making", instructor: "Dr. Priya Patel", enrollments: 198, completions: 134, completionRate: 68, rating: 4.8, revenue: 19800, category: "Analytics" },
    { name: "Startup Legal Essentials", instructor: "Attorney David Kim", enrollments: 178, completions: 145, completionRate: 81, rating: 4.6, revenue: 26700, category: "Legal" },
    { name: "Brand Building Workshop", instructor: "Sophie Martinez", enrollments: 156, completions: 112, completionRate: 72, rating: 4.7, revenue: 7800, category: "Marketing" },
    { name: "Investor Pitch Preparation", instructor: "Dr. Sarah Chen", enrollments: 145, completions: 98, completionRate: 68, rating: 4.9, revenue: 21750, category: "Fundraising" },
    { name: "Operations & Scaling", instructor: "Chris Thompson", enrollments: 134, completions: 89, completionRate: 66, rating: 4.5, revenue: 13400, category: "Operations" },
    { name: "Customer Success Strategies", instructor: "Amanda Lee", enrollments: 123, completions: 87, completionRate: 71, rating: 4.6, revenue: 6150, category: "Customer Success" },
  ];
}

export function getDetailedStudentData(): StudentDetail[] {
  return [
    { name: "Alex Thompson", email: "alex.t@email.com", enrolledCourses: 5, completedCourses: 4, certifications: 3, totalSpent: 495, joinDate: "2024-01-15", lastActive: "2024-12-15" },
    { name: "Maria Garcia", email: "m.garcia@email.com", enrolledCourses: 3, completedCourses: 3, certifications: 3, totalSpent: 297, joinDate: "2024-02-20", lastActive: "2024-12-14" },
    { name: "James Wilson", email: "j.wilson@email.com", enrolledCourses: 7, completedCourses: 5, certifications: 4, totalSpent: 693, joinDate: "2023-11-10", lastActive: "2024-12-15" },
    { name: "Sarah Johnson", email: "s.johnson@email.com", enrolledCourses: 4, completedCourses: 2, certifications: 2, totalSpent: 396, joinDate: "2024-03-05", lastActive: "2024-12-13" },
    { name: "Michael Chen", email: "m.chen@email.com", enrolledCourses: 6, completedCourses: 6, certifications: 5, totalSpent: 594, joinDate: "2023-09-22", lastActive: "2024-12-15" },
    { name: "Emily Davis", email: "e.davis@email.com", enrolledCourses: 2, completedCourses: 1, certifications: 1, totalSpent: 198, joinDate: "2024-06-15", lastActive: "2024-12-12" },
    { name: "David Brown", email: "d.brown@email.com", enrolledCourses: 4, completedCourses: 3, certifications: 2, totalSpent: 396, joinDate: "2024-04-08", lastActive: "2024-12-14" },
    { name: "Jennifer Lee", email: "j.lee@email.com", enrolledCourses: 5, completedCourses: 4, certifications: 4, totalSpent: 495, joinDate: "2023-12-01", lastActive: "2024-12-15" },
    { name: "Robert Martinez", email: "r.martinez@email.com", enrolledCourses: 3, completedCourses: 2, certifications: 2, totalSpent: 297, joinDate: "2024-05-20", lastActive: "2024-12-11" },
    { name: "Lisa Anderson", email: "l.anderson@email.com", enrolledCourses: 8, completedCourses: 7, certifications: 6, totalSpent: 792, joinDate: "2023-08-14", lastActive: "2024-12-15" },
  ];
}

export function getDetailedRevenueData(): RevenueDetail[] {
  return [
    { month: "January 2024", courseRevenue: 28500, productRevenue: 3200, subscriptionRevenue: 12400, totalRevenue: 44100, platformFees: 6615, netRevenue: 37485 },
    { month: "February 2024", courseRevenue: 31200, productRevenue: 2800, subscriptionRevenue: 13100, totalRevenue: 47100, platformFees: 7065, netRevenue: 40035 },
    { month: "March 2024", courseRevenue: 35600, productRevenue: 4100, subscriptionRevenue: 13800, totalRevenue: 53500, platformFees: 8025, netRevenue: 45475 },
    { month: "April 2024", courseRevenue: 33400, productRevenue: 3600, subscriptionRevenue: 14200, totalRevenue: 51200, platformFees: 7680, netRevenue: 43520 },
    { month: "May 2024", courseRevenue: 38900, productRevenue: 4800, subscriptionRevenue: 14900, totalRevenue: 58600, platformFees: 8790, netRevenue: 49810 },
    { month: "June 2024", courseRevenue: 41200, productRevenue: 5200, subscriptionRevenue: 15600, totalRevenue: 62000, platformFees: 9300, netRevenue: 52700 },
    { month: "July 2024", courseRevenue: 37800, productRevenue: 4400, subscriptionRevenue: 16100, totalRevenue: 58300, platformFees: 8745, netRevenue: 49555 },
    { month: "August 2024", courseRevenue: 42500, productRevenue: 5600, subscriptionRevenue: 16800, totalRevenue: 64900, platformFees: 9735, netRevenue: 55165 },
    { month: "September 2024", courseRevenue: 45200, productRevenue: 4900, subscriptionRevenue: 17400, totalRevenue: 67500, platformFees: 10125, netRevenue: 57375 },
    { month: "October 2024", courseRevenue: 48700, productRevenue: 5800, subscriptionRevenue: 18100, totalRevenue: 72600, platformFees: 10890, netRevenue: 61710 },
    { month: "November 2024", courseRevenue: 52300, productRevenue: 6200, subscriptionRevenue: 18900, totalRevenue: 77400, platformFees: 11610, netRevenue: 65790 },
    { month: "December 2024", courseRevenue: 45670, productRevenue: 4890, subscriptionRevenue: 19500, totalRevenue: 70060, platformFees: 10509, netRevenue: 59551 },
  ];
}

export function generateAnalyticsCSV(data: AnalyticsData): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const lines: string[] = [
    '=== THE READY LAB - PLATFORM ANALYTICS REPORT ===',
    `Generated: ${dateStr} at ${timeStr}`,
    '',
    '',
    '--- USER STATISTICS ---',
    'Metric,Value',
    `Total Users,${data.users.totalUsers.toLocaleString()}`,
    `Students,${data.users.students.toLocaleString()}`,
    `Educators,${data.users.educators.toLocaleString()}`,
    `Administrators,${data.users.admins.toLocaleString()}`,
    `Active Users (30 days),${data.users.activeUsers.toLocaleString()}`,
    `New Users This Month,${data.users.newUsersThisMonth.toLocaleString()}`,
    '',
    '',
    '--- COURSE STATISTICS ---',
    'Metric,Value',
    `Total Courses,${data.courses.totalCourses}`,
    `Total Enrollments,${data.courses.totalEnrollments.toLocaleString()}`,
    `Course Completions,${data.courses.courseCompletions.toLocaleString()}`,
    `Completion Rate,${data.courses.completionRate}%`,
    `Average Rating,${data.courses.averageRating} / 5.0`,
    '',
    '',
    '--- CERTIFICATION DATA ---',
    'Metric,Value',
    `Certificates Issued,${data.certifications.certificatesIssued.toLocaleString()}`,
    `Verifications This Month,${data.certifications.verificationsThisMonth}`,
    `LinkedIn Shares,${data.certifications.linkedInShares}`,
    '',
    '',
    '--- DIGITAL PRODUCT SALES ---',
    'Metric,Value',
    `Total Products,${data.products.totalProducts}`,
    `Products Purchased,${data.products.productsPurchased}`,
    `Total Revenue,$${data.products.totalRevenue.toLocaleString()}`,
    `Total Downloads,${data.products.totalDownloads.toLocaleString()}`,
    '',
    '',
    '--- ENGAGEMENT METRICS ---',
    'Metric,Value',
    `Daily Active Users,${data.engagement.dailyActiveUsers}`,
    `Weekly Active Users,${data.engagement.weeklyActiveUsers.toLocaleString()}`,
    `Monthly Active Users,${data.engagement.monthlyActiveUsers.toLocaleString()}`,
    `Avg. Session Duration,${data.engagement.avgSessionDuration}`,
    `Retention Rate (30 days),${data.engagement.retentionRate}%`,
    '',
    '',
    '--- COMMUNITY STATISTICS ---',
    'Metric,Value',
    `Active Communities,${data.community.activeCommunities}`,
    `Total Posts,${data.community.totalPosts.toLocaleString()}`,
    `Total Members,${data.community.totalMembers.toLocaleString()}`,
    '',
    '',
    '--- REVENUE & FINANCIALS ---',
    'Metric,Value',
    `Monthly Revenue,$${data.revenue.monthlyRevenue.toLocaleString()}`,
    `Total GMV (All-Time),$${data.revenue.totalGMV.toLocaleString()}`,
    `Platform Fee,${data.revenue.platformFeePercent}%`,
    `Pending Payouts,$${data.revenue.pendingPayouts.toLocaleString()}`,
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

export function generateExcelWorkbook(data: AnalyticsData): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const summaryData = [
    ['THE READY LAB - PLATFORM ANALYTICS REPORT'],
    [`Generated: ${dateStr}`],
    [],
    ['USER STATISTICS'],
    ['Metric', 'Value'],
    ['Total Users', data.users.totalUsers],
    ['Students', data.users.students],
    ['Educators', data.users.educators],
    ['Administrators', data.users.admins],
    ['Active Users (30 days)', data.users.activeUsers],
    ['New Users This Month', data.users.newUsersThisMonth],
    [],
    ['COURSE STATISTICS'],
    ['Metric', 'Value'],
    ['Total Courses', data.courses.totalCourses],
    ['Total Enrollments', data.courses.totalEnrollments],
    ['Course Completions', data.courses.courseCompletions],
    ['Completion Rate', `${data.courses.completionRate}%`],
    ['Average Rating', `${data.courses.averageRating} / 5.0`],
    [],
    ['CERTIFICATION DATA'],
    ['Metric', 'Value'],
    ['Certificates Issued', data.certifications.certificatesIssued],
    ['Verifications This Month', data.certifications.verificationsThisMonth],
    ['LinkedIn Shares', data.certifications.linkedInShares],
    [],
    ['ENGAGEMENT METRICS'],
    ['Metric', 'Value'],
    ['Daily Active Users', data.engagement.dailyActiveUsers],
    ['Weekly Active Users', data.engagement.weeklyActiveUsers],
    ['Monthly Active Users', data.engagement.monthlyActiveUsers],
    ['Avg. Session Duration', data.engagement.avgSessionDuration],
    ['Retention Rate (30 days)', `${data.engagement.retentionRate}%`],
    [],
    ['REVENUE & FINANCIALS'],
    ['Metric', 'Value'],
    ['Monthly Revenue', `$${data.revenue.monthlyRevenue.toLocaleString()}`],
    ['Total GMV (All-Time)', `$${data.revenue.totalGMV.toLocaleString()}`],
    ['Platform Fee', `${data.revenue.platformFeePercent}%`],
    ['Pending Payouts', `$${data.revenue.pendingPayouts.toLocaleString()}`],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const courseDetails = getDetailedCourseData();
  const courseData = [
    ['Course Name', 'Instructor', 'Category', 'Enrollments', 'Completions', 'Completion Rate', 'Rating', 'Revenue'],
    ...courseDetails.map(c => [c.name, c.instructor, c.category, c.enrollments, c.completions, `${c.completionRate}%`, c.rating, `$${c.revenue.toLocaleString()}`])
  ];
  const courseSheet = XLSX.utils.aoa_to_sheet(courseData);
  courseSheet['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 8 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, courseSheet, 'Courses');

  const studentDetails = getDetailedStudentData();
  const studentData = [
    ['Name', 'Email', 'Enrolled Courses', 'Completed Courses', 'Certifications', 'Total Spent', 'Join Date', 'Last Active'],
    ...studentDetails.map(s => [s.name, s.email, s.enrolledCourses, s.completedCourses, s.certifications, `$${s.totalSpent}`, s.joinDate, s.lastActive])
  ];
  const studentSheet = XLSX.utils.aoa_to_sheet(studentData);
  studentSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students');

  const revenueDetails = getDetailedRevenueData();
  const revenueData = [
    ['Month', 'Course Revenue', 'Product Revenue', 'Subscription Revenue', 'Total Revenue', 'Platform Fees', 'Net Revenue'],
    ...revenueDetails.map(r => [r.month, `$${r.courseRevenue.toLocaleString()}`, `$${r.productRevenue.toLocaleString()}`, `$${r.subscriptionRevenue.toLocaleString()}`, `$${r.totalRevenue.toLocaleString()}`, `$${r.platformFees.toLocaleString()}`, `$${r.netRevenue.toLocaleString()}`])
  ];
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
  revenueSheet['!cols'] = [{ wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue');

  return workbook;
}

export function downloadExcel(workbook: XLSX.WorkBook, filename: string): void {
  XLSX.writeFile(workbook, filename);
}

export interface KPIDataInput {
  activeStudents?: number;
  activeEducators?: number;
  newSubscriptions?: number;
  courseCompletions?: number;
  certificatesIssued?: number;
  monthlyRevenue?: number;
  activeCommunities?: number;
  totalGMV?: number;
  platformFeePercent?: number;
  pendingApprovals?: number;
}

export function mergeWithDefaults(kpiData?: KPIDataInput | null): AnalyticsData {
  const defaults = getDefaultAnalyticsData();
  
  if (!kpiData) return defaults;
  
  const activeStudents = kpiData.activeStudents ?? defaults.users.students;
  const activeEducators = kpiData.activeEducators ?? defaults.users.educators;
  const totalActiveUsers = activeStudents + activeEducators;
  const totalUsers = totalActiveUsers + defaults.users.admins;
  
  return {
    users: {
      totalUsers: totalUsers,
      students: activeStudents,
      educators: activeEducators,
      admins: defaults.users.admins,
      activeUsers: totalActiveUsers,
      newUsersThisMonth: kpiData.newSubscriptions ?? defaults.users.newUsersThisMonth,
    },
    courses: {
      ...defaults.courses,
      courseCompletions: kpiData.courseCompletions ?? defaults.courses.courseCompletions,
      completionRate: kpiData.courseCompletions 
        ? Math.round((kpiData.courseCompletions / defaults.courses.totalEnrollments) * 100)
        : defaults.courses.completionRate,
    },
    certifications: {
      ...defaults.certifications,
      certificatesIssued: kpiData.certificatesIssued ?? defaults.certifications.certificatesIssued,
    },
    products: defaults.products,
    engagement: {
      dailyActiveUsers: Math.floor(totalActiveUsers * 0.15),
      weeklyActiveUsers: Math.floor(totalActiveUsers * 0.45),
      monthlyActiveUsers: totalActiveUsers,
      avgSessionDuration: defaults.engagement.avgSessionDuration,
      retentionRate: defaults.engagement.retentionRate,
    },
    community: {
      activeCommunities: kpiData.activeCommunities ?? defaults.community.activeCommunities,
      totalPosts: defaults.community.totalPosts,
      totalMembers: defaults.community.totalMembers,
    },
    revenue: {
      monthlyRevenue: kpiData.monthlyRevenue ?? defaults.revenue.monthlyRevenue,
      totalGMV: kpiData.totalGMV ?? defaults.revenue.totalGMV,
      platformFeePercent: kpiData.platformFeePercent ?? defaults.revenue.platformFeePercent,
      pendingPayouts: defaults.revenue.pendingPayouts,
    },
  };
}

export type ExportFormat = 'csv' | 'excel';

export function exportPlatformAnalytics(kpiData?: KPIDataInput | null, format: ExportFormat = 'csv'): void {
  const data = mergeWithDefaults(kpiData);
  const date = new Date().toISOString().split('T')[0];
  
  if (format === 'excel') {
    const workbook = generateExcelWorkbook(data);
    downloadExcel(workbook, `ready-lab-analytics-${date}.xlsx`);
  } else {
    const csv = generateAnalyticsCSV(data);
    downloadCSV(csv, `ready-lab-analytics-${date}.csv`);
  }
}
