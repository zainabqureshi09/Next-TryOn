"use client";

/**
 * Utility to detect WebGL support in the browser
 */
export const isWebGLAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    // Try to create a WebGL context
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl');
    
    return !!gl;
  } catch (e) {
    console.error('WebGL detection error:', e);
    return false;
  }
};

/**
 * Get detailed information about WebGL support
 */
export const getWebGLInfo = () => {
  if (typeof window === 'undefined') {
    return { supported: false, renderer: null, vendor: null };
  }
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, renderer: null, vendor: null };
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    if (!debugInfo) {
      return { 
        supported: true, 
        renderer: 'Unknown', 
        vendor: 'Unknown' 
      };
    }
    
    return {
      supported: true,
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    };
  } catch (e) {
    console.error('WebGL info error:', e);
    return { supported: false, renderer: null, vendor: null };
  }
};