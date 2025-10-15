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
    if (sorted.includes(index)) return 'bg-green-400';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-orange-400';
    if (active.includes(index)) return 'bg-purple-400';
    return 'bg-cyan-400';
  };

  const getBarHeight = (value: number) => (value / maxValue) * 100;

  return (
    <div className="flex h-full w-full items-end justify-center overflow-hidden">
      <div className="flex w-full items-end justify-center">
        {array.map((value, index) => (
          <div
            key={index}
            className="relative"
            style={{
              width: `${100 / array.length}%`,
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
