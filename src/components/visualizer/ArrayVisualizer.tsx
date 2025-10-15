import { cn } from '@/lib/utils';

interface ArrayVisualizerProps {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  active?: number[];
  maxValue: number;
}

export const ArrayVisualizer = ({
  array,
  comparing = [],
  swapping = [],
  sorted = [],
  active = [],
  maxValue,
}: ArrayVisualizerProps) => {
  const getBarColor = (index: number) => {
    // 🟩 Sorted elements — green
    if (sorted.includes(index)) return 'bg-green-400';
    // 🔴 Swapping elements — red
    if (swapping.includes(index)) return 'bg-red-500';
    // 🟠 Comparing elements — orange
    if (comparing.includes(index)) return 'bg-orange-400';
    // 🟣 Active (being processed) — purple
    if (active.includes(index)) return 'bg-purple-400';
    // 🔵 Default unsorted bars — cyan
    return 'bg-cyan-400';
  };

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className="flex h-[400px] w-full items-end justify-center bg-neutral-900 overflow-hidden">
      <div className="flex w-full items-end justify-center">
        {array.map((value, index) => (
          <div
            key={index}
            className="relative"
            style={{
              width: `${100 / array.length}%`, // Evenly spaced bars across the container
            }}
          >
            <div
              className={cn(
                'transition-all duration-300 ease-in-out rounded-t-sm',
                getBarColor(index)
              )}
              style={{
                height: `${getBarHeight(value)}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
