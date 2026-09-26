import type { Availability, CtaConfig } from './types';
export interface InlineCtaProps { eyebrow?: string; title: string; text: string; href: string; linkLabel: string; availability: Availability; cta: CtaConfig; onCta?: () => void; }
// Links to ONE canonical product page. Waitlist mode adds a secondary "Join the waitlist" link; live mode adds a primary CTA.
