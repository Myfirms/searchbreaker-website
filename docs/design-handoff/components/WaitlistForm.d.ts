import type { WaitlistStatus, WaitlistPayload } from './types';
export interface WaitlistFormProps {
  source: string;                  // e.g. 'home-hero', 'resume-tailoring-final-cta'
  consentText?: string;
  privacyHref?: string;
  showRole?: boolean;              // default true, optional field
  roleOptions?: string[];
  onSubmit?: (p: WaitlistPayload) => Promise<'success' | 'duplicate' | 'error'>;
  onResult?: (r: 'success' | 'duplicate' | 'error', p: WaitlistPayload) => void;
  /** preview only */ initialStatus?: WaitlistStatus;
}
// States: idle, invalid (email/consent), submitting, error (server, form kept), success, duplicate.
