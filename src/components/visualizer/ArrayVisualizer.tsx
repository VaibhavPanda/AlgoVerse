import { cn } from '@/lib/utils';

interface ArrayVisualizerProps {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  active?: number[];
  maxValue: number;
}

// Define the maximum pixel height for the bars, matching the container height from the JSX
const MAX_BAR_HEIGHT_PX = 400;

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
    return 'bg-blue-500';
  };

  const getBarHeight = (value: number) => {
    const safeMaxValue = maxValue > 0 ? maxValue : 1;
    
    // Calculate height directly in PIXELS
    const heightPx = (value / safeMaxValue) * MAX_BAR_HEIGHT_PX;

    // Guaranteed minimum height of 2 pixels for visibility, even if value is very small.
    return Math.max(heightPx, 2); 
  };

  return (
    // Reverting to functional container (removed temporary border/gap/padding)
    <div className="flex h-[400px] items-end justify-center gap-1 w-full p-4"> 
      {array.map((value, index) => (
        <div
          key={index}
          // Reverting to the dynamic width classes
          className="flex-1 min-w-[2px] max-w-[40px] relative group"
        >
          <div
            className={cn(
              'w-full rounded-t transition-all duration-300',
              getBarColor(index)
            )}
            style={{ height: `${getBarHeight(value)}px` }} 
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
