import { useState } from 'react';
import { Algorithm } from '@/types/algorithm';
import { algorithms } from '@/lib/algorithms';
import { AlgorithmCard } from './AlgorithmCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart3,
  Network,
  GitBranch,
  Calculator,
  Boxes,
} from 'lucide-react';

interface AlgorithmCategoriesProps {
  onSelectAlgorithm: (algorithm: Algorithm) => void;
}

const categoryIcons = {
  sorting: BarChart3,
  graph: Network,
  recursion: GitBranch,
  math: Calculator,
  other: Boxes,
};

export const AlgorithmCategories = ({ onSelectAlgorithm }: AlgorithmCategoriesProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('sorting');

  const categories = [
    { value: 'sorting', label: 'Sorting', count: algorithms.filter(a => a.category === 'sorting').length },
    { value: 'graph', label: 'Graph Search', count: algorithms.filter(a => a.category === 'graph').length },
    { value: 'recursion', label: 'Recursion', count: algorithms.filter(a => a.category === 'recursion').length },
    { value: 'math', label: 'Mathematical', count: algorithms.filter(a => a.category === 'math').length },
  ];

  return (
    <section id="algorithms" className="py-16">
      <div className="container">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-4xl font-bold">Explore Algorithms</h2>
          <p className="text-lg text-muted-foreground">
            Choose an algorithm category to start visualizing
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1 gap-1">
            {categories.map((category) => {
              const Icon = categoryIcons[category.value as keyof typeof categoryIcons];
              return (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  <span className="ml-auto rounded-full bg-background/20 px-2 py-0.5 text-xs">
                    {category.count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category.value}
              value={category.value}
              className="animate-fade-in"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {algorithms
                  .filter((algo) => algo.category === category.value)
                  .map((algorithm) => (
                    <AlgorithmCard
                      key={algorithm.id}
                      algorithm={algorithm}
                      onVisualize={onSelectAlgorithm}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
