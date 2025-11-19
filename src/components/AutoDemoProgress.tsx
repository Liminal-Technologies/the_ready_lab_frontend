import { useState, useEffect } from 'react';
import { X, Pause, Play, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { getAutoDemoOrchestrator, DemoState, DemoSpeed } from '@/utils/autoDemoOrchestrator';
import confetti from 'canvas-confetti';

interface AutoDemoProgressProps {
  onClose?: () => void;
}

export function AutoDemoProgress({ onClose }: AutoDemoProgressProps) {
  const [demoState, setDemoState] = useState<DemoState>({
    currentStep: 'IDLE',
    isRunning: false,
    isPaused: false,
    speed: 1,
    progress: 0,
  });

  const orchestrator = getAutoDemoOrchestrator({
    onStateChange: (state) => {
      setDemoState(state);
    },
    onComplete: () => {
      // Celebrate completion with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    },
  });

  useEffect(() => {
    // Sync state on mount
    setDemoState(orchestrator.getState());
  }, []);

  const handlePauseResume = () => {
    if (demoState.isPaused) {
      orchestrator.resume();
    } else {
      orchestrator.pause();
    }
  };

  const handleCancel = () => {
    orchestrator.cancel();
    onClose?.();
  };

  const handleSpeedChange = () => {
    const speeds: DemoSpeed[] = [1, 2, 4];
    const currentIndex = speeds.indexOf(demoState.speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    orchestrator.setSpeed(nextSpeed);
  };

  const stepDescription = orchestrator.getStepDescription();
  const isComplete = demoState.currentStep === 'COMPLETE';

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      data-testid="auto-demo-overlay"
    >
      <Card className="w-full max-w-2xl mx-4 p-6 shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Auto Demo
                {isComplete && " 🎉"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isComplete 
                  ? "Demo completed successfully! Review the educator dashboard to see all features."
                  : "Watch the automated educator journey unfold"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              data-testid="button-cancel-demo"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stepDescription}</span>
              <span className="text-muted-foreground">{Math.round(demoState.progress)}%</span>
            </div>
            <Progress 
              value={demoState.progress} 
              className="h-3"
              data-testid="progress-bar-demo"
            />
          </div>

          {/* Current Step Details */}
          <div className="bg-muted/30 rounded-lg p-4 min-h-[60px] flex items-center">
            <p className="text-sm text-muted-foreground">
              {isComplete ? (
                <span className="flex flex-col gap-2">
                  <span className="text-foreground font-medium">✅ Course created and published</span>
                  <span className="text-foreground font-medium">✅ Student enrolled and progressing</span>
                  <span className="text-foreground font-medium">✅ Analytics and revenue tracking active</span>
                </span>
              ) : (
                <span>
                  The system is automatically navigating through the educator journey.
                  You can pause, adjust speed, or cancel at any time.
                </span>
              )}
            </p>
          </div>

          {/* Controls */}
          {!isComplete && (
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handlePauseResume}
                disabled={!demoState.isRunning}
                className="flex-1"
                data-testid="button-pause-resume"
              >
                {demoState.isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSpeedChange}
                disabled={!demoState.isRunning || demoState.isPaused}
                className="px-6"
                data-testid="button-speed-control"
              >
                <Zap className="mr-2 h-4 w-4" />
                {demoState.speed}x
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleCancel}
                className="px-6"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Completion Actions */}
          {isComplete && (
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="default"
                onClick={() => window.location.href = '/educator/dashboard'}
                className="flex-1"
                data-testid="button-view-dashboard"
              >
                View Educator Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                data-testid="button-close-demo"
              >
                Close Demo
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
