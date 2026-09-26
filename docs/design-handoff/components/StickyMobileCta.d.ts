import type { Readiness } from './types';
export interface StickyMobileCtaProps { readiness: Readiness; label?: string; href?: string; text?: string; position?: 'fixed' | 'static'; onActivate?: () => void; }
// Render only below 900px (CSS media query in production). Pages using it add bottom padding equal to its height.
