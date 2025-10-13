"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-md mx-4 overflow-hidden shadow-xl animate-scaleIn" gradient>
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl">Welcome to Virtual Try-On</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Usage Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This virtual try-on experience uses your device&apos;s camera to simulate eyewear on your face. 
              All processing happens locally on your device - no images are stored or transmitted.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Enable Camera Access</h4>
                <p className="text-sm text-muted-foreground">Allow camera permissions when prompted</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Try On Frames</h4>
                <p className="text-sm text-muted-foreground">Select from our collection to see how they look</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Save or Purchase</h4>
                <p className="text-sm text-muted-foreground">Download images or add frames to your cart</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="gradient" 
            onClick={onClose}
            animation="fadeIn"
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}