import { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SieveStep {
  primes: boolean[];
  currentPrime: number;
  marking: number[];
  description: string;
}

export const SieveOfEratosthenes = () => {
  const [limit, setLimit] = useState(100);
  const [steps, setSteps] = useState<SieveStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [primeCount, setPrimeCount] = useState(0);

  const generateSteps = useCallback((n: number) => {
    const steps: SieveStep[] = [];
    const primes = Array(n + 1).fill(true);
    primes[0] = primes[1] = false;

    steps.push({
      primes: [...primes],
      currentPrime: -1,
      marking: [],
      description: 'Starting Sieve of Eratosthenes',
    });

    for (let p = 2; p * p <= n; p++) {
      if (primes[p]) {
        steps.push({
          primes: [...primes],
          currentPrime: p,
          marking: [],
          description: `${p} is prime, marking its multiples`,
        });

        const multiplesMarked: number[] = [];
        for (let i = p * p; i <= n; i += p) {
          if (primes[i]) {
            primes[i] = false;
            multiplesMarked.push(i);
          }
        }

        if (multiplesMarked.length > 0) {
          steps.push({
            primes: [...primes],
            currentPrime: p,
            marking: multiplesMarked,
            description: `Marking multiples of ${p}: ${multiplesMarked.join(', ')}`,
          });
        }
      }
    }

    const finalPrimes = primes.filter((isPrime, idx) => isPrime && idx > 1);
    setPrimeCount(finalPrimes.length);

    steps.push({
      primes: [...primes],
      currentPrime: -1,
      marking: [],
      description: `Found ${finalPrimes.length} prime numbers!`,
    });

    return steps;
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newSteps = generateSteps(limit);
    setSteps(newSteps);
    toast.success('Reset complete');
  }, [limit, generateSteps]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      toast.success('Sieve complete!');
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

  const currentStepData = steps[currentStep] || {
    primes: Array(limit + 1).fill(true),
    currentPrime: -1,
    marking: [],
    description: '',
  };

  const getCellColor = (num: number, isPrime: boolean) => {
    if (num < 2) return 'bg-muted';
    if (num === currentStepData.currentPrime) return 'bg-green-500 text-white';
    if (currentStepData.marking.includes(num)) return 'bg-red-500 text-white';
    if (!isPrime) return 'bg-gray-300 dark:bg-gray-700';
    return 'bg-blue-500 text-white';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prime Number Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {currentStepData.description}
          </p>
          <div className="mb-4 flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-green-500" />
              <span>Current Prime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-500" />
              <span>Marking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-blue-500" />
              <span>Prime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700" />
              <span>Not Prime</span>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <div className="grid grid-cols-10 gap-1">
              {currentStepData.primes.map((isPrime, num) => (
                <div
                  key={num}
                  className={cn(
                    'flex h-10 w-full items-center justify-center rounded text-xs font-bold transition-all duration-300',
                    getCellColor(num, isPrime)
                  )}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            speed={speed}
            arraySize={limit}
            currentStep={currentStep}
            totalSteps={steps.length}
            onPlayPause={handlePlayPause}
            onReset={reset}
            onStepBack={() => setCurrentStep(Math.max(0, currentStep - 1))}
            onStepForward={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            onSpeedChange={(value) => setSpeed(value[0])}
            onArraySizeChange={(value) => {
              setLimit(value[0]);
              const newSteps = generateSteps(value[0]);
              setSteps(newSteps);
              setCurrentStep(0);
            }}
          />

          <CodeViewer
            pseudocode={[
              'create boolean array prime[0..n] = true',
              'for p from 2 to sqrt(n):',
              '  if prime[p]:',
              '    for i from p*p to n (step p):',
              '      prime[i] = false',
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
                  <div className="text-sm text-muted-foreground">Limit</div>
                  <div className="text-2xl font-bold">{limit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Primes Found</div>
                  <div className="text-2xl font-bold">{primeCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Complexity</div>
                  <div className="text-lg font-semibold">O(n log log n)</div>
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
