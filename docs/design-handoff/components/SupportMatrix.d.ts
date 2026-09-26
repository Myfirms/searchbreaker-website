import type { SectionTone } from './types';
export interface SupportRow { name: string; scope: string; status: 'verified' | 'partial'; verifiedOn: string; note?: string; }
export interface SupportMatrixProps {
  heading: string; lead?: string; nameLabel?: string;   // "Platform", "Source"
  rows: SupportRow[];               // rows without verifiedOn are dropped
  lastReviewed: string;
  emptyTitle?: string; emptyText?: string; emptyLinkLabel?: string; emptyHref?: string;
  footnote?: string; illustrative?: boolean; tone?: SectionTone;
}
// Empty rows → designed "Not yet tested" state. Launch default is the empty state.
