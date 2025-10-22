import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner'; // Assuming sonner is available
import { Play, Pause, RefreshCcw, StepBack, StepForward, Check, Zap, Cpu } from 'lucide-react'; // Added icons

// --- Missing Components Now Included ---

// 1. GridVisualizer Component
interface GridVisualizerProps {
  grid: Cell[][];
  cellSize: number;
}

const GridVisualizer: React.FC<GridVisualizerProps> = ({ grid, cellSize }) => {
  const getCellColor = (cell: Cell) => {
    if (cell.isStart) return 'bg-green-500';
    if (cell.isEnd) return 'bg-red-500';
    if (cell.isPath) return 'bg-yellow-400';
    // Use isVisited for the "exploring" animation
    if (cell.isVisited) return 'bg-blue-300'; 
    if (cell.isWall) return 'bg-gray-800';
    // Default empty cell
    return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'; 
  };

  return (
    <div 
      className="grid" 
      style={{ 
        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
        width: (grid[0]?.length || 0) * cellSize,
        margin: '0 auto', // Center the grid
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`transition-colors duration-200 ${getCellColor(cell)}`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        ))
      )}
    </div>
  );
};

// 2. ControlPanel Component
interface ControlPanelProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (value: number[]) => void;
  onArraySizeChange: (value: number[]) => void; // Prop is unused but included
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  onSpeedChange,
}) => {
  // Mock Slider component since shadcn/ui isn't imported
  const MockSlider = ({ value, onChange, min, max, step }: { value: number[], onChange: (value: number[]) => void, min: number, max: number, step: number }) => (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onChange([Number(e.target.value)])}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
  
  // Mock Button component
  const Button = ({ onClick, children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-gray-900 text-white rounded-md hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
  
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={onReset} className="bg-red-600 hover:bg-red-700 text-white">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onStepBack} disabled={isPlaying || currentStep === 0}>
            <StepBack className="w-4 h-4" />
          </Button>
          <Button onClick={onPlayPause} className="w-24">
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={onStepForward} disabled={isPlaying || currentStep === totalSteps - 1}>
            <StepForward className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Step: {currentStep} / {totalSteps > 0 ? totalSteps - 1 : 0}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Animation Speed ({speed}ms)</label>
        <MockSlider
          value={[speed]}
          onChange={onSpeedChange}
          min={10}
          max={500}
          step={10}
        />
      </div>
    </div>
  );
};

// 3. CodeViewer Component
interface CodeViewerProps {
  pseudocode: string[];
}

const CodeViewer: React.FC<CodeViewerProps> = ({ pseudocode }) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-lg font-semibold mb-2">Pseudocode</h3>
      <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
        {pseudocode.map((line, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-gray-500 select-none">{index + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
};

// 4. StatsPanel Component
interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  swapLabel?: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  comparisons,
  swaps,
  swapLabel = "Swaps",
  timeComplexity,
  spaceComplexity,
}) => {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <h3 className="text-lg font-semibold">Statistics</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center">
            <Check className="w-4 h-4 mr-2 text-blue-500" />
            {swapLabel}
          </span>
          <span className="font-medium">{swaps}</span>
        </div>
        {/* 'Comparisons' is hidden if 0, as per the original component */}
        {comparisons > 0 && (
           <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center">
              <Check className="w-4 h-4 mr-2 text-blue-500" />
              Comparisons
            </span>
            <span className="font-medium">{comparisons}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            Time Complexity
          </span>
          <span className="font-medium">{timeComplexity}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-purple-500" />
            Space Complexity
          </span>
          <span className="font-medium">{spaceComplexity}</span>
        </div>
      </div>
    </div>
  );
};


// --- Original Dijkstra Component ---

// Cell interface remains the same, 'distance' is key for Dijkstra
interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean; // Tracks visited nodes for the *algorithm*
  isPath: boolean;
  distance: number; // Will store the shortest distance from the start
}

interface DijkstraStep {
  grid: Cell[][];
  description: string;
}

export const Dijkstra = () => {
  const ROWS = 20;
  const COLS = 30;
  const START = { row: 10, col: 5 };
  const END = { row: 10, col: 25 };

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [nodesVisited, setNodesVisited] = useState(0);

  // Creates the initial grid
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
          isVisited: false, // Algorithm 'visited'
          isPath: false,
          distance: Infinity, // Initialize all distances to Infinity
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }, []);

  // Generates all steps for Dijkstra's algorithm
  const generateSteps = useCallback((initialGrid: Cell[][]) => {
    const newSteps: DijkstraStep[] = [];
    const grid = initialGrid.map(row => row.map(cell => ({ ...cell })));
    
    newSteps.push({
      grid: grid.map(row => row.map(cell => ({ ...cell }))),
      description: "Starting Dijkstra's Algorithm from green cell (distance 0)",
    });

    const unvisitedNodes: Cell[] = []; // This will act as our Priority Queue
    const parent = new Map<string, Cell>();
    
    const startCell = grid[START.row][START.col];
    startCell.distance = 0;
    
    // Add all nodes to our "priority queue"
    for (const row of grid) {
      for (const cell of row) {
        unvisitedNodes.push(cell);
      }
    }
    
    let nodesCount = 0;
    let found = false;

    const getNeighbors = (cell: Cell): Cell[] => {
      const neighbors: Cell[] = [];
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // up, down, left, right
      ];

      for (const [dr, dc] of directions) {
        const newRow = cell.row + dr;
        const newCol = cell.col + dc;

        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS
        ) {
          neighbors.push(grid[newRow][newCol]);
        }
      }
      return neighbors;
    };

    while (unvisitedNodes.length > 0) {
      // Sort nodes by distance to simulate a priority queue
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      
      const current = unvisitedNodes.shift()!; // Get node with smallest distance

      // If closest node is Infinity, we're trapped
      if (current.distance === Infinity) {
        found = false;
        break;
      }
      
      // If it's a wall, skip it
      if (current.isWall) continue;

      // Mark as algorithm-visited so we don't check it again
      current.isVisited = true; 
      nodesCount++;

      // Create a step for visualization
      if (!current.isStart && !current.isEnd) {
         // This push/pop logic creates the "flashing" effect
         const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
         gridCopy[current.row][current.col].isVisited = true; // Use isVisited for viz
         
         newSteps.push({
           grid: gridCopy,
           description: `Visiting cell (${current.row}, ${current.col}) - Distance: ${current.distance}`,
         });
      }
      
      if (current.isEnd) {
        found = true;
        
        // Reconstruct path
        const pathCells: Cell[] = [];
        let pathCell: Cell | undefined = current;
        while (pathCell) {
          pathCells.push(pathCell);
          const key = `${pathCell.row},${pathCell.col}`;
          pathCell = parent.get(key);
        }
        pathCells.reverse(); // Show path from start to end

        // Create steps for path visualization
        const pathGrid = grid.map(row => row.map(cell => ({ ...cell, isVisited: true }))); // Show all visited
        for (const cell of pathCells) {
            pathGrid[cell.row][cell.col].isPath = true;
            newSteps.push({
                grid: pathGrid.map(r => r.map(c => ({...c}))),
                description: `Building path...`
            });
        }
        
        newSteps.push({
          grid: pathGrid,
          description: `Path found! Total distance: ${current.distance}`,
        });
        break;
      }

      const neighbors = getNeighbors(current);
      
      for (const neighbor of neighbors) {
        // Check if neighbor is *algorithm* visited
        if (!neighbor.isVisited) { 
          // In this grid, all weights are 1
          const newDist = current.distance + 1;
          
          if (newDist < neighbor.distance) {
            // Found a shorter path to this neighbor
            neighbor.distance = newDist;
            parent.set(`${neighbor.row},${neighbor.col}`, current);
          }
        }
      }
    }

    if (!found) {
      newSteps.push({
        grid: grid.map(row => row.map(cell => ({ ...cell, isVisited: true }))),
        description: 'No path found!',
      });
    }

    setNodesVisited(nodesCount - 1); // -1 to not count the start node
    return newSteps;
  }, []);

  // Reset logic remains the same
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newGrid = createGrid();
    setGrid(newGrid);
    const newSteps = generateSteps(newGrid);
    setSteps(newSteps);
    toast.success('Reset complete');
  }, [createGrid, generateSteps]);

  // useEffect for initialization remains the same
  useEffect(() => {
    reset();
  }, [reset]); // Re-run if reset changes

  // useEffect for player logic remains the same
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      toast.success("Dijkstra's complete!");
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 510 - speed); // Invert speed so high values are fast

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  // handlePlayPause logic remains the same
  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      reset();
      return; // Start reset from step 0
    }
    setIsPlaying(!isPlaying);
  };

  const currentStepData = steps[currentStep] || { grid: grid, description: 'Loading...' };
  
  return (
    // Added Toaster for notifications
    <div className="space-y-6 p-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" richColors /> 
      
      <div className="rounded-lg border bg-card dark:bg-gray-900 p-4">
        <p className="mb-4 text-center text-sm text-muted-foreground dark:text-gray-400">
          {currentStepData.description}
        </p>
        <div className="mb-4 flex flex-wrap justify-center gap-4 text-xs">
          {/* Legend remains the same */}
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
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
            <span>Empty</span>
          </div>
        </div>
        
        <GridVisualizer 
          grid={currentStepData.grid} 
          cellSize={20} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            speed={speed}
            arraySize={20} // This prop seems unused, keeping for consistency
            currentStep={currentStep}
            totalSteps={steps.length}
            onPlayPause={handlePlayPause}
            onReset={reset}
            onStepBack={() => setCurrentStep(Math.max(0, currentStep - 1))}
            onStepForward={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            onSpeedChange={(value) => setSpeed(value[0])}
            onArraySizeChange={() => {}} // Unused, but prop is passed
          />

          <CodeViewer
            pseudocode={[
              'create unvisited set (priority queue) with all nodes',
              'set distance to 0 for start, ∞ for all others',
              'while unvisited set is not empty:',
              '  node = node with smallest distance',
              '  mark node as visited',
              '  if node is end: STOP',
              '  for each neighbor of node:',
              '    if neighbor is not visited:',
              '      new_dist = node.distance + 1',
              '      if new_dist < neighbor.distance:',
              '        neighbor.distance = new_dist',
            ]}
          />
        </div>

        <div>
          <StatsPanel
            comparisons={0} // "Comparisons" is less relevant here
            // Renaming "swaps" to "Nodes Visited" for clarity
            swapLabel="Nodes Visited" 
            swaps={nodesVisited}
            // Time complexity with an array-based P-Queue is O(V^2)
            // With a min-heap P-Queue, it's O((V + E) log V)
            timeComplexity="O(V^2)" 
            spaceComplexity="O(V)"
          />
        </div>
      </div>
    </div>
  );
};

// Default export
export default Dijkstra;

