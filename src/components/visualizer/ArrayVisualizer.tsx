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
  // Choose classes for each state. Adjust to your theme if needed.
  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return 'bg-green-500/90';
    if (swapping.includes(index)) return 'bg-red-500/95';
    if (comparing.includes(index)) return 'bg-orange-400/95';
    if (active.includes(index)) return 'bg-purple-500/90';
    return 'bg-cyan-400/90';
  };

  const getBarHeight = (value: number) => {
    // clamp to avoid 0 heights
    const pct = (value / Math.max(1, maxValue)) * 100;
    return Math.max(3, pct); // at least 3% so tiny values are visible
  };

  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    // Outer fills the parent visualizer area (parent sets fixed height)
    <div className="w-full h-full flex items-end justify-center px-2">
      <div
        className="relative flex items-end justify-between w-full h-full gap-1"
        style={{ alignItems: 'end' }}
      >
        {array.map((value, index) => {
          const heightPct = getBarHeight(value);
          return (
            <div
              key={index}
              className="flex-1 flex items-end justify-center"
              style={{
                // Keep a minimum width so bars are visible on small arrays, but scale with count
                minWidth: '4px',
                maxWidth: `${100 / Math.max(1, array.length)}%`,
              }}
            >
              <div
                className={cn(
                  'w-full rounded-t-md transition-all duration-300 ease-out transform origin-bottom',
                  getBarColor(index)
                )}
                style={{
                  height: `${heightPct}%`,
                  boxShadow: swapping.includes(index)
                    ? '0 0 12px rgba(239,68,68,0.45)'
                    : comparing.includes(index)
                    ? '0 0 10px rgba(249,115,22,0.28)'
                    : '',
                }}
                title={`index: ${index} — value: ${value}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
