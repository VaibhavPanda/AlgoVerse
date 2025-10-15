import { useState, useEffect, useCallback } from 'react';
import { ArrayVisualizer } from '../visualizer/ArrayVisualizer';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface BinarySearchStep {
  array: number[];
  left: number;
  right: number;
  mid: number;
  active: number[];
  comparing: number[];
  description: string;
}

export const BinarySearch = () => {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState(42);
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);

  const generateSortedArray = useCallback((size: number) => {
    return Array.from({ length: size }, (_, i) => (i + 1) * 5);
  }, []);

  const generateSteps = useCallback((arr: number[], target: number) => {
    const steps: BinarySearchStep[] = [];
    let compCount = 0;

    steps.push({
      array: [...arr],
      left: 0,
      right: arr.length - 1,
      mid: -1,
      active: [],
      comparing: [],
      description: `Searching for ${target} in sorted array`,
    });

    const search = (left: number, right: number): number => {
      if (left > right) {
        steps.push({
          array: [...arr],
          left,
          right,
          mid: -1,
          active: [],
          comparing: [],
          description: `${target} not found in array`,
        });
        return -1;
      }

      const mid = Math.floor((left + right) / 2);
      compCount++;

      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        active: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        comparing: [mid],
        description: `Checking middle element at index ${mid}: ${arr[mid]}`,
      });

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          active: [mid],
          comparing: [mid],
          description: `Found ${target} at index ${mid}!`,
        });
        return mid;
      }

      if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          active: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
          comparing: [],
          description: `${arr[mid]} < ${target}, searching right half`,
        });
        return search(mid + 1, right);
      } else {
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          active: Array.from({ length: mid - left }, (_, i) => left + i),
          comparing: [],
          description: `${arr[mid]} > ${target}, searching left half`,
        });
        return search(left, mid - 1);
      }
    };

    search(0, arr.length - 1);
    setComparisons(compCount);
    return steps;
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newArray = generateSortedArray(20);
    setArray(newArray);
    const newSteps = generateSteps(newArray, target);
    setSteps(newSteps);
    toast.success('Reset complete');
  }, [generateSortedArray, generateSteps, target]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      toast.success('Search complete!');
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      reset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSearch = () => {
    const newArray = generateSortedArray(20);
    setArray(newArray);
    const newSteps = generateSteps(newArray, target);
    setSteps(newSteps);
    setCurrentStep(0);
    toast.success('New search started');
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    left: 0,
    right: array.length - 1,
    mid: -1,
    active: [],
    comparing: [],
    description: '',
  };

  const maxValue = Math.max(...array);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Target</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label>Target Value</Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                disabled={isPlaying}
              />
            </div>
            <Button onClick={handleSearch} disabled={isPlaying}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {currentStepData.description}
        </p>
        <ArrayVisualizer
          array={currentStepData.array}
          comparing={currentStepData.comparing}
          active={currentStepData.active}
          maxValue={maxValue}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            speed={speed}
            arraySize={20}
            currentStep={currentStep}
            totalSteps={steps.length}
            onPlayPause={handlePlayPause}
            onReset={reset}
            onStepBack={() => setCurrentStep(Math.max(0, currentStep - 1))}
            onStepForward={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            onSpeedChange={(value) => setSpeed(value[0])}
            onArraySizeChange={() => {}}
          />

          <CodeViewer
            pseudocode={[
              'function binarySearch(arr, target, low, high):',
              '  if low > high: return -1',
              '  mid = (low + high) / 2',
              '  if arr[mid] == target: return mid',
              '  if arr[mid] > target:',
              '    return binarySearch(arr, target, low, mid-1)',
              '  else:',
              '    return binarySearch(arr, target, mid+1, high)',
            ]}
          />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Target</div>
                  <div className="text-2xl font-bold">{target}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Comparisons</div>
                  <div className="text-2xl font-bold">{comparisons}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Complexity</div>
                  <div className="text-lg font-semibold">O(log n)</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Space Complexity</div>
                  <div className="text-lg font-semibold">O(1)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
