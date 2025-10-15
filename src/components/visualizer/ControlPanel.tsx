import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

interface ControlPanelProps {
  isPlaying: boolean;
  speed: number;
  arraySize: number;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (value: number[]) => void;
  onArraySizeChange: (value: number[]) => void;
  disabled?: boolean;
}

export const ControlPanel = ({
  isPlaying,
  speed,
  arraySize,
  currentStep,
  totalSteps,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  onSpeedChange,
  onArraySizeChange,
  disabled = false,
}: ControlPanelProps) => {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Controls</Label>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onStepBack}
            disabled={disabled || currentStep === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant={isPlaying ? 'destructive' : 'default'}
            className="flex-1"
            onClick={onPlayPause}
            disabled={disabled}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={disabled || currentStep >= totalSteps}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={disabled}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Animation Speed</Label>
          <span className="text-sm text-muted-foreground">{speed}ms</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={onSpeedChange}
          min={10}
          max={1000}
          step={10}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Array Size</Label>
          <span className="text-sm text-muted-foreground">{arraySize}</span>
        </div>
        <Slider
          value={[arraySize]}
          onValueChange={onArraySizeChange}
          min={5}
          max={100}
          step={5}
          disabled={disabled || isPlaying}
        />
      </div>
    </div>
  );
};
