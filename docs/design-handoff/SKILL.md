# Using the SearchBreaker design system

1. Load `styles.css`. Never hard-code a color, size, space, radius or breakpoint; use tokens.
2. Build pages only from blocks in `components/`. Read the block's `.prompt.md` for when to use it and its content limits, and its `.d.ts` for props.
3. Every CTA uses Button with `readiness`. Launch default is `waitlist`, which opens WaitlistDialog with a `source`.
4. Every feature, visual or workflow node that isn't live gets an AvailabilityBadge. Product visuals go in ProductShot with the correct state. Example data is always `illustrative`.
5. Features that involve AI output or submission need ControlPoints. Any score or integration needs a LimitationsCallout.
6. Alternate section tones (`default` / `muted`) for rhythm. Use FinalCta on the dark surface at page end.
7. Copy rules: answer-first, second person, concrete CTAs, no superlatives or outcome promises, no emoji.
8. Breakpoints: 480, 640, 768, 900, 1200, 1440 only.
9. Do not add proof blocks (logos, testimonials, stats, pricing). If a section could hold them, leave it out.
