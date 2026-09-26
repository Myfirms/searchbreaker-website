import type { ApplicationStatus, SectionTone } from './types';
export interface StatusStateItem { id: ApplicationStatus; label?: string; description: string; }
export interface StatusStatesProps { heading: string; lead?: string; states: StatusStateItem[]; tone?: SectionTone; }
