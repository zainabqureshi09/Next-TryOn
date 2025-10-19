import { extend } from '@react-three/fiber'
import { AmbientLight, DirectionalLight } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
    }
  }
}

// Extend the fiber catalog with three.js objects
extend({ AmbientLight, DirectionalLight })