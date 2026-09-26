import type { Availability, SectionTone } from './types';
export interface WorkflowStep { title: string; text: string; availability?: Availability; }
export interface WorkflowStepsProps { heading: string; lead?: string; eyebrow?: string; steps: WorkflowStep[]; tone?: SectionTone; }
// 3–6 steps. Numbers are generated. Titles are H3.
