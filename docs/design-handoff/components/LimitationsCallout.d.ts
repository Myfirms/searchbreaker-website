import type { SectionTone } from './types';
export interface LimitationsCalloutProps { heading: string; eyebrow?: string; lead?: string; items: { title: string; text: string }[]; footnote?: string; tone?: SectionTone; }
// Same heading tier (H2) and section padding as benefit sections. Never collapse or shrink it.
