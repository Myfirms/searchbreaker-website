import type { IconName, SectionTone } from './types';
export interface ControlPoint { title: string; text: string; icon?: IconName; }
export interface ControlPointsProps { heading: string; lead?: string; eyebrow?: string; points: ControlPoint[]; tone?: SectionTone; }
