import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDemoExperience, DemoStep } from '@/contexts/DemoExperienceContext';

interface UseDemoPageListenerOptions {
  onStepReceived?: (step: DemoStep) => void;
}

export function useDemoPageListener(options?: UseDemoPageListenerOptions) {
  const location = useLocation();
  const { registerPage, markPageReady } = useDemoExperience();

  useEffect(() => {
    const route = location.pathname;
    
    // Register this page with the demo manager
    registerPage(route);

    // Mark page as ready after a short delay to ensure DOM is stable
    const timer = setTimeout(() => {
      markPageReady(route);
    }, 100);

    // Listen for demo step events
    const handleDemoStep = (event: Event) => {
      const customEvent = event as CustomEvent<{ step: DemoStep; stepIndex: number; totalSteps: number }>;
      const { step } = customEvent.detail;
      
      // Only process steps for this route
      if (step.route === route && options?.onStepReceived) {
        options.onStepReceived(step);
      }
    };

    window.addEventListener('demo:step', handleDemoStep);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('demo:step', handleDemoStep);
    };
  }, [location.pathname, registerPage, markPageReady, options]);
}
