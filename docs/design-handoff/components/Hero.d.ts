import type { BadgeConfig, CtaConfig, LinkCta, SectionTone } from './types';
import type { ProductShotProps } from './ProductShot';
export interface HeroProps {
  variant: 'home' | 'feature';     // home → --display-home, feature → --display-page
  headline: string;                // H1, ≤ 12 words
  lead: string;                    // answer-first, ≤ 40 words
  primaryCta: CtaConfig;
  secondaryCta?: LinkCta;          // concrete action, e.g. "See how tailoring works"
  badge?: BadgeConfig;
  media?: ProductShotProps;        // omit for text-only hero
  reassurance?: string;
  tone?: SectionTone;              // default 'muted'
  onCta?: () => void;
}
