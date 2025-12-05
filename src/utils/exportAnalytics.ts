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

export function exportPlatformAnalytics(kpiData?: KPIDataInput | null): void {
  const data = mergeWithDefaults(kpiData);
  const csv = generateAnalyticsCSV(data);
  const date = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `ready-lab-analytics-${date}.csv`);
}
