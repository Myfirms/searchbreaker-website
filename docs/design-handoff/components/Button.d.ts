import type { Readiness } from './types';
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';   // default 'primary'
  size?: 'sm' | 'md' | 'lg';                              // default 'md'; sm is desktop-only
  /** When set, label is resolved: waitlist → "Join the waitlist", live → label ?? "Start profile" */
  readiness?: Readiness;
  label?: string;
  href?: string;            // renders <a>; omitted → <button>
  type?: 'button' | 'submit';
  loading?: boolean;        // aria-busy, blocks clicks, keeps width
  loadingLabel?: string;
  disabled?: boolean;       // aria-disabled, not focus-removed
  fullWidth?: boolean;
  arrow?: boolean;          // trailing arrow-right icon
  ariaLabel?: string;
  onActivate?: (e: MouseEvent) => void;
}
// States: default, hover, active, focus-visible, loading, disabled. Tokens: --button-*, data-variant / data-size.
