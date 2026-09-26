import type { SectionTone } from './types';
export interface DiffSegment { text: string; kind?: 'added' | 'removed'; }
export interface Provenance { source: string; fact: string; confirmedOn?: string; }
export type DiffState = 'proposed' | 'editing' | 'accepted' | 'edited' | 'rejected';
export interface BeforeAfterDiffProps {
  heading: string; lead?: string; frameLabel?: string;
  requirement: string;
  before: DiffSegment[];            // 'removed' segments render as <del>
  after: DiffSegment[];             // 'added' segments render as <ins>
  provenance: Provenance;           // required: every edit must cite a profile fact
  resumeVersion?: string;
  state?: DiffState;                // initial state
  tone?: SectionTone;
}
// Always labeled Illustrative on marketing pages. JS island: yes (accept/edit/reject/undo).
