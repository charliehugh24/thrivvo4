import { toast as showToast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';

type ToastFunction = {
  (props: {
    title?: string;
    description?: string;
    action?: ToastActionElement;
    variant?: 'default' | 'destructive';
  }): void;
};

export function useToast(): { toast: ToastFunction } {
  return { toast: showToast };
} 