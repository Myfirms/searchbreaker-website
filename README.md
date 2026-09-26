# SearchBreaker website

Marketing site for SearchBreaker (searchbreaker.com). Astro (static) + TypeScript strict, React only for interactive islands, plain CSS with custom properties. Hosted on AWS Amplify; server-side calls go through AWS Lambda.

Design source: `docs/design-handoff/` (Claude Design export; `HANDOFF.md` is the developer handoff, `components/*.d.ts` are the prop contracts). Design tokens live in `src/styles/` and are the single source of truth for color, type, space, radius, shadow and state.

## Commands (Node 24, see `.node-version`)

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run check` | Astro/TypeScript check |
| `npm run build` | Build to `dist/` |

## Structure

```
src/styles/            global.css (entry), fonts.css, tokens/ (primitives → semantic → components)
src/components/astro/  primitives/ (Button, AvailabilityBadge, StatusChip, Icon), blocks/ (one block = one component)
src/components/react/  interactive islands only (Header menu, WaitlistDialog/Form, PipelineBoard toggle)
src/layouts/           BaseLayout (noindex gate)
src/lib/types.ts       shared block types (from the handoff)
src/pages/             routes; internal/foundation.astro is a noindex token/primitive preview
public/brand/          logos (outlined SVG), favicon
public/fonts/          Geist + Geist Mono woff2 (SIL OFL, self-hosted)
docs/                  design handoff and decisions
```

## Rules

- Never hard-code a color, size, space, radius or breakpoint; use tokens. Breakpoints: 480, 640, 768, 900, 1200, 1440 only.
- Pages are compositions of blocks. Every non-live feature or visual carries an `AvailabilityBadge`; example data is labeled Illustrative; no fabricated proof (logos, testimonials, ratings, stats, pricing, case studies).
- CTAs use `Button` with `readiness`. The launch default is `waitlist` ("Join the waitlist").
- The site is noindex everywhere until `PUBLIC_LAUNCHED=true` is set in the deploy environment.
- Secrets (`GEMINI_API_KEY`, etc.) live only in a local `.env` (gitignored), never in the browser bundle.
