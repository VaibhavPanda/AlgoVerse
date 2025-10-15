import { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface FibStep {
  callStack: string[];
  result?: number;
  description: string;
}

export const Fibonacci = () => {
  const [n, setN] = useState(8);
  const [steps, setSteps] = useState<FibStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [calls, setCalls] = useState(0);

  const generateSteps = useCallback((num: number) => {
    const steps: FibStep[] = [];
    const memo: { [key: number]: number } = {};
    let callCount = 0;

    const fib = (n: number, callStack: string[] = []): number => {
      callCount++;
      const newCallStack = [...callStack, `fib(${n})`];
      
      steps.push({
        callStack: newCallStack,
        description: `Calling fib(${n})`,
      });

      if (n <= 1) {
        steps.push({
          callStack: newCallStack,
          result: n,
          description: `Base case: fib(${n}) = ${n}`,
        });
        memo[n] = n;
        return n;
      }

      if (memo[n] !== undefined) {
        steps.push({
          callStack: newCallStack,
          result: memo[n],
          description: `Memoized: fib(${n}) = ${memo[n]}`,
        });
        return memo[n];
      }

      const left = fib(n - 1, newCallStack);
      const right = fib(n - 2, newCallStack);
      const result = left + right;
      
      memo[n] = result;
      
      steps.push({
        callStack: newCallStack,
        result,
        description: `fib(${n}) = fib(${n - 1}) + fib(${n - 2}) = ${left} + ${right} = ${result}`,
      });

      return result;
    };

    steps.push({
      callStack: [],
      description: `Starting Fibonacci calculation for n = ${num}`,
    });

    const finalResult = fib(num);
    
    steps.push({
      callStack: [],
      result: finalResult,
      description: `Final result: fib(${num}) = ${finalResult}`,
    });

    setCalls(callCount);
    return steps;
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newSteps = generateSteps(n);
    setSteps(newSteps);
    toast.success('Reset complete');
  }, [n, generateSteps]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      toast.success('Calculation complete!');
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

  const handleCalculate = () => {
    if (n < 0 || n > 20) {
      toast.error('Please enter a number between 0 and 20');
      return;
    }
    reset();
  };

  const currentStepData = steps[currentStep] || { callStack: [], description: '' };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label>Calculate Fibonacci of n</Label>
              <Input
                type="number"
                min={0}
                max={20}
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 0)}
                disabled={isPlaying}
              />
            </div>
            <Button onClick={handleCalculate} disabled={isPlaying}>
              Calculate
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter a number between 0 and 20 to see the recursive calls
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call Stack Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {currentStepData.description}
          </p>
          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="space-y-2 font-mono text-sm">
              {currentStepData.callStack.length === 0 ? (
                <div className="text-center text-muted-foreground">Call stack is empty</div>
              ) : (
                currentStepData.callStack.map((call, idx) => (
                  <div
                    key={idx}
                    className="rounded bg-primary/10 px-4 py-2 transition-all"
                    style={{ marginLeft: `${idx * 20}px` }}
                  >
                    {call}
                    {idx === currentStepData.callStack.length - 1 && currentStepData.result !== undefined && (
                      <span className="ml-2 font-bold text-green-500">→ {currentStepData.result}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            speed={speed}
            arraySize={n}
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
              'function fib(n):',
              '  if n <= 1: return n',
              '  return fib(n-1) + fib(n-2)',
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
                  <div className="text-sm text-muted-foreground">Input n</div>
                  <div className="text-2xl font-bold">{n}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Function Calls</div>
                  <div className="text-2xl font-bold">{calls}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Complexity</div>
                  <div className="text-lg font-semibold">O(n)</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Space Complexity</div>
                  <div className="text-lg font-semibold">O(n)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
