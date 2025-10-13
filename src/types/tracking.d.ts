// types/tracking.d.ts
declare module 'tracking' {
  export class ObjectTracker {
    constructor(type: string);
    setInitialScale(value: number): void;
    setStepSize(value: number): void;
    setEdgesDensity(value: number): void;
    on(event: string, callback: (event: any) => void): void;
  }
  
  export function track(selector: string, tracker: ObjectTracker, options: any): void;
}