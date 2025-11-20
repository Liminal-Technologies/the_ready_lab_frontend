import { useDemoExperience } from '@/contexts/DemoExperienceContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DemoExperienceOverlay() {
  const { state, pauseDemo, resumeDemo, cancelDemo, setSpeed, getCurrentStep, getProgress } = useDemoExperience();
  const [currentNarration, setCurrentNarration] = useState('');
  
  const isActive = state.status !== 'idle';
  const isRunning = state.status === 'running';
  const isPaused = state.status === 'paused';

  useEffect(() => {
    const handleStepChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ step: any }>;
      setCurrentNarration(customEvent.detail.step.narration);
    };

    window.addEventListener('demo:step', handleStepChange);
    return () => window.removeEventListener('demo:step', handleStepChange);
  }, []);

  if (!isActive) return null;

  const progress = getProgress();
  const step = getCurrentStep();
  const journeyLabels: Record<string, string> = {
    'A': 'Discovery & Signup',
    'B': 'Dashboard Overview',
    'C': 'Course Creation',
    'D': 'Student Analytics',
    'E': 'Revenue & Payouts',
    'F': 'Live Events',
  };

  const handleSpeedToggle = () => {
    const speeds: (1 | 2 | 4)[] = [1, 2, 4];
    const currentIndex = speeds.indexOf(state.speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl border-0">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-semibold text-sm">
                  {state.status === 'completed' ? 'Demo Complete!' : 'Auto Demo Running'}
                </span>
              </div>
              {step && (
                <span className="text-xs opacity-90 px-2 py-1 bg-white/20 rounded">
                  Journey {step.journey}: {journeyLabels[step.journey]}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelDemo}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              data-testid="button-cancel-demo"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress value={progress} className="h-2 bg-white/20" />
            <div className="flex justify-between text-xs opacity-90">
              <span>Step {state.currentStepIndex + 1} of {state.totalSteps}</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Narration */}
          {currentNarration && (
            <div className="text-sm bg-white/10 rounded p-3 min-h-[3rem] flex items-center">
              <p className="leading-relaxed">{currentNarration}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={isRunning ? pauseDemo : resumeDemo}
              className="flex-1"
              data-testid={isRunning ? "button-pause-demo" : "button-resume-demo"}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSpeedToggle}
              className="w-20"
              data-testid="button-speed-demo"
            >
              <Zap className="h-4 w-4 mr-1" />
              {state.speed}x
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
