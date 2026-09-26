import type { Availability, CtaConfig } from './types';
export interface NavChild { label: string; href: string; description: string; availability: Availability; }
export interface NavItem { label: string; href?: string; children?: NavChild[]; }
export interface HeaderProps {
  navItems: NavItem[];             // max 1 item with children ("Product")
  cta: CtaConfig;
  current?: string;                // current path, drives aria-current + indicator
  logoHref?: string;
  panelIntro?: string;
  onCta?: () => void;              // waitlist mode: open WaitlistDialog
  /** preview only */ initialOpen?: 'none' | 'product' | 'drawer' | 'drawer-product';
  /** preview only */ drawerHeight?: string;
}
// JS island: yes (dropdown, drawer). Collapses to burger below 900px.
