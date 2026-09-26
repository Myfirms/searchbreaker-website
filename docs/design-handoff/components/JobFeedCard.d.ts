export interface Job { title: string; company: string; location: string; workMode: string; postedAt: string; source: string; url?: string; matches: string[]; missing: string[]; }
export type JobCardState = 'default' | 'saved' | 'skipped';
export interface JobFeedCardProps { job: Job; state?: JobCardState; illustrative?: boolean; onChange?: (s: JobCardState) => void; }
// Use in a vertical list (gap var(--space-3)). Skipped collapses to one line with Undo.
