import type { Availability } from './types';
export interface AvailabilityBadgeProps {
  state: Availability | 'illustrative';
  variant?: 'filled' | 'outline';   // outline for use on busy surfaces or with detail text
  label?: string;                   // override default label
  detail?: string;                  // appended after " · ", e.g. "verified on 2026-09-14"
}
// Each state has a distinct icon shape; meaning never depends on color alone. Screen readers hear "Availability: <label>".
