export interface MockCommunity {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  members: number;
  status: 'Active' | 'Disabled' | 'Archived';
  createdAt: string;
  description: string;
  category: string;
}

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'educator' | 'student';
  status: 'active' | 'disabled';
  createdAt: string;
  lastActive: string;
  avatarUrl?: string;
  disabledReason?: string;
  disabledAt?: string;
}

export interface MockCourse {
  id: string;
  title: string;
  educatorId: string;
  educatorName: string;
  price: number;
  isFree: boolean;
  duration: string;
  microlearningDuration?: number; // in seconds
  learningStyles: string[];
  students: number;
  rating: number;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

export interface MockCertificate {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  educatorName: string;
  issuedAt: string;
  certificateNumber: string;
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  educatorId: string;
  educatorName: string;
  date: string;
  time: string;
  timezone: string;
  delivery: 'virtual' | 'in-person';
  location?: string;
  virtualUrl?: string;
  capacity: number;
  registered: number;
  visibility: 'public' | 'private' | 'unlisted';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
}

export interface MockPlatformSettings {
  platformFeePercent: number;
  stripeConnected: boolean;
  emailProvider: string | null;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minPayoutAmount: number;
}

export const mockCommunities: MockCommunity[] = [
  {
    id: '1',
    name: 'Nonprofit Founders Circle',
    owner: 'Sarah Johnson',
    ownerId: 'edu-1',
    members: 234,
    status: 'Active',
    createdAt: '2024-01-15',
    description: 'A community for nonprofit founders sharing resources and support',
    category: 'Nonprofit',
  },
  {
    id: '2',
    name: 'Small Business Growth',
    owner: 'Michael Chen',
    ownerId: 'edu-2',
    members: 567,
    status: 'Active',
    createdAt: '2024-02-01',
    description: 'Strategies and networking for small business owners',
    category: 'Business',
  },
  {
    id: '3',
    name: 'Grant Writing Masterclass',
    owner: 'Dr. Lisa Martinez',
    ownerId: 'edu-3',
    members: 189,
    status: 'Active',
    createdAt: '2024-03-10',
    description: 'Advanced grant writing techniques and peer review',
    category: 'Funding',
  },
  {
    id: '4',
    name: 'Social Enterprise Network',
    owner: 'James Wilson',
    ownerId: 'edu-4',
    members: 412,
    status: 'Disabled',
    createdAt: '2023-11-20',
    description: 'For social entrepreneurs creating sustainable impact',
    category: 'Social Impact',
  },
  {
    id: '5',
    name: 'Fundraising Bootcamp Alumni',
    owner: 'Amanda Rodriguez',
    ownerId: 'edu-5',
    members: 98,
    status: 'Active',
    createdAt: '2024-04-05',
    description: 'Alumni network from our fundraising bootcamp program',
    category: 'Networking',
  },
  {
    id: '6',
    name: 'Legacy Community (Archived)',
    owner: 'Former Educator',
    ownerId: 'edu-6',
    members: 45,
    status: 'Archived',
    createdAt: '2023-06-12',
    description: 'An archived community from previous cohort',
    category: 'Archive',
  },
];

export const mockUsers: MockUser[] = [
  {
    id: 'admin-1',
    email: 'admin@thereadylab.com',
    fullName: 'Alex Admin',
    role: 'super_admin',
    status: 'active',
    createdAt: '2023-01-01',
    lastActive: '2024-11-12',
  },
  {
    id: 'admin-2',
    email: 'jamie.admin@thereadylab.com',
    fullName: 'Jamie Administrator',
    role: 'admin',
    status: 'active',
    createdAt: '2023-03-15',
    lastActive: '2024-11-11',
  },
  {
    id: 'edu-1',
    email: 'sarah.j@thereadylab.com',
    fullName: 'Sarah Johnson',
    role: 'educator',
    status: 'active',
    createdAt: '2023-06-01',
    lastActive: '2024-11-12',
  },
  {
    id: 'edu-2',
    email: 'michael.chen@thereadylab.com',
    fullName: 'Dr. Michael Chen',
    role: 'educator',
    status: 'active',
    createdAt: '2023-07-20',
    lastActive: '2024-11-10',
  },
  {
    id: 'edu-3',
    email: 'lisa.m@thereadylab.com',
    fullName: 'Dr. Lisa Martinez',
    role: 'educator',
    status: 'active',
    createdAt: '2023-08-05',
    lastActive: '2024-11-12',
  },
  {
    id: 'edu-4',
    email: 'james.w@thereadylab.com',
    fullName: 'James Wilson',
    role: 'educator',
    status: 'disabled',
    createdAt: '2023-05-15',
    lastActive: '2024-10-15',
    disabledReason: 'Terms of Service Violation',
    disabledAt: '2024-10-20',
  },
  {
    id: 'stu-1',
    email: 'john.student@email.com',
    fullName: 'John Student',
    role: 'student',
    status: 'active',
    createdAt: '2024-01-10',
    lastActive: '2024-11-12',
  },
  {
    id: 'stu-2',
    email: 'jane.learner@email.com',
    fullName: 'Jane Learner',
    role: 'student',
    status: 'active',
    createdAt: '2024-02-15',
    lastActive: '2024-11-11',
  },
  {
    id: 'stu-3',
    email: 'alex.student@email.com',
    fullName: 'Alex Student',
    role: 'student',
    status: 'active',
    createdAt: '2024-03-20',
    lastActive: '2024-11-10',
  },
  {
    id: 'stu-4',
    email: 'maria.garcia@email.com',
    fullName: 'Maria Garcia',
    role: 'student',
    status: 'disabled',
    createdAt: '2024-01-05',
    lastActive: '2024-09-30',
    disabledReason: 'Payment Dispute',
    disabledAt: '2024-10-01',
  },
  {
    id: 'stu-5',
    email: 'david.brown@email.com',
    fullName: 'David Brown',
    role: 'student',
    status: 'active',
    createdAt: '2024-04-12',
    lastActive: '2024-11-09',
  },
  {
    id: 'stu-6',
    email: 'sarah.miller@email.com',
    fullName: 'Sarah Miller',
    role: 'student',
    status: 'active',
    createdAt: '2024-05-08',
    lastActive: '2024-11-12',
  },
];

export const mockCourses: MockCourse[] = [
  {
    id: 'course-1',
    title: 'Funding Readiness 101',
    educatorId: 'edu-2',
    educatorName: 'Dr. Michael Chen',
    price: 299,
    isFree: false,
    duration: '8 weeks',
    learningStyles: ['Visual', 'Reading/Writing'],
    students: 3200,
    rating: 4.9,
    category: 'Funding Strategy',
    status: 'published',
    createdAt: '2024-01-10',
  },
  {
    id: 'course-2',
    title: 'Quick Grant Proposal Tips',
    educatorId: 'edu-3',
    educatorName: 'Dr. Lisa Martinez',
    price: 0,
    isFree: true,
    duration: '5 minutes',
    microlearningDuration: 300,
    learningStyles: ['Visual', 'Auditory'],
    students: 1850,
    rating: 4.7,
    category: 'Grant Writing',
    status: 'published',
    createdAt: '2024-02-05',
  },
  {
    id: 'course-3',
    title: 'Elevator Pitch Mastery',
    educatorId: 'edu-1',
    educatorName: 'Sarah Johnson',
    price: 0,
    isFree: true,
    duration: '2 minutes',
    microlearningDuration: 120,
    learningStyles: ['Visual', 'Kinesthetic'],
    students: 2450,
    rating: 4.8,
    category: 'Pitching',
    status: 'published',
    createdAt: '2024-03-01',
  },
  {
    id: 'course-4',
    title: 'Nonprofit Operations Complete Guide',
    educatorId: 'edu-1',
    educatorName: 'Sarah Johnson',
    price: 249,
    isFree: false,
    duration: '6 weeks',
    learningStyles: ['Reading/Writing', 'Project-based'],
    students: 2800,
    rating: 4.8,
    category: 'Operations',
    status: 'published',
    createdAt: '2024-01-20',
  },
  {
    id: 'course-5',
    title: 'Social Media Strategy for Nonprofits',
    educatorId: 'edu-1',
    educatorName: 'Sarah Johnson',
    price: 199,
    isFree: false,
    duration: '4 weeks',
    learningStyles: ['Visual', 'Kinesthetic'],
    students: 2100,
    rating: 4.9,
    category: 'Marketing',
    status: 'published',
    createdAt: '2024-02-10',
  },
  {
    id: 'course-6',
    title: 'AI Tools for Entrepreneurs',
    educatorId: 'edu-2',
    educatorName: 'Dr. Michael Chen',
    price: 229,
    isFree: false,
    duration: '5 weeks',
    learningStyles: ['Visual', 'Kinesthetic', 'Project-based'],
    students: 1900,
    rating: 4.7,
    category: 'Technology',
    status: 'published',
    createdAt: '2024-03-15',
  },
  {
    id: 'course-7',
    title: 'Building Strategic Partnerships',
    educatorId: 'edu-3',
    educatorName: 'Dr. Lisa Martinez',
    price: 279,
    isFree: false,
    duration: '6 weeks',
    learningStyles: ['Auditory', 'Reading/Writing'],
    students: 1600,
    rating: 4.8,
    category: 'Partnerships',
    status: 'published',
    createdAt: '2024-04-01',
  },
  {
    id: 'course-8',
    title: 'Financial Planning Fundamentals',
    educatorId: 'edu-2',
    educatorName: 'Dr. Michael Chen',
    price: 179,
    isFree: false,
    duration: '4 weeks',
    learningStyles: ['Reading/Writing', 'Visual'],
    students: 1400,
    rating: 4.7,
    category: 'Finance',
    status: 'published',
    createdAt: '2024-05-10',
  },
  {
    id: 'course-9',
    title: 'Board Development Essentials',
    educatorId: 'edu-3',
    educatorName: 'Dr. Lisa Martinez',
    price: 149,
    isFree: false,
    duration: '3 weeks',
    learningStyles: ['Auditory', 'Reading/Writing'],
    students: 980,
    rating: 4.6,
    category: 'Leadership',
    status: 'published',
    createdAt: '2024-06-05',
  },
  {
    id: 'course-10',
    title: 'Community Engagement Strategies',
    educatorId: 'edu-1',
    educatorName: 'Sarah Johnson',
    price: 0,
    isFree: true,
    duration: '45 minutes',
    microlearningDuration: 2700,
    learningStyles: ['Visual', 'Project-based'],
    students: 3100,
    rating: 4.8,
    category: 'Community',
    status: 'published',
    createdAt: '2024-07-01',
  },
];

export const mockCertificates: MockCertificate[] = [
  {
    id: 'cert-1',
    studentId: 'stu-1',
    courseId: 'course-1',
    courseName: 'Funding Readiness 101',
    educatorName: 'Dr. Michael Chen',
    issuedAt: '2024-10-15',
    certificateNumber: 'TRL-2024-FR101-00234',
  },
  {
    id: 'cert-2',
    studentId: 'stu-1',
    courseId: 'course-4',
    courseName: 'Nonprofit Operations Complete Guide',
    educatorName: 'Sarah Johnson',
    issuedAt: '2024-09-20',
    certificateNumber: 'TRL-2024-NOCG-00189',
  },
  {
    id: 'cert-3',
    studentId: 'stu-1',
    courseId: 'course-5',
    courseName: 'Social Media Strategy for Nonprofits',
    educatorName: 'Sarah Johnson',
    issuedAt: '2024-08-10',
    certificateNumber: 'TRL-2024-SMSN-00156',
  },
];

export const mockEvents: MockEvent[] = [
  {
    id: 'event-1',
    title: 'Grant Writing Q&A Session',
    description: 'Bring your grant questions and get expert answers in this live session',
    educatorId: 'edu-3',
    educatorName: 'Dr. Lisa Martinez',
    date: '2024-12-15',
    time: '14:00',
    timezone: 'EST',
    delivery: 'virtual',
    virtualUrl: 'https://zoom.us/j/example',
    capacity: 100,
    registered: 45,
    visibility: 'public',
    status: 'upcoming',
  },
  {
    id: 'event-2',
    title: 'Pitch Deck Workshop: Get Feedback',
    description: 'Present your pitch deck and receive constructive feedback from peers and experts',
    educatorId: 'edu-2',
    educatorName: 'Dr. Michael Chen',
    date: '2024-12-22',
    time: '15:00',
    timezone: 'PST',
    delivery: 'virtual',
    virtualUrl: 'https://zoom.us/j/example2',
    capacity: 50,
    registered: 28,
    visibility: 'public',
    status: 'upcoming',
  },
  {
    id: 'event-3',
    title: 'Networking Happy Hour',
    description: 'Connect with fellow nonprofit professionals in an informal setting',
    educatorId: 'edu-1',
    educatorName: 'Sarah Johnson',
    date: '2024-12-10',
    time: '17:30',
    timezone: 'CST',
    delivery: 'in-person',
    location: '123 Main St, Chicago, IL',
    capacity: 30,
    registered: 22,
    visibility: 'public',
    status: 'upcoming',
  },
  {
    id: 'event-4',
    title: 'Financial Planning Workshop',
    description: 'Completed workshop on budgeting and financial forecasting',
    educatorId: 'edu-2',
    educatorName: 'Dr. Michael Chen',
    date: '2024-10-20',
    time: '13:00',
    timezone: 'EST',
    delivery: 'virtual',
    virtualUrl: 'https://zoom.us/j/example3',
    capacity: 75,
    registered: 68,
    visibility: 'public',
    status: 'completed',
  },
];

export const mockPlatformSettings: MockPlatformSettings = {
  platformFeePercent: 15,
  stripeConnected: false,
  emailProvider: null,
  payoutSchedule: 'weekly',
  minPayoutAmount: 50,
};
