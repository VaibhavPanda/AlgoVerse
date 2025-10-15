import { useState, useEffect, useCallback } from 'react';
import { GridVisualizer } from '../visualizer/GridVisualizer';
import { ControlPanel } from '../visualizer/ControlPanel';
import { CodeViewer } from '../visualizer/CodeViewer';
import { StatsPanel } from '../visualizer/StatsPanel';
import { toast } from 'sonner';

interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
}

interface DFSStep {
  grid: Cell[][];
  description: string;
}

export const DFS = () => {
  const ROWS = 20;
  const COLS = 30;
  const START = { row: 10, col: 5 };
  const END = { row: 10, col: 25 };

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [steps, setSteps] = useState<DFSStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [nodesVisited, setNodesVisited] = useState(0);

  const createGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < COLS; col++) {
        const isWall = Math.random() < 0.2 && 
          !(row === START.row && col === START.col) &&
          !(row === END.row && col === END.col);
        
        currentRow.push({
          row,
          col,
          isWall,
          isStart: row === START.row && col === START.col,
          isEnd: row === END.row && col === END.col,
          isVisited: false,
          isPath: false,
          distance: 999,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }, []);

  const generateSteps = useCallback((initialGrid: Cell[][]) => {
    const steps: DFSStep[] = [];
    const grid = initialGrid.map(row => row.map(cell => ({ ...cell })));
    
    steps.push({
      grid: grid.map(row => row.map(cell => ({ ...cell }))),
      description: 'Starting DFS from green cell',
    });

    const stack: Cell[] = [];
    const visited = new Set<string>();
    const parent = new Map<string, Cell>();
    
    const startCell = grid[START.row][START.col];
    startCell.distance = 0;
    stack.push(startCell);
    
    let nodesCount = 0;
    let found = false;

    const getNeighbors = (cell: Cell): Cell[] => {
      const neighbors: Cell[] = [];
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ];

      for (const [dr, dc] of directions) {
        const newRow = cell.row + dr;
        const newCol = cell.col + dc;
        
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          !grid[newRow][newCol].isWall
        ) {
          neighbors.push(grid[newRow][newCol]);
        }
      }
      return neighbors;
    };

    while (stack.length > 0 && !found) {
      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;
      
      if (visited.has(key)) continue;
      
      visited.add(key);
      current.isVisited = true;
      nodesCount++;
      
      steps.push({
        grid: grid.map(row => row.map(cell => ({ ...cell }))),
        description: `Visiting cell (${current.row}, ${current.col})`,
      });
      
      if (current.isEnd) {
        found = true;
        
        // Reconstruct path
        let pathCell: Cell | undefined = current;
        while (pathCell) {
          pathCell.isPath = true;
          const cellKey = `${pathCell.row},${pathCell.col}`;
          pathCell = parent.get(cellKey);
        }
        
        steps.push({
          grid: grid.map(row => row.map(cell => ({ ...cell }))),
          description: `Path found!`,
        });
        break;
      }

      const neighbors = getNeighbors(current);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        
        if (!visited.has(neighborKey)) {
          parent.set(neighborKey, current);
          neighbor.distance = current.distance + 1;
          stack.push(neighbor);
        }
      }
    }

    if (!found) {
      steps.push({
        grid: grid.map(row => row.map(cell => ({ ...cell }))),
        description: 'No path found!',
      });
    }

    setNodesVisited(nodesCount);
    return steps;
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newGrid = createGrid();
    setGrid(newGrid);
    const newSteps = generateSteps(newGrid);
    setSteps(newSteps);
    toast.success('Reset complete');
  }, [createGrid, generateSteps]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      toast.success('DFS complete!');
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

  const currentStepData = steps[currentStep] || { grid, description: '' };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {currentStepData.description}
        </p>
        <div className="mb-4 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-green-500" />
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-red-500" />
            <span>End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-blue-300" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-yellow-400" />
            <span>Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-800" />
            <span>Wall</span>
          </div>
        </div>
        <GridVisualizer grid={currentStepData.grid} cellSize={20} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            speed={speed}
            arraySize={20}
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
              'function DFS(node):',
              '  mark node as visited',
              '  for each neighbor of node:',
              '    if not visited:',
              '      DFS(neighbor)',
            ]}
          />
        </div>

        <div>
          <StatsPanel
            comparisons={0}
            swaps={nodesVisited}
            timeComplexity="O(V + E)"
            spaceComplexity="O(V)"
          />
        </div>
      </div>
    </div>
  );
};
