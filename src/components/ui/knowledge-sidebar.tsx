"use client";

import * as React from "react";
import { ChevronRight, ChevronLeft, HelpCircle, BookOpen, Info } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface KnowledgeSidebarProps {
  defaultOpen?: boolean;
}

export function KnowledgeSidebar({ defaultOpen = false }: KnowledgeSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`fixed right-0 top-1/4 z-40 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-2.5rem)]'}`}>
      <Card className="h-[500px] w-[320px] shadow-lg border-l-0 rounded-l-xl rounded-r-none">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -left-10 top-4 h-10 w-10 rounded-full bg-card shadow-md border"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Knowledge Base</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 overflow-auto h-[calc(500px-4rem)]">
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              About Virtual Try-On
            </h3>
            <p className="text-sm text-muted-foreground">
              Our virtual try-on technology uses advanced face detection to accurately place eyewear on your face. The system tracks facial landmarks to ensure proper positioning.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-2">
              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="text-sm font-medium">How accurate is the try-on?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Our system provides a realistic approximation of how frames will look on your face, but slight variations may occur with actual products.
                </p>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="text-sm font-medium">Can I try prescription lenses?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  The virtual try-on shows frame styles only. Prescription lenses can be added during the checkout process.
                </p>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="text-sm font-medium">Is my face data stored?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  No, all face detection happens locally in your browser. No images or facial data are stored or transmitted.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              View Full Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}