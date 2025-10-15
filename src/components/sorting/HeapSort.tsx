import { useState, useEffect, useCallback } from 'react';
import { VisualizationStep } from '@/types/algorithm';
import { ArrayVisualizer } from '../visualizer/ArrayVisualizer';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { StatsPanel } from '../visualizer/StatsPanel';
import { toast } from 'sonner';

interface HeapSortProps {
  initialArray?: number[];
  initialSize?: number;
}

export const HeapSort = ({ initialArray, initialSize = 30 }: HeapSortProps) => {
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
    const n = tempArr.length;
    let compCount = 0;
    let swapCount = 0;

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: [],
      description: 'Starting Heap Sort - Building Max Heap',
    });

    const heapify = (arr: number[], n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      steps.push({
        array: [...arr],
        active: [i, left, right].filter(idx => idx < n),
        comparing: [],
        sorted: Array.from({ length: tempArr.length - n }, (_, k) => n + k),
        description: `Heapifying at index ${i}`,
      });

      if (left < n) {
        compCount++;
        steps.push({
          array: [...arr],
          comparing: [largest, left],
          sorted: Array.from({ length: tempArr.length - n }, (_, k) => n + k),
          description: `Comparing ${arr[largest]} with left child ${arr[left]}`,
        });
        
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        compCount++;
        steps.push({
          array: [...arr],
          comparing: [largest, right],
          sorted: Array.from({ length: tempArr.length - n }, (_, k) => n + k),
          description: `Comparing ${arr[largest]} with right child ${arr[right]}`,
        });
        
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        swapCount++;
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        steps.push({
          array: [...arr],
          swapping: [i, largest],
          sorted: Array.from({ length: tempArr.length - n }, (_, k) => n + k),
          description: `Swapping ${arr[largest]} with ${arr[i]}`,
        });

        heapify(arr, n, largest);
      }
    };

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(tempArr, n, i);
    }

    steps.push({
      array: [...tempArr],
      comparing: [],
      sorted: [],
      description: 'Max heap built! Now extracting elements',
    });

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      swapCount++;
      [tempArr[0], tempArr[i]] = [tempArr[i], tempArr[0]];
      
      steps.push({
        array: [...tempArr],
        swapping: [0, i],
        sorted: Array.from({ length: n - i }, (_, k) => i + k),
        description: `Moving max element ${tempArr[i]} to sorted position`,
      });

      heapify(tempArr, i, 0);
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
              'buildMaxHeap(arr)',
              'for i from n-1 to 1:',
              '  swap arr[0] and arr[i]',
              '  heapify(arr, 0, i)',
            ]}
          />
        </div>

        <div>
          <StatsPanel
            comparisons={comparisons}
            swaps={swaps}
            timeComplexity="O(n log n)"
            spaceComplexity="O(1)"
          />
        </div>
      </div>
    </div>
  );
};
