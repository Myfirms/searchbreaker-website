import type { SectionTone } from './types';
export interface IssueFixExampleProps { heading: string; lead?: string; frameLabel?: string; items: { issue: string; why: string; fix: string }[]; tone?: SectionTone; }
