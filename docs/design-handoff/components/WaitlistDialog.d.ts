import type { WaitlistStatus, WaitlistPayload } from './types';
export interface WaitlistDialogProps {
  open: boolean;
  onClose: () => void;
  source: string;
  title?: string; text?: string; consentText?: string; showRole?: boolean;
  onSubmit?: (p: WaitlistPayload) => Promise<'success' | 'duplicate' | 'error'>;
  variant?: 'dialog';              // bottom sheet is automatic below 640px
  /** preview only */ layout?: 'fixed' | 'contained';
  /** preview only */ initialStatus?: WaitlistStatus;
}
// JS island: yes. role=dialog, aria-modal, focus trap, Esc + backdrop close, focus returns to trigger.
