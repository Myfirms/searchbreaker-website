import type { Availability, IconName, SectionTone } from './types';
export interface FeatureItem { title: string; text: string; icon?: IconName; availability?: Availability; href?: string; linkLabel?: string; }
export interface FeatureGridProps { heading: string; lead?: string; eyebrow?: string; items: FeatureItem[]; columns?: 2 | 3 | 4; tone?: SectionTone; }
// Columns set the minimum card width (data-columns); the grid reflows with auto-fit.
