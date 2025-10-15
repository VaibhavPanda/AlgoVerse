export type AlgorithmCategory = 'sorting' | 'graph' | 'recursion' | 'math' | 'other';

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
}

export interface VisualizationStep {
  array?: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  active?: number[];
  description: string;
}

export interface ControlState {
  isPlaying: boolean;
  speed: number;
  arraySize: number;
  currentStep: number;
  totalSteps: number;
}
