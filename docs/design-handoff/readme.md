# SearchBreaker design system

Design system and marketing-site blocks for SearchBreaker, an AI job-search workspace in private testing. The personality is calm, precise and in control: a well-run workspace, not AI magic.

## Content fundamentals
- Second person for the user, "we" for the company. Short declarative sentences, answer first.
- CTAs are concrete actions: "Join the waitlist", "See how tailoring works". Never "Learn more", "Get started" or "Unlock".
- No superlatives, wordplay, emoji or outcome promises (interviews, ATS pass, offers).
- Availability is always shown: Live, Preview, Concept, Planned. Example data is fictional and labeled Illustrative.
- No fabricated proof: no logos, testimonials, ratings, stats, pricing or case studies.
- Limitations get the same weight as benefits.

## Visual foundations
- Direction 2a: precise control-panel structure on quiet, open ground.
- Geist + Geist Mono. Mono only for states, dates, versions and sources.
- Palette: white and mist surfaces, pine ink text, deep teal `#0B5E6B` as the single accent, mint tint for accent surfaces. Semantic green, amber and red.
- Small corners (2 / 4 / 6 / 8), 1px borders, shadows only on floating layers.
- Light theme primary; complete dark token set; `data-surface="dark"` for dark sections.

## Structure
- `styles.css`, `tokens/`: CSS custom properties (primitive → semantic → component)
- `guidelines/Foundations.dc.html`: specimen cards
- `components/`: one block per `.dc.html` with `.d.ts` and `.prompt.md`; catalogs in `Library*.dc.html`; reference pages in `Page *.dc.html`
- `assets/logo/`: logos and favicon
- `design_handoff_landing_pages/README.md`: developer handoff
