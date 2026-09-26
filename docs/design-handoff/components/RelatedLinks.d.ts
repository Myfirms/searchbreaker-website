import type { Availability, SectionTone } from './types';
export interface RelatedLink { label: string; href: string; blurb?: string; kind?: 'next' | 'related' | 'guide'; availability?: Availability; }
export interface RelatedLinksProps { heading?: string; items: RelatedLink[]; tone?: SectionTone; }
// Only published targets. Put the "next" workflow stage first.
