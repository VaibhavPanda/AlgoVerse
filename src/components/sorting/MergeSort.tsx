import { useState, useEffect, useCallback } from 'react';
import { VisualizationStep } from '@/types/algorithm';
import { ArrayVisualizer } from '../visualizer/ArrayVisualizer';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { StatsPanel } from '../visualizer/StatsPanel';
import { toast } from 'sonner';

interface MergeSortProps {
  initialArray?: number[];
  initialSize?: number;
}

export const MergeSort = ({ initialArray, initialSize = 30 }: MergeSortProps) => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [arraySize, setArraySize] = useState(initialSize);
  const [comparisons, setComparisons] = useState(0);

  const generateRandomArray = useCallback((size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  }, []);

  const generateSteps = useCallback((arr: number[]) => {
    const steps: VisualizationStep[] = [];
    const tempArr = [...arr];
    let compCount = 0;

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: [],
      description: 'Starting Merge Sort - Divide and Conquer',
    });

    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      steps.push({
        array: [...arr],
        comparing: [],
        active: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: [],
        description: `Merging subarrays [${left}...${mid}] and [${mid+1}...${right}]`,
      });

      while (i < leftArr.length && j < rightArr.length) {
        compCount++;
        steps.push({
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          sorted: [],
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        
        steps.push({
          array: [...arr],
          comparing: [],
          active: [k],
          sorted: [],
          description: `Placing ${arr[k]} at position ${k}`,
        });
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push({
          array: [...arr],
          active: [k],
          sorted: [],
          description: `Copying remaining element ${arr[k]}`,
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push({
          array: [...arr],
          active: [k],
          sorted: [],
          description: `Copying remaining element ${arr[k]}`,
        });
        j++;
        k++;
      }
    };

    const mergeSort = (arr: number[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...arr],
          active: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          sorted: [],
          description: `Dividing array at position ${mid}`,
        });

        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
      }
    };

    mergeSort(tempArr, 0, tempArr.length - 1);

    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: tempArr.length }, (_, k) => k),
      description: 'Array is sorted!',
    });

    setComparisons(compCount);
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
              'function mergeSort(arr):',
              '  if length of arr <= 1:',
              '    return arr',
              '  mid = length / 2',
              '  left = mergeSort(arr[0...mid])',
              '  right = mergeSort(arr[mid...end])',
              '  return merge(left, right)',
            ]}
          />
        </div>

        <div>
          <StatsPanel
            comparisons={comparisons}
            swaps={0}
            timeComplexity="O(n log n)"
            spaceComplexity="O(n)"
          />
        </div>
      </div>
    </div>
  );
};
