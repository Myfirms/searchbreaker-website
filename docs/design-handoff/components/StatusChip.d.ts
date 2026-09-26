import type { EvidenceStatus, ApplicationStatus } from './types';
export interface StatusChipProps { status: EvidenceStatus | ApplicationStatus; label?: string; }
// Icon + text always. Tokens: data-status → --st-fg / --st-bg.
