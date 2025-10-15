import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const HeroSection = () => {
  const scrollToAlgorithms = () => {
    document.getElementById('algorithms')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Interactive Learning Platform</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            Visualize
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Algorithms</span>
            <br />
            Master Concepts
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Interactive algorithm visualizations for sorting, graph traversal, recursion, and more.
            Learn by seeing algorithms come to life with step-by-step animations.
          </p>

          <Button
            size="lg"
            className="rounded-full px-8 animate-pulse-glow"
            onClick={scrollToAlgorithms}
          >
            Explore Algorithms
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Animated decoration */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>
    </section>
  );
};
