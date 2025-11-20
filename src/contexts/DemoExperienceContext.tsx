import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Journey and step definitions
export type DemoJourney = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface DemoStep {
  id: string;
  journey: DemoJourney;
  route: string;
  anchor?: string;
  duration: number;
  narration: string;
  action?: () => Promise<void> | void;
  skipNavigation?: boolean;
}

export type DemoStatus = 'idle' | 'running' | 'paused' | 'completed' | 'cancelled';

interface DemoState {
  status: DemoStatus;
  currentJourney: DemoJourney | null;
  currentStepIndex: number;
  totalSteps: number;
  speed: 1 | 2 | 4;
  startTime: number | null;
}

interface PageReadiness {
  route: string;
  resolver: () => void;
  promise: Promise<void>;
}

interface DemoExperienceContextValue {
  state: DemoState;
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  cancelDemo: () => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  registerPage: (route: string) => void;
  markPageReady: (route: string) => void;
  getCurrentStep: () => DemoStep | null;
  getProgress: () => number;
}

const DemoExperienceContext = createContext<DemoExperienceContextValue | null>(null);

// Define all demo steps for the complete educator journey
const DEMO_STEPS: DemoStep[] = [
  // Journey A: Discovery → Signup (3 steps)
  {
    id: 'a1-homepage-hero',
    journey: 'A',
    route: '/',
    anchor: 'hero-section',
    duration: 2000,
    narration: 'Welcome to The Ready Lab - where educators monetize their expertise',
    skipNavigation: true,
  },
  {
    id: 'a2-educator-value',
    journey: 'A',
    route: '/',
    anchor: 'educator-cta',
    duration: 3000,
    narration: 'Educators can create courses with AI, track students, and earn revenue through Stripe',
  },
  {
    id: 'a3-signup-onboarding',
    journey: 'A',
    route: '/educator/onboarding',
    duration: 4000,
    narration: 'Quick onboarding sets up teaching preferences and payout settings',
  },
  
  // Journey B: Dashboard Overview (4 steps)
  {
    id: 'b1-dashboard-stats',
    journey: 'B',
    route: '/educator/dashboard',
    anchor: 'dashboard-stats',
    duration: 3000,
    narration: 'Dashboard shows total students, active courses, revenue, and ratings at a glance',
  },
  {
    id: 'b2-course-list',
    journey: 'B',
    route: '/educator/dashboard',
    anchor: 'course-list',
    duration: 3000,
    narration: 'View all your courses with enrollment metrics and quick actions',
  },
  {
    id: 'b3-recent-activity',
    journey: 'B',
    route: '/educator/dashboard',
    anchor: 'recent-activity',
    duration: 2000,
    narration: 'Track student completions, reviews, and payments in real-time',
  },
  {
    id: 'b4-quick-actions',
    journey: 'B',
    route: '/educator/dashboard',
    anchor: 'quick-actions',
    duration: 2000,
    narration: 'Create courses, schedule live events, and manage students with one click',
  },
  
  // Journey C: Create Course (7 steps - reusing existing wizard)
  {
    id: 'c1-open-wizard',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 1000,
    narration: 'Let\'s create a new course with our AI-powered course builder',
  },
  {
    id: 'c2-basic-info',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 2500,
    narration: 'AI fills in course title, description, and learning objectives',
  },
  {
    id: 'c3-curriculum',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 3000,
    narration: 'Course structure with modules and lessons loads automatically',
  },
  {
    id: 'c4-pricing',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 2000,
    narration: 'Set pricing - one-time payment, subscription, or free',
  },
  {
    id: 'c5-settings',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 2000,
    narration: 'Configure course settings and enrollment options',
  },
  {
    id: 'c6-review',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 2000,
    narration: 'Review complete course before publishing',
  },
  {
    id: 'c7-publish',
    journey: 'C',
    route: '/educator/dashboard',
    duration: 3000,
    narration: 'Publishing course and enrolling demo student...',
  },
  
  // Journey D: Student Analytics (4 steps)
  {
    id: 'd1-student-list',
    journey: 'D',
    route: '/educator/students',
    anchor: 'student-list',
    duration: 3000,
    narration: 'View all enrolled students with progress tracking and engagement status',
  },
  {
    id: 'd2-progress-tracking',
    journey: 'D',
    route: '/educator/students',
    anchor: 'progress-details',
    duration: 3000,
    narration: 'See detailed progress bars, last active times, and completion status',
  },
  {
    id: 'd3-at-risk-filter',
    journey: 'D',
    route: '/educator/students',
    anchor: 'at-risk-students',
    duration: 2500,
    narration: 'Identify at-risk students who need engagement support',
  },
  {
    id: 'd4-engagement-metrics',
    journey: 'D',
    route: '/educator/students',
    anchor: 'engagement-charts',
    duration: 2500,
    narration: 'Analytics show enrollment trends and completion funnels',
  },
  
  // Journey E: Revenue & Payouts (4 steps)
  {
    id: 'e1-revenue-overview',
    journey: 'E',
    route: '/educator/revenue',
    anchor: 'revenue-stats',
    duration: 3000,
    narration: 'Track revenue by month with all-time earnings and pending payouts',
  },
  {
    id: 'e2-revenue-breakdown',
    journey: 'E',
    route: '/educator/revenue',
    anchor: 'course-breakdown',
    duration: 2500,
    narration: 'See revenue breakdown by course to identify top performers',
  },
  {
    id: 'e3-transactions',
    journey: 'E',
    route: '/educator/revenue',
    anchor: 'transaction-history',
    duration: 2500,
    narration: 'View transaction history with student purchases and payment status',
  },
  {
    id: 'e4-payout-schedule',
    journey: 'E',
    route: '/educator/revenue',
    anchor: 'payout-schedule',
    duration: 2000,
    narration: 'Stripe Connect handles automatic weekly payouts to your bank account',
  },
  
  // Journey F: Live Event (3 steps)
  {
    id: 'f1-schedule-event',
    journey: 'F',
    route: '/educator/dashboard',
    duration: 2500,
    narration: 'Schedule live Q&A sessions to engage students in real-time',
  },
  {
    id: 'f2-event-promotion',
    journey: 'F',
    route: '/educator/dashboard',
    duration: 2000,
    narration: 'Automatically email all enrolled students with event details',
  },
  {
    id: 'f3-broadcast-preview',
    journey: 'F',
    route: '/educator/dashboard',
    duration: 2500,
    narration: 'Live streaming interface with chat, Q&A, and participant tracking',
  },
];

const INITIAL_STATE: DemoState = {
  status: 'idle',
  currentJourney: null,
  currentStepIndex: -1,
  totalSteps: DEMO_STEPS.length,
  speed: 1,
  startTime: null,
};

export function DemoExperienceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const navigate = useNavigate();
  const pageReadinessRef = useRef<Map<string, PageReadiness>>(new Map());
  const currentTimeoutRef = useRef<number | null>(null);
  const isExecutingRef = useRef(false);

  // Persist demo state to localStorage
  useEffect(() => {
    if (state.status !== 'idle') {
      localStorage.setItem('demo-experience-state', JSON.stringify(state));
    } else {
      localStorage.removeItem('demo-experience-state');
    }
  }, [state]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (currentTimeoutRef.current) {
        clearTimeout(currentTimeoutRef.current);
        currentTimeoutRef.current = null;
      }
    };
  }, []);

  const executeStep = useCallback(async (stepIndex: number) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;

    const step = DEMO_STEPS[stepIndex];
    if (!step) {
      setState(prev => ({ ...prev, status: 'completed' }));
      isExecutingRef.current = false;
      return;
    }

    // Update state to current step
    setState(prev => ({
      ...prev,
      currentStepIndex: stepIndex,
      currentJourney: step.journey,
    }));

    // Emit step event for components to react
    window.dispatchEvent(new CustomEvent('demo:step', { 
      detail: { 
        step,
        stepIndex,
        totalSteps: DEMO_STEPS.length 
      } 
    }));

    try {
      // Navigate to new route if needed
      if (!step.skipNavigation && step.route) {
        const currentPath = window.location.pathname;
        if (currentPath !== step.route) {
          navigate(step.route);
          
          // Wait for page to be ready
          const readiness = pageReadinessRef.current.get(step.route);
          if (readiness) {
            await readiness.promise;
          } else {
            // Wait a default time if page hasn't registered
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

      // Scroll to anchor if specified
      if (step.anchor) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const element = document.querySelector(`[data-demo-anchor="${step.anchor}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      // Execute step action if specified
      if (step.action) {
        await step.action();
      }

      // Wait for step duration (adjusted by speed)
      await new Promise<void>((resolve) => {
        const adjustedDuration = step.duration / state.speed;
        currentTimeoutRef.current = window.setTimeout(() => {
          currentTimeoutRef.current = null;
          resolve();
        }, adjustedDuration);
      });

      isExecutingRef.current = false;

      // Move to next step if still running
      if (state.status === 'running') {
        executeStep(stepIndex + 1);
      }
    } catch (error) {
      console.error('Demo step error:', error);
      isExecutingRef.current = false;
    }
  }, [navigate, state.speed, state.status]);

  const startDemo = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      status: 'running',
      startTime: Date.now(),
    });
    executeStep(0);
  }, [executeStep]);

  const pauseDemo = useCallback(() => {
    if (currentTimeoutRef.current) {
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    setState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const resumeDemo = useCallback(() => {
    setState(prev => ({ ...prev, status: 'running' }));
    executeStep(state.currentStepIndex);
  }, [executeStep, state.currentStepIndex]);

  const cancelDemo = useCallback(() => {
    if (currentTimeoutRef.current) {
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    setState(INITIAL_STATE);
    isExecutingRef.current = false;
  }, []);

  const setSpeed = useCallback((speed: 1 | 2 | 4) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const registerPage = useCallback((route: string) => {
    if (!pageReadinessRef.current.has(route)) {
      let resolver: () => void;
      const promise = new Promise<void>((resolve) => {
        resolver = resolve;
      });
      pageReadinessRef.current.set(route, { route, resolver: resolver!, promise });
    }
  }, []);

  const markPageReady = useCallback((route: string) => {
    const readiness = pageReadinessRef.current.get(route);
    if (readiness) {
      readiness.resolver();
    }
  }, []);

  const getCurrentStep = useCallback(() => {
    return DEMO_STEPS[state.currentStepIndex] || null;
  }, [state.currentStepIndex]);

  const getProgress = useCallback(() => {
    if (state.totalSteps === 0) return 0;
    return Math.round(((state.currentStepIndex + 1) / state.totalSteps) * 100);
  }, [state.currentStepIndex, state.totalSteps]);

  const value: DemoExperienceContextValue = {
    state,
    startDemo,
    pauseDemo,
    resumeDemo,
    cancelDemo,
    setSpeed,
    registerPage,
    markPageReady,
    getCurrentStep,
    getProgress,
  };

  return (
    <DemoExperienceContext.Provider value={value}>
      {children}
    </DemoExperienceContext.Provider>
  );
}

export function useDemoExperience() {
  const context = useContext(DemoExperienceContext);
  if (!context) {
    throw new Error('useDemoExperience must be used within DemoExperienceProvider');
  }
  return context;
}
