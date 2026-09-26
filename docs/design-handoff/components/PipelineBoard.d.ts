import type { SectionTone } from './types';
export interface PipelineColumn { id: string; title: string; }
export interface PipelineCard { id: string | number; column: string; title: string; company: string; resumeVersion: string; nextAction: string; updated: string; }
export interface PipelineBoardProps { heading: string; lead?: string; frameLabel?: string; columns: PipelineColumn[]; cards: PipelineCard[]; view?: 'kanban' | 'table'; tone?: SectionTone; }
// JS island: yes (view toggle, aria-pressed). Board scrolls horizontally with snap on mobile; table stacks below 768px.
