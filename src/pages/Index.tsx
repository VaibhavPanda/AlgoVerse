import { useState } from 'react';
import { Algorithm } from '@/types/algorithm';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AlgorithmCategories } from '@/components/AlgorithmCategories';
import { VisualizerModal } from '@/components/VisualizerModal';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAlgorithm = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AlgorithmCategories onSelectAlgorithm={handleSelectAlgorithm} />
      </main>
      <Footer />

      <VisualizerModal
        algorithm={selectedAlgorithm}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default Index;
