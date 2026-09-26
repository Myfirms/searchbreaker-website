export interface AuthorReviewedProps { author?: string; updated: string; reviewer?: { name: string; role?: string }; reviewedOn?: string; policyHref?: string; policyLabel?: string; }
// Real people only. No avatars, invented credentials or personas. Omit reviewer if none.
