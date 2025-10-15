import { Github, Mail, Code2 } from 'lucide-react';
import { Button } from './ui/button';

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Sortify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive algorithm visualizer for learning and understanding computer science concepts.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#algorithms" className="hover:text-foreground transition-colors">
                  Algorithms
                </a>
              </li>
              <li>
                <a href="https://github.com/vaibhavpanda/sortify" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/vaibhavpanda/sortify" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Connect</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <a href="https://github.com/vaibhavpanda/sortify" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="mailto:contact@sortify.dev">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sortify. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};
