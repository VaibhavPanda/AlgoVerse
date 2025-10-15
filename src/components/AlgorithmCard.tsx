import { Algorithm } from '@/types/algorithm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, HardDrive, Play } from 'lucide-react';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onVisualize: (algorithm: Algorithm) => void;
}

export const AlgorithmCard = ({ algorithm, onVisualize }: AlgorithmCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="group-hover:text-primary transition-colors">
              {algorithm.name}
            </CardTitle>
            <CardDescription className="mt-2">{algorithm.description}</CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {algorithm.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{algorithm.timeComplexity}</span>
            </div>
            <div className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              <span>{algorithm.spaceComplexity}</span>
            </div>
          </div>

          <Button
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
            variant="outline"
            onClick={() => onVisualize(algorithm)}
          >
            <Play className="mr-2 h-4 w-4" />
            Visualize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
