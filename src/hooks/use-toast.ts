"use client";

import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function useToast() {
  const toast = {
    success: (title: string, options?: ToastOptions) => {
      sonnerToast.success(title, {
        description: options?.description,
        action:
          options?.actionLabel && options?.onAction
            ? {
                label: options.actionLabel,
                onClick: options.onAction,
              }
            : undefined,
      } as any); // 👈 cast so TS stops complaining
    },

    error: (title: string, options?: ToastOptions) => {
      sonnerToast.error(title, {
        description: options?.description,
      } as any);
    },

    info: (title: string, options?: ToastOptions) => {
      sonnerToast(title, {
        description: options?.description,
      } as any);
    },
  };

  return { toast };
}
