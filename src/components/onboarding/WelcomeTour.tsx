import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface WelcomeTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export const WelcomeTour = ({ run = false, onComplete }: WelcomeTourProps) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenWelcomeTour');
    const onboardingData = localStorage.getItem('onboardingData');
    
    if (!hasSeenTour && onboardingData) {
      const data = JSON.parse(onboardingData);
      const completedAt = data.completedAt ? new Date(data.completedAt).getTime() : 0;
      const now = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (completedAt && (now - completedAt < fiveMinutes)) {
        setTimeout(() => {
          setRunTour(true);
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    if (run) {
      setRunTour(true);
    }
  }, [run]);

  const steps: Step[] = [
    {
      target: '[data-tour="recommended-courses"]',
      content: 'Here are your personalized course recommendations based on your interests. Click any course to learn more!',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="navigation"]',
      content: 'Use these tabs to navigate between your courses, certificates, bookmarks, and notifications.',
      placement: 'bottom',
    },
    {
      target: '.fixed.bottom-24',
      content: 'Need help? Click here to chat with your AI learning assistant for personalized guidance and answers.',
      placement: 'left',
    },
    {
      target: '[data-tour="my-courses"]',
      content: 'Track your learning progress and see all your enrolled courses here. Keep up the great work!',
      placement: 'top',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      localStorage.setItem('hasSeenWelcomeTour', 'true');
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#E5A000',
          textColor: '#1a1a1a',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: '#E5A000',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 600,
        },
        buttonBack: {
          color: '#666',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#999',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip tour',
      }}
    />
  );
};
