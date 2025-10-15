import { useState, useEffect, useCallback } from 'react';
import { VisualizationStep } from '@/types/algorithm';
import { ArrayVisualizer } from '../visualizer/ArrayVisualizer';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { StatsPanel } from '../visualizer/StatsPanel';
import { toast } from 'sonner';

interface QuickSortProps {
  initialArray?: number[];
  initialSize?: number;
}

export const QuickSort = ({ initialArray, initialSize = 30 }: QuickSortProps) => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [arraySize, setArraySize] = useState(initialSize);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const generateRandomArray = useCallback((size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  }, []);

  const generateSteps = useCallback((arr: number[]) => {
    const steps: VisualizationStep[] = [];
    const tempArr = [...arr];
    let compCount = 0;
    let swapCount = 0;

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: [],
      description: 'Starting Quick Sort',
    });

    const partition = (arr: number[], low: number, high: number): number => {
      const pivot = arr[high];
      
      steps.push({
        array: [...arr],
        active: [high],
        comparing: [],
        sorted: [],
        description: `Pivot selected: ${pivot}`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        compCount++;
        steps.push({
          array: [...arr],
          comparing: [j, high],
          active: [high],
          sorted: [],
          description: `Comparing ${arr[j]} with pivot ${pivot}`,
        });

        if (arr[j] < pivot) {
          i++;
          if (i !== j) {
            swapCount++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({
              array: [...arr],
              swapping: [i, j],
              active: [high],
              sorted: [],
              description: `Swapping ${arr[j]} with ${arr[i]}`,
            });
          }
        }
      }

      swapCount++;
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        array: [...arr],
        swapping: [i + 1, high],
        sorted: [],
        description: `Placing pivot ${pivot} at position ${i + 1}`,
      });

      return i + 1;
    };

    const quickSort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        steps.push({
          array: [...arr],
          active: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
          sorted: [],
          description: `Sorting subarray [${low}...${high}]`,
        });

        const pi = partition(arr, low, high);
        
        steps.push({
          array: [...arr],
          active: [pi],
          sorted: [pi],
          description: `Pivot ${arr[pi]} is now in correct position`,
        });

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
      } else if (low === high) {
        steps.push({
          array: [...arr],
          active: [low],
          sorted: [low],
          description: `Single element ${arr[low]} is in correct position`,
        });
      }
    };

    quickSort(tempArr, 0, tempArr.length - 1);

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: tempArr.length }, (_, k) => k),
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
              'function quickSort(arr, low, high):',
              '  if low < high:',
              '    pivot = partition(arr, low, high)',
              '    quickSort(arr, low, pivot-1)',
              '    quickSort(arr, pivot+1, high)',
            ]}
          />
        </div>

        <div>
          <StatsPanel
            comparisons={comparisons}
            swaps={swaps}
            timeComplexity="O(n log n)"
            spaceComplexity="O(log n)"
          />
        </div>
      </div>
    </div>
  );
};
