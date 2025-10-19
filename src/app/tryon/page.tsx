'use client'

import dynamicImport from 'next/dynamic';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Dynamic import to avoid SSR issues with Three.js components
const VirtualTryOn = dynamicImport(() => import('@/components/VirtualTryOn').then(mod => ({ default: mod.VirtualTryOn })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-foreground font-medium">Loading Virtual Try-On...</p>
      </div>
    </div>
  )
});

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <VirtualTryOn />
    </div>
  );
};

export default Index;
