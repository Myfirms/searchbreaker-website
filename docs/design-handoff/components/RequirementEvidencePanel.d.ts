import type { EvidenceStatus, SectionTone } from './types';
export interface EvidenceRow { requirement: string; evidence: string; status: EvidenceStatus; note?: string; }
export interface RequirementEvidencePanelProps { heading: string; lead?: string; frameLabel?: string; rows: EvidenceRow[]; footnote?: string; tone?: SectionTone; }
// Table (role=table) ≥768px container width; stacked list below. No numeric score.
