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
    if (sorted.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (active.includes(index)) return 'bg-purple-500';
    return 'bg-primary';
  };

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className="flex h-[400px] items-end justify-center gap-1 rounded-lg border bg-card p-4">
      {array.map((value, index) => (
        <div
          key={index}
          className="flex-1 min-w-[2px] max-w-[40px] relative group"
        >
          <div
            className={cn(
              'w-full rounded-t transition-all duration-300',
              getBarColor(index)
            )}
            style={{ height: `${getBarHeight(value)}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded text-xs whitespace-nowrap">
              {value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
