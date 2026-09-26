import type { SectionTone } from './types';
export interface AudienceItem { title: string; text: string; caveat?: string; }
export interface AudienceCardsProps { heading: string; lead?: string; items: AudienceItem[]; caveatLabel?: string; tone?: SectionTone; }
