import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  activeColorway: string;
  stickyBarVisible: boolean;
  
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setActiveColorway: (colorway: string) => void;
  setStickyBarVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  activeColorway: 'classic-black',
  stickyBarVisible: false,
  
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setActiveColorway: (colorway) => set({ activeColorway: colorway }),
  setStickyBarVisible: (visible) => set({ stickyBarVisible: visible }),
}));