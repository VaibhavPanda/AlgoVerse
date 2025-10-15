import { useState, useEffect, useCallback } from 'react';
import { VisualizationStep } from '@/types/algorithm';
import { ArrayVisualizer } from '../visualizer/ArrayVisualizer';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { StatsPanel } from '../visualizer/StatsPanel';
import { toast } from 'sonner';

interface BubbleSortProps {
  initialArray?: number[];
  initialSize?: number;
}

export const BubbleSort = ({ initialArray, initialSize = 30 }: BubbleSortProps) => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(initialSize);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const generateRandomArray = useCallback((size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  }, []);

  const generateSteps = useCallback((arr: number[]) => {
    const steps: VisualizationStep[] = [];
    const tempArr = [...arr];
    const n = tempArr.length;
    let compCount = 0;
    let swapCount = 0;

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: [],
      description: 'Starting Bubble Sort',
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        compCount++;
        steps.push({
          array: [...tempArr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
          description: `Comparing ${tempArr[j]} and ${tempArr[j + 1]}`,
        });

        if (tempArr[j] > tempArr[j + 1]) {
          swapCount++;
          [tempArr[j], tempArr[j + 1]] = [tempArr[j + 1], tempArr[j]];
          steps.push({
            array: [...tempArr],
            comparing: [],
            swapping: [j, j + 1],
            sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
            description: `Swapping ${tempArr[j + 1]} and ${tempArr[j]}`,
          });
        }
      }
    }

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      description: 'Array is sorted!',
    });

    setComparisons(compCount);
    setSwaps(swapCount);
    return steps;
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newArray = initialArray || generateRandomArray(arraySize);
    setArray(newArray);
    const newSteps = generateSteps(newArray);
    setSteps(newSteps);
    toast.success('Reset complete');
  }, [arraySize, generateRandomArray, generateSteps, initialArray]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      toast.success('Sorting complete!');
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

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    comparing: [],
    swapping: [],
    sorted: [],
    description: '',
  };

  const maxValue = Math.max(...array);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {currentStepData.description}
        </p>
        <ArrayVisualizer
          array={currentStepData.array}
          comparing={currentStepData.comparing}
          swapping={currentStepData.swapping}
          sorted={currentStepData.sorted}
          active={currentStepData.active}
          maxValue={maxValue}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            speed={speed}
            arraySize={arraySize}
            currentStep={currentStep}
            totalSteps={steps.length}
            onPlayPause={handlePlayPause}
            onReset={reset}
            onStepBack={handleStepBack}
            onStepForward={handleStepForward}
            onSpeedChange={(value) => setSpeed(value[0])}
            onArraySizeChange={(value) => {
              setArraySize(value[0]);
              const newArray = generateRandomArray(value[0]);
              setArray(newArray);
              const newSteps = generateSteps(newArray);
              setSteps(newSteps);
              setCurrentStep(0);
            }}
          />

          <CodeViewer
            pseudocode={[
              'for i from 0 to n-1:',
              '  for j from 0 to n-i-1:',
              '    if arr[j] > arr[j+1]:',
              '      swap arr[j] and arr[j+1]',
            ]}
          />
        </div>

        <div>
          <StatsPanel
            comparisons={comparisons}
            swaps={swaps}
            timeComplexity="O(n²)"
            spaceComplexity="O(1)"
          />
        </div>
      </div>
    </div>
  );
};
