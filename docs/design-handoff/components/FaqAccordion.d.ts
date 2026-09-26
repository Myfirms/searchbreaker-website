import type { SectionTone } from './types';
export interface FaqAccordionProps { heading: string; lead?: string; faqs: { q: string; a: string }[]; defaultOpen?: number | null; tone?: SectionTone; }
// Native <details>/<summary>. Emit FAQPage JSON-LD from the same faqs array (visible Q&A only).
