import type { SectionTone } from './types';
export interface ComparisonColumn { key: string; label: string; }
export type ComparisonValue = string | { text: string; mark?: 'yes' | 'no' | 'partial' };
export interface ComparisonRow { label: string; values: Record<string, ComparisonValue>; emphasis?: boolean; }
export interface ComparisonTableProps { heading: string; lead?: string; columns: ComparisonColumn[]; rows: ComparisonRow[]; caption?: string; tone?: SectionTone; }
// 2–4 columns. Grid table ≥768px container width; below, one stacked card per column. emphasis highlights the key row (e.g. "Who presses submit"). No JS needed unless it scrolls.
