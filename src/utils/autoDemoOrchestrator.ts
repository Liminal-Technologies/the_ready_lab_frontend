/**
 * Auto Demo Orchestrator
 * Manages the automated demo flow through the educator journey
 */

export type DemoStep =
  | 'IDLE'
  | 'CREATING_COURSE'
  | 'COURSE_STEP_1' // Basic Info
  | 'COURSE_STEP_2' // Curriculum
  | 'COURSE_STEP_3' // Pricing
  | 'COURSE_STEP_4' // Settings
  | 'COURSE_STEP_5' // Review
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'ENROLLING_STUDENT'
  | 'NAVIGATING_TO_COURSE'
  | 'PLAYING_LESSON'
  | 'MARKING_COMPLETE'
  | 'CHECKING_ANALYTICS'
  | 'COMPLETE';

export type DemoSpeed = 1 | 2 | 4;

export interface DemoState {
  currentStep: DemoStep;
  isRunning: boolean;
  isPaused: boolean;
  speed: DemoSpeed;
  progress: number; // 0-100
  courseId?: string;
  error?: string;
}

export interface DemoEventListeners {
  onStateChange?: (state: DemoState) => void;
  onStepChange?: (step: DemoStep) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

class AutoDemoOrchestrator {
  private state: DemoState = {
    currentStep: 'IDLE',
    isRunning: false,
    isPaused: false,
    speed: 1,
    progress: 0,
  };

  private listeners: DemoEventListeners = {};
  private stepTimeouts: NodeJS.Timeout[] = [];
  
  // Map steps to progress percentages
  private stepProgress: Record<DemoStep, number> = {
    IDLE: 0,
    CREATING_COURSE: 5,
    COURSE_STEP_1: 15,
    COURSE_STEP_2: 30,
    COURSE_STEP_3: 45,
    COURSE_STEP_4: 60,
    COURSE_STEP_5: 70,
    PUBLISHING: 75,
    PUBLISHED: 80,
    ENROLLING_STUDENT: 85,
    NAVIGATING_TO_COURSE: 90,
    PLAYING_LESSON: 93,
    MARKING_COMPLETE: 96,
    CHECKING_ANALYTICS: 98,
    COMPLETE: 100,
  };

  // Step descriptions for UI display
  private stepDescriptions: Record<DemoStep, string> = {
    IDLE: 'Ready to start',
    CREATING_COURSE: 'Opening course builder...',
    COURSE_STEP_1: 'Filling basic information...',
    COURSE_STEP_2: 'Creating curriculum with modules and lessons...',
    COURSE_STEP_3: 'Setting up pricing...',
    COURSE_STEP_4: 'Configuring course settings...',
    COURSE_STEP_5: 'Reviewing course details...',
    PUBLISHING: 'Publishing course...',
    PUBLISHED: 'Course published successfully!',
    ENROLLING_STUDENT: 'Enrolling demo student...',
    NAVIGATING_TO_COURSE: 'Opening course page...',
    PLAYING_LESSON: 'Starting first lesson...',
    MARKING_COMPLETE: 'Completing lesson...',
    CHECKING_ANALYTICS: 'Checking analytics dashboard...',
    COMPLETE: 'Demo complete!',
  };

  constructor(listeners: DemoEventListeners = {}) {
    this.listeners = listeners;
  }

  /**
   * Start the automated demo
   */
  public async start(): Promise<void> {
    if (this.state.isRunning) {
      console.warn('Demo is already running');
      return;
    }

    this.updateState({
      isRunning: true,
      isPaused: false,
      currentStep: 'CREATING_COURSE',
      progress: this.stepProgress['CREATING_COURSE'],
    });

    // Run the demo sequence
    await this.runDemoSequence();
  }

  /**
   * Pause the demo
   */
  public pause(): void {
    if (!this.state.isRunning) return;
    
    this.updateState({ isPaused: true });
    this.clearTimeouts();
  }

  /**
   * Resume the paused demo
   */
  public resume(): void {
    if (!this.state.isPaused) return;
    
    this.updateState({ isPaused: false });
    // Continue from current step
    this.runDemoSequence();
  }

  /**
   * Cancel the demo and reset
   */
  public cancel(): void {
    this.clearTimeouts();
    this.updateState({
      currentStep: 'IDLE',
      isRunning: false,
      isPaused: false,
      progress: 0,
      courseId: undefined,
      error: undefined,
    });
  }

  /**
   * Set demo speed
   */
  public setSpeed(speed: DemoSpeed): void {
    this.updateState({ speed });
  }

  /**
   * Get current state
   */
  public getState(): DemoState {
    return { ...this.state };
  }

  /**
   * Get description for current step
   */
  public getStepDescription(step?: DemoStep): string {
    return this.stepDescriptions[step || this.state.currentStep];
  }

  /**
   * Main demo sequence orchestration
   */
  private async runDemoSequence(): Promise<void> {
    try {
      const steps: DemoStep[] = [
        'CREATING_COURSE',
        'COURSE_STEP_1',
        'COURSE_STEP_2',
        'COURSE_STEP_3',
        'COURSE_STEP_4',
        'COURSE_STEP_5',
        'PUBLISHING',
        'PUBLISHED',
        'ENROLLING_STUDENT',
        'NAVIGATING_TO_COURSE',
        'PLAYING_LESSON',
        'MARKING_COMPLETE',
        'CHECKING_ANALYTICS',
        'COMPLETE',
      ];

      const currentIndex = steps.indexOf(this.state.currentStep);
      
      for (let i = currentIndex; i < steps.length; i++) {
        if (!this.state.isRunning || this.state.isPaused) {
          break;
        }

        const step = steps[i];
        await this.executeStep(step);
        
        // Wait between steps based on speed
        if (i < steps.length - 1) {
          await this.delay(this.getStepDelay());
        }
      }

      if (this.state.currentStep === 'COMPLETE') {
        this.listeners.onComplete?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.updateState({ error: errorMessage });
      this.listeners.onError?.(errorMessage);
    }
  }

  /**
   * Execute a specific demo step
   */
  private async executeStep(step: DemoStep): Promise<void> {
    this.updateState({
      currentStep: step,
      progress: this.stepProgress[step],
    });
    this.listeners.onStepChange?.(step);

    // Emit custom event that components can listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('autoDemo:step', { 
        detail: { step, state: this.getState() } 
      }));
    }
  }

  /**
   * Calculate delay between steps based on speed
   */
  private getStepDelay(): number {
    const baseDelay = 2000; // 2 seconds base
    return baseDelay / this.state.speed;
  }

  /**
   * Promise-based delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      const timeout = setTimeout(resolve, ms);
      this.stepTimeouts.push(timeout);
    });
  }

  /**
   * Clear all pending timeouts
   */
  private clearTimeouts(): void {
    this.stepTimeouts.forEach(timeout => clearTimeout(timeout));
    this.stepTimeouts = [];
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<DemoState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.onStateChange?.(this.getState());
  }

  /**
   * Set course ID after course creation
   */
  public setCourseId(courseId: string): void {
    this.updateState({ courseId });
  }
}

// Singleton instance
let orchestratorInstance: AutoDemoOrchestrator | null = null;

/**
 * Get or create the auto demo orchestrator instance
 */
export function getAutoDemoOrchestrator(listeners?: DemoEventListeners): AutoDemoOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AutoDemoOrchestrator(listeners);
  } else if (listeners) {
    // Update listeners if provided
    orchestratorInstance = new AutoDemoOrchestrator(listeners);
  }
  return orchestratorInstance;
}

/**
 * Reset the orchestrator instance (useful for testing)
 */
export function resetAutoDemoOrchestrator(): void {
  if (orchestratorInstance) {
    orchestratorInstance.cancel();
  }
  orchestratorInstance = null;
}
