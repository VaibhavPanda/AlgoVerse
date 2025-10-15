import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, GitCompare, Timer } from 'lucide-react';

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export const StatsPanel = ({
  comparisons,
  swaps,
  timeComplexity,
  spaceComplexity,
}: StatsPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitCompare className="h-4 w-4" />
              Comparisons
            </div>
            <div className="text-2xl font-bold">{comparisons}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitCompare className="h-4 w-4" />
              Swaps
            </div>
            <div className="text-2xl font-bold">{swaps}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              Time
            </div>
            <div className="text-lg font-semibold">{timeComplexity}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              Space
            </div>
            <div className="text-lg font-semibold">{spaceComplexity}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
