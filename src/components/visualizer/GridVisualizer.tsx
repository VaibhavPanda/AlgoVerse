import { cn } from '@/lib/utils';

interface Cell {
  row: number;
  col: number;
  isWall?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  isVisited?: boolean;
  isPath?: boolean;
  distance?: number;
}

interface GridVisualizerProps {
  grid: Cell[][];
  cellSize?: number;
}

export const GridVisualizer = ({ grid, cellSize = 20 }: GridVisualizerProps) => {
  const getCellColor = (cell: Cell) => {
    if (cell.isStart) return 'bg-green-500';
    if (cell.isEnd) return 'bg-red-500';
    if (cell.isPath) return 'bg-yellow-400';
    if (cell.isVisited) return 'bg-blue-300';
    if (cell.isWall) return 'bg-gray-800';
    return 'bg-card';
  };

  return (
    <div className="flex items-center justify-center overflow-auto rounded-lg border bg-background p-4">
      <div className="inline-block">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={cn(
                  'border border-border transition-all duration-300',
                  getCellColor(cell)
                )}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                title={
                  cell.distance !== undefined
                    ? `Distance: ${cell.distance}`
                    : undefined
                }
              >
                {cell.distance !== undefined && cell.distance < 999 && (
                  <div className="flex h-full items-center justify-center text-[8px] font-bold">
                    {cell.distance}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
