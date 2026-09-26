import type { CtaConfig, LinkCta, SectionTone } from './types';
export interface FinalCtaProps { heading: string; text?: string; cta: CtaConfig; secondaryCta?: LinkCta; reassurance?: string; surface?: 'dark' | 'light'; tone?: SectionTone; onCta?: () => void; }
