import type { Availability, SectionTone } from './types';
export interface WorkflowNode { label: string; href?: string; availability: Availability; text?: string; }
export interface WorkflowDiagramProps { heading: string; lead?: string; nodes: WorkflowNode[]; note?: string; tone?: SectionTone; }
// href only for published pages. Horizontal ≥1000px container width, vertical below.
