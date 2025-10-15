import { Algorithm } from '@/types/algorithm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { BubbleSort } from './sorting/BubbleSort';
import { SelectionSort } from './sorting/SelectionSort';
import { InsertionSort } from './sorting/InsertionSort';
import { MergeSort } from './sorting/MergeSort';
import { QuickSort } from './sorting/QuickSort';
import { HeapSort } from './sorting/HeapSort';
import { BFS } from './graph/BFS';
import { DFS } from './graph/DFS';
import { Fibonacci } from './recursion/Fibonacci';
import { BinarySearch } from './recursion/BinarySearch';
import { SieveOfEratosthenes } from './math/SieveOfEratosthenes';
import { Badge } from './ui/badge';

interface VisualizerModalProps {
  algorithm: Algorithm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VisualizerModal = ({
  algorithm,
  open,
  onOpenChange,
}: VisualizerModalProps) => {
  if (!algorithm) return null;

  const renderVisualizer = () => {
    switch (algorithm.id) {
      // Sorting Algorithms
      case 'bubble-sort':
        return <BubbleSort />;
      case 'selection-sort':
        return <SelectionSort />;
      case 'insertion-sort':
        return <InsertionSort />;
      case 'merge-sort':
        return <MergeSort />;
      case 'quick-sort':
        return <QuickSort />;
      case 'heap-sort':
        return <HeapSort />;
      
      // Graph Algorithms
      case 'bfs':
        return <BFS />;
      case 'dfs':
        return <DFS />;
      
      // Recursion Algorithms
      case 'fibonacci':
        return <Fibonacci />;
      case 'binary-search':
        return <BinarySearch />;
      
      // Mathematical Algorithms
      case 'sieve':
        return <SieveOfEratosthenes />;
      
      // Coming Soon
      default:
        return (
          <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/50">
            <div className="text-center">
              <p className="text-lg font-medium">Visualizer Coming Soon!</p>
              <p className="text-sm text-muted-foreground mt-2">
                This algorithm visualization is under development
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{algorithm.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {algorithm.description}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {algorithm.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4">{renderVisualizer()}</div>
      </DialogContent>
    </Dialog>
  );
};
