import {
  mockCommunities,
  mockUsers,
  mockCourses,
  mockCertificates,
  mockEvents,
  mockPlatformSettings,
  type MockCommunity,
  type MockUser,
  type MockCourse,
  type MockCertificate,
  type MockEvent,
  type MockPlatformSettings,
} from './seedData';

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  // In-memory storage (simulates database)
  private communities: MockCommunity[] = [...mockCommunities];
  private users: MockUser[] = [...mockUsers];
  private courses: MockCourse[] = [...mockCourses];
  private certificates: MockCertificate[] = [...mockCertificates];
  private events: MockEvent[] = [...mockEvents];
  private settings: MockPlatformSettings = { ...mockPlatformSettings };

  // Communities API
  async getCommunities(): Promise<MockCommunity[]> {
    await delay();
    return [...this.communities];
  }

  async getCommunity(id: string): Promise<MockCommunity | null> {
    await delay(300);
    return this.communities.find(c => c.id === id) || null;
  }

  async updateCommunityStatus(id: string, status: MockCommunity['status']): Promise<MockCommunity> {
    await delay(800);
    const community = this.communities.find(c => c.id === id);
    if (!community) throw new Error('Community not found');
    community.status = status;
    return community;
  }

  async disableCommunities(ids: string[]): Promise<void> {
    await delay(1000);
    ids.forEach(id => {
      const community = this.communities.find(c => c.id === id);
      if (community) community.status = 'Disabled';
    });
  }

  async archiveCommunities(ids: string[]): Promise<void> {
    await delay(1000);
    ids.forEach(id => {
      const community = this.communities.find(c => c.id === id);
      if (community) community.status = 'Archived';
    });
  }

  // Users API
  async getUsers(roleFilter?: MockUser['role']): Promise<MockUser[]> {
    await delay();
    if (roleFilter) {
      return this.users.filter(u => u.role === roleFilter);
    }
    return [...this.users];
  }

  async getUser(id: string): Promise<MockUser | null> {
    await delay(300);
    return this.users.find(u => u.id === id) || null;
  }

  async disableUser(id: string, reason: string): Promise<MockUser> {
    await delay(800);
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.status = 'disabled';
    user.disabledReason = reason;
    user.disabledAt = new Date().toISOString();
    return user;
  }

  async enableUser(id: string): Promise<MockUser> {
    await delay(800);
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.status = 'active';
    user.disabledReason = undefined;
    user.disabledAt = undefined;
    return user;
  }

  async resetPassword(id: string): Promise<void> {
    await delay(1000);
    // TODO: Implement real password reset email via EmailCrmStub
    console.log(`Password reset sent to user ${id}`);
  }

  // Courses API
  async getCourses(educatorId?: string): Promise<MockCourse[]> {
    await delay();
    if (educatorId) {
      return this.courses.filter(c => c.educatorId === educatorId);
    }
    return [...this.courses];
  }

  async getCourse(id: string): Promise<MockCourse | null> {
    await delay(300);
    return this.courses.find(c => c.id === id) || null;
  }

  async createCourse(courseData: Omit<MockCourse, 'id' | 'createdAt'>): Promise<MockCourse> {
    await delay(1200);
    const newCourse: MockCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, updates: Partial<MockCourse>): Promise<MockCourse> {
    await delay(800);
    const course = this.courses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    Object.assign(course, updates);
    return course;
  }

  // Certificates API
  async getCertificates(studentId?: string): Promise<MockCertificate[]> {
    await delay();
    if (studentId) {
      return this.certificates.filter(c => c.studentId === studentId);
    }
    return [...this.certificates];
  }

  async getCertificate(id: string): Promise<MockCertificate | null> {
    await delay(300);
    return this.certificates.find(c => c.id === id) || null;
  }

  // Events API
  async getEvents(educatorId?: string, status?: MockEvent['status']): Promise<MockEvent[]> {
    await delay();
    let filtered = [...this.events];
    if (educatorId) {
      filtered = filtered.filter(e => e.educatorId === educatorId);
    }
    if (status) {
      filtered = filtered.filter(e => e.status === status);
    }
    return filtered;
  }

  async getEvent(id: string): Promise<MockEvent | null> {
    await delay(300);
    return this.events.find(e => e.id === id) || null;
  }

  async createEvent(eventData: Omit<MockEvent, 'id'>): Promise<MockEvent> {
    await delay(1000);
    const newEvent: MockEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<MockEvent>): Promise<MockEvent> {
    await delay(800);
    const event = this.events.find(e => e.id === id);
    if (!event) throw new Error('Event not found');
    Object.assign(event, updates);
    return event;
  }

  async registerForEvent(eventId: string, userId: string): Promise<MockEvent> {
    await delay(600);
    const event = this.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.registered >= event.capacity) throw new Error('Event is full');
    event.registered++;
    return event;
  }

  // Platform Settings API
  async getPlatformSettings(): Promise<MockPlatformSettings> {
    await delay(400);
    return { ...this.settings };
  }

  async updatePlatformSettings(updates: Partial<MockPlatformSettings>): Promise<MockPlatformSettings> {
    await delay(800);
    Object.assign(this.settings, updates);
    return { ...this.settings };
  }

  // Sales Analytics (for Educators)
  async getSalesAnalytics(educatorId: string, startDate?: string, endDate?: string): Promise<{
    views: number;
    addToCart: number;
    purchases: number;
    conversionRate: number;
    revenue: number;
    refunds: number;
    netRevenue: number;
    chartData: Array<{ date: string; views: number; sales: number; revenue: number }>;
  }> {
    await delay(1000);
    
    // Mock analytics data
    const baseViews = Math.floor(Math.random() * 5000) + 2000;
    const addToCart = Math.floor(baseViews * 0.15);
    const purchases = Math.floor(addToCart * 0.35);
    const conversionRate = ((purchases / baseViews) * 100);
    const avgPrice = 250;
    const revenue = purchases * avgPrice;
    const refunds = Math.floor(purchases * 0.05);
    const netRevenue = revenue - (refunds * avgPrice);

    // Generate chart data for last 30 days
    const chartData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 50,
        sales: Math.floor(Math.random() * 15) + 2,
        revenue: (Math.floor(Math.random() * 15) + 2) * avgPrice,
      };
    });

    return {
      views: baseViews,
      addToCart,
      purchases,
      conversionRate: Math.round(conversionRate * 10) / 10,
      revenue: Math.round(revenue),
      refunds,
      netRevenue: Math.round(netRevenue),
      chartData,
    };
  }

  // Collaborators API (for Super Admin)
  async inviteCollaborator(email: string, role: 'super_admin' | 'admin'): Promise<{
    id: string;
    email: string;
    role: string;
    status: 'pending' | 'accepted';
    invitedAt: string;
  }> {
    await delay(1000);
    // TODO: Send actual invitation email via EmailCrmStub
    return {
      id: `invite-${Date.now()}`,
      email,
      role,
      status: 'pending',
      invitedAt: new Date().toISOString(),
    };
  }

  async getCollaborators(): Promise<Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    status: 'active' | 'pending';
    addedAt: string;
  }>> {
    await delay(600);
    // Return admins and super admins
    return this.users
      .filter(u => u.role === 'admin' || u.role === 'super_admin')
      .map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        status: 'active' as const,
        addedAt: u.createdAt,
      }));
  }
}

export const MockApi = new MockApiService();
