import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Code2 } from 'lucide-react';

interface CodeViewerProps {
  pseudocode: string[];
  currentLine?: number;
}

export const CodeViewer = ({ pseudocode, currentLine = -1 }: CodeViewerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code2 className="h-5 w-5" />
          Pseudocode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 rounded-lg bg-muted p-4 font-mono text-sm">
          {pseudocode.map((line, index) => (
            <div
              key={index}
              className={`transition-colors ${
                currentLine === index
                  ? 'bg-primary/20 text-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="mr-4 inline-block w-6 text-right opacity-50">
                {index + 1}
              </span>
              {line}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
