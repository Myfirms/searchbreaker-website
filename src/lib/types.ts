/** Shared SearchBreaker block types. */
export type Availability = 'live' | 'preview' | 'concept' | 'planned';
export type Readiness = 'waitlist' | 'live';
export type SectionTone = 'default' | 'muted' | 'accent';
export type IconName = 'search' | 'check' | 'check-circle' | 'arrow-right' | 'arrow-left' | 'chevron-down' | 'chevron-up' | 'chevron-right' | 'menu' | 'close' | 'info' | 'alert' | 'lock' | 'file' | 'calendar' | 'external' | 'edit' | 'eye' | 'pause' | 'skip' | 'send' | 'user-check' | 'shield' | 'plus' | 'minus';
/** Readiness-aware CTA. 'waitlist' always renders "Join the waitlist" and opens WaitlistDialog. */
export interface CtaConfig { readiness: Readiness; /** used only when readiness = 'live' (default "Start profile") */ label?: string; href?: string; }
export interface LinkCta { label: string; href: string; }
export interface LinkItem { label: string; href: string; }
export interface BadgeConfig { state: Availability; label?: string; detail?: string; }
export type WaitlistStatus = 'idle' | 'invalid' | 'submitting' | 'error' | 'success' | 'duplicate';
export interface WaitlistPayload { email: string; role: string | null; consent: true; source: string; /** Honeypot: must stay empty. */ hp?: string; }
export type EvidenceStatus = 'confirmed' | 'partial' | 'gap' | 'unclear';
export type ApplicationStatus = 'prepared' | 'reviewed' | 'submitted' | 'failed';
export interface ArticleMeta { updated?: string; reviewed?: string; readingTime?: string; }
