"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "./button";

interface DownloadButtonProps {
  onClick?: () => void;
  label?: string;
}

export function DownloadButton({ 
  onClick, 
  label = "Download Prototype" 
}: DownloadButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scaleIn">
      <Button
        onClick={onClick}
        variant="gradient"
        className="shadow-lg rounded-full px-6 py-6 h-auto group"
        animation="pulse"
      >
        <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
        <span>{label}</span>
      </Button>
    </div>
  );
}