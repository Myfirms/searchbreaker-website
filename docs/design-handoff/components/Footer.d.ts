import type { LinkItem } from './types';
export interface FooterColumn { title: string; links: LinkItem[]; }
export interface FooterProps { columns: FooterColumn[]; legalLinks?: LinkItem[]; statusNote?: string; copyright?: string; tone?: 'default' | 'muted'; }
// Static. No social proof, no social icons unless accounts exist.
