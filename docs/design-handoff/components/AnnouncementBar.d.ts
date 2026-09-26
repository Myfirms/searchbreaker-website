import type { Availability } from './types';
export interface AnnouncementBarProps { text: string; href?: string; linkLabel?: string; badge?: Availability | 'none'; dismissible?: boolean; onActivate?: () => void; onDismiss?: () => void; }
// Optional; off by default on pages. Dismissal persists per session in production.
