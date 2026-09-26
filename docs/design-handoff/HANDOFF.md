# Handoff: SearchBreaker marketing site (Phase 0)

## Overview
SearchBreaker is an end-to-end AI job-search workspace that is not yet released. This bundle contains the approved brand direction (2a), the token-based design system, the 37-block library and three reference page templates for a static marketing site. Every visual supports the honesty rules in the brief: availability states, readiness-aware CTAs, labeled product visuals, no fabricated proof and limitations presented as content.

## About the design files
The files here are **design references built in HTML**, not production code. They show the intended look, content structure and behavior. Rebuild them in the target stack: **Astro** (static, TypeScript), React only for interactive islands, plain CSS with custom properties, no Tailwind, no CSS-in-JS.

`styles.css` and `tokens/*.css` are the exception: they are plain CSS and **can be copied into the Astro project as-is**. They are the single source of truth for every color, size, space, radius, shadow and state.

The `.dc.html` files use a small in-house runtime (`support.js`) that lets them open directly in a browser. Do not port that runtime. Read each block's template for its markup and its logic class for behavior.

## Fidelity
**High fidelity.** Colors, type, spacing, radii, states and copy are final for Phase 0. Rebuild pixel-accurately from the tokens. Example data (companies, jobs, platform names, reviewer) is fictional and must stay labeled Illustrative until replaced by real, verified content.

## Files
| Path | What it is |
|---|---|
| `styles.css` | Entry stylesheet: imports all tokens, base resets, focus ring, reduced motion |
| `tokens/primitives.css` | Level 1: raw color values |
| `tokens/semantic.css` | Level 2: role tokens, light (primary) and complete dark set |
| `tokens/typography.css` | Families, size scale, 3 H1 display tiers, leading, tracking |
| `tokens/spacing.css` | Spacing scale, containers, fluid section padding, breakpoint reference |
| `tokens/effects.css` | Radius, borders, shadows, focus, icon sizes, motion |
| `tokens/components.css` | Level 3: button, input, badge, chip, card tokens + data-attribute variants |
| `guidelines/Foundations.dc.html` | Foundation specimen cards (Stage B) |
| `components/<Block>.dc.html` | One file per block (template + behavior) |
| `components/<Block>.d.ts` | Prop contract; shared types in `components/types.d.ts` |
| `components/<Block>.prompt.md` | Usage note: when to use, when not, content limits |
| `components/Library*.dc.html` | Block catalog, all states, desktop + 390 |
| `components/Page *.dc.html` | Stage D reference pages (see note below) |
| `Stage D - Page Previews.dc.html` | All three pages side by side at 1440 and 390 |
| `components/_future.md` | How the [F] blocks map onto existing tokens |
| `assets/logo/` | Logo and mark SVGs, light and dark, favicon |

Note: the reference pages sit in `components/` rather than `pages/` because the preview runtime resolves blocks from the same folder. In Astro they belong in `src/pages/`.

To view: open any `.dc.html` in a browser from this folder (a local static server avoids file:// font issues, e.g. `npx serve`).

## Token architecture
Three levels. Components read only semantic and component tokens.

1. **Primitive** (`--sb-*`): raw hex values.
2. **Semantic** (`--color-*`): roles. Declared on `:root, [data-theme="light"], [data-surface="light"]` and re-declared on `[data-theme="dark"], [data-surface="dark"]`.
3. **Component** (`--button-*`, `--input-*`, `--badge-*`, `--chip-*`, `--card-*`): declared on `:root, [data-theme], [data-surface]` so they re-resolve inside a dark section.

**Surface switching.** Put `data-surface="dark"` on any section (FinalCta uses it by default) and every token inside flips, focus ring included. `data-theme="dark"` on `<html>` enables full dark mode later without redesign.

**Variant attributes.** Variants are data attributes that set local custom properties, so markup stays class-free and the rules live in `tokens/components.css`:
`data-variant` / `data-size` / `data-full` (Button), `data-availability` + `data-badge-variant` (AvailabilityBadge, ProductShot frame), `data-status` (StatusChip), `data-tone` (section background), `data-field-state` (inputs), `data-columns` (FeatureGrid), `data-pressed` (segmented toggle), `data-callout`, `data-emphasis` (comparison rows), `data-current` (nav indicator), `data-jf-state` (job card). In Astro you may keep these attributes or convert them to classes; keep the token names.

## Design tokens (summary; full values in tokens/)
**Color, light**
- Background `#FFFFFF` · surface (mist) `#EEF2EF` · accent surface (mint) `#DDEFE9`
- Text `#0E1B18` · secondary `#34423E` · muted `#52605C`
- Border `#D2DBD6` · strong (inputs, 3.5:1) `#7D8C86`
- Accent (deep teal) `#0B5E6B` · hover `#084A55` · active `#063A43` · on accent `#FFFFFF`
- Success `#1B7A3A` / `#E6F2E9` · warning `#8F5A00` / `#FBF1DE` · error `#B42318` / `#FCE9E7`
- Graphic-only accent `#5FC7C9` (never text on light)

**Color, dark:** bg `#0C1715`, surface `#14221F`, raised `#1A2926`, text `#E6EEEA` / `#BCC8C3` / `#8E9C97`, border `#2A3A36` / `#5E6C67`, accent `#5FC7C9` (hover `#8BD8D9`, on-accent `#0C1715`), success `#4CC27A`, warning `#E5B454`, error `#F2786D`.

**Availability:** Live green / Preview amber / Concept teal / Planned grey / Illustrative dashed muted. Each has a distinct icon (filled dot, half circle, diamond, dashed circle, dashed square), so state never relies on color.

**Contrast (verified, WCAG 2.2 AA):** ink/white 17.7, muted/white 6.6, white/teal 7.4, teal/mint 6.2, green/green-50 4.7, amber/amber-50 5.2, red/red-50 5.6, border-strong/white 3.5, dark text/night 15.5, teal-300/night 9.1.

**Type:** Geist (headings, body) + Geist Mono (states, dates, versions, sources only). Google Fonts, weights 400/500/600.
- H1 tiers: `--display-home` clamp 40→72, `--display-page` 36→56, `--display-compact` 30→40; leading 1.04; tracking −0.035em
- H2 `--text-h2` 28→40, H3 `--text-h3` 22→28; leading 1.15; tracking −0.025em
- Lead 21 / body 16 (article 18) / UI 14 / meta 12 / badge 11 mono caps +0.04em; body leading 1.6
- Measures: body 68ch, lead 56ch, article column 46rem

**Space:** 4px base: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128. Containers 1200 / 1440 / 720. Gutter 16→32. Section padding 48→112 (tight 32→64). Touch target 44.

**Radius:** 2 badges · 4 buttons, inputs, chips · 6 cards, frames · 8 panels, dialogs. No pills.
**Shadow:** sm sticky header · md hover, menus · lg dialog only. Separation comes from borders and surfaces first.
**Focus:** 2px solid `--color-focus`, 2px offset, `:focus-visible` only; teal-800 on light, teal-300 on dark.
**Motion:** 120 / 200 / 320ms, `cubic-bezier(0.2,0,0,1)`; zeroed under `prefers-reduced-motion`.

**Breakpoints (only these):** 480 small mobile · 640 mobile · 768 tablet · 900 nav collapse · 1200 desktop · 1440 wide.

## Responsive behavior
The prototypes measure each block's own width in JS so previews work inside fixed frames. In Astro, replace that with CSS:
- Most grids already use `repeat(auto-fit, minmax(min(100%, X), 1fr))` and need no queries.
- Width switches → `@container` or `@media` at the shared breakpoints: Header burger < 900; Hero/FinalCta full-width stacked CTAs < 640; Breadcrumbs back-link < 640; WaitlistDialog bottom sheet < 640; RequirementEvidencePanel, PipelineBoard table, ComparisonTable, SupportMatrix stacked < 768; WorkflowDiagram vertical < 1000 container width.
- Article blocks already use a CSS container query (`container-name: article`, 900px) for the TOC sidebar and the shared text column.
- StickyMobileCta renders only < 900; pages add bottom padding equal to its height (76px).

## Interactive blocks and client-side JS
| Block | Needs JS | Behavior |
|---|---|---|
| Header | Yes (island) | "Product" is a button with `aria-expanded`/`aria-controls`; opens a panel of the 6 stages with availability. Esc and outside click close. Tab order: logo → nav items → panel links → CTA. < 900: burger (44×44, label "Open menu"/"Close menu") opens a full-height drawer; "Product" opens level 2 with a Back button; CTA pinned at the drawer bottom. Lock body scroll while open. |
| WaitlistDialog + WaitlistForm | Yes (island) | Opened by every CTA in waitlist mode, passing `source`. `role="dialog"`, `aria-modal`, labelled by title. Focus moves to the email field, Tab is trapped, Esc and backdrop close, focus returns to the trigger. States: idle → invalid (email format, consent required; errors after submit, focus first invalid field, `aria-invalid` + `aria-describedby`) → submitting (button `aria-busy`, "Joining…") → success / duplicate / server error (form kept, retry). Payload `{ email, role|null, consent: true, source }`. |
| FaqAccordion | No | Native `<details>/<summary>`; icon swap can be CSS (`details[open]`). Emit FAQPage JSON-LD from the same data. |
| PipelineBoard | Yes (small) | Board/Table toggle: two buttons in `role="group"`, `aria-pressed`. Board scrolls horizontally with scroll-snap on mobile (82% column width). |
| ComparisonTable | No | Does not scroll: stacks into one card per option below 768. |
| TableOfContents | Optional | Anchor links work without JS; IntersectionObserver adds `aria-current="location"`. Mobile: `<details>`. |
| BeforeAfterDiff | Optional | Illustrative demo of Accept / Edit / Reject / Undo. Can ship static (proposed state) on Phase 0 pages. |
| JobFeedCard | Optional | Save / Skip / Undo demo. Ship static if preferred. |
| AnnouncementBar | Optional | Dismiss button (`aria-label`); persist per session. |
| StickyMobileCta | No | CSS-only visibility. |

## Honesty rules the components enforce
- **AvailabilityBadge** on every feature, visual, workflow node and support row whose state matters.
- **Readiness-aware CTA:** Button `readiness="waitlist"` always renders "Join the waitlist" and opens the dialog; `readiness="live"` renders the live label ("Start profile") and links to sign-up. Launch default is waitlist everywhere.
- **ProductShot** states: live (solid frame, real screenshot only), preview and concept (automatic note), illustrative (dashed frame + "Illustrative data").
- **No fabricated proof:** there are no logo, testimonial, rating, stat, pricing or case-study blocks.
- **LimitationsCallout** uses the same H2 tier and padding as benefit sections.
- **SupportMatrix** drops rows without a verified-on date; its empty state is the launch default.
- **AuthorReviewed** shows real names only; omit the reviewer if there is none.

## Screens
### Homepage `/`: "AI Job Search Platform"
Header → AnnouncementBar (optional, dismissible) → Hero(home: badge Preview "in private testing", H1 "AI job search built around your whole application workflow", concept ProductShot "Application pipeline") → WorkflowDiagram "How the search works" (4 nodes) → ControlPoints "What you control" (muted) → PipelineBoard "See your application pipeline" (Illustrative) → AudienceCards "Who this helps" (muted) → RelatedLinks "Explore each stage" (4 feature pages) → FaqAccordion (job board / invent experience / submit without consent / availability) → FinalCta (dark) → Footer + StickyMobileCta.

### Feature landing `/features/resume-tailoring`
Header → Breadcrumbs → Hero(feature: H1 "Tailor your resume to each job without starting over", illustrative ProductShot) → FeatureGrid "Start from verified experience" (Candidate facts, Role-specific resume base) → BeforeAfterDiff "See what changes for this job" (muted, id="diff" target of the secondary CTA) → ControlPoints "Review every proposed edit" → FeatureGrid "Save the version you used" (3 cols, muted) → LimitationsCallout "What tailoring cannot do" → FaqAccordion (make things up / stuff keywords / undo / availability) → RelatedLinks (next: autofill) → FinalCta → Footer + StickyMobileCta.

### Guide `/guides/tailor-resume-to-job-description`
Header (Resources current) → Breadcrumbs → ArticleHero → ArticleBody (sticky TOC, 5 steps, comparison table, warning + tip Callouts, list) → KeyTakeaways → InlineCta (to /features/resume-tailoring, waitlist-aware) → FaqAccordion → RelatedLinks → AuthorReviewed → Footer. No StickyMobileCta.

Exact copy for all three pages is in the page files' logic classes and in each block's defaults.

## Composition maps: other Phase 0 pages (no new layout code needed)
| Page | H1 | Blocks in order |
|---|---|---|
| /features/job-search-automation | Job search automation with you in control | Header, Breadcrumbs, Hero(feature), WorkflowSteps (Discover / Evaluate / Prepare / Track), ControlPoints (approval points), ComparisonTable (search vs preparation vs autofill vs submission, 4 cols), FeatureGrid "Set up your search", FaqAccordion, RelatedLinks, FinalCta, Footer |
| /features/ai-job-finder | Find relevant jobs faster with an AI job finder | Header, Breadcrumbs, Hero(feature), JobFeedCard ×2–4 inside a section, FeatureGrid "See why an opening appears" (Match context, Date and source, Missing information), SupportMatrix "Where jobs come from" (nameLabel "Source"), FaqAccordion, RelatedLinks, FinalCta, Footer |
| /features/job-matcher | Match your experience to the jobs worth pursuing | Header, Breadcrumbs, Hero(feature), RequirementEvidencePanel, ControlPoints "Decide: apply, improve or skip", LimitationsCallout (match score), FaqAccordion, RelatedLinks, FinalCta, Footer |
| /features/ats-resume-optimizer | Optimize your resume for ATS and the job description | Header, Breadcrumbs, Hero(feature), IssueFixExample, BeforeAfterDiff, LimitationsCallout "What an ATS score can and cannot tell you", FaqAccordion (checker vs optimizer), RelatedLinks, FinalCta, Footer |
| /features/job-application-autofill | Autofill job applications from your verified profile | Header, Breadcrumbs, Hero(feature), FeatureGrid (Experience / Education / Basic details), BeforeAfterDiff (field + source trace), SupportMatrix, ComparisonTable (autofill vs auto apply), FaqAccordion, RelatedLinks, FinalCta, Footer |
| /features/auto-apply | Auto apply to jobs with clear review and control | Header, Breadcrumbs, Hero(feature), WorkflowSteps (Selection rules / Approval mode / Submission confirmation), StatusStates, SupportMatrix (empty state), ComparisonTable, LimitationsCallout "Where auto-apply is supported", FaqAccordion, RelatedLinks, FinalCta, Footer |
| /features/job-application-tracker | Track job applications in one clear pipeline | Header, Breadcrumbs, Hero(feature), PipelineBoard, FeatureGrid (job, date, resume version, contacts, notes), ControlPoints (next action / follow-up), FaqAccordion, RelatedLinks, FinalCta, Footer |

## Navigation
Primary: Product ▾ · Job Finder · Job Matching · Resume Tailoring · Auto Apply · Tracker · Resources, plus readiness-aware CTA. Pricing stays hidden until it exists. Guides, tools, alternatives and comparisons live under Resources. If items don't fit above 900px, the header collapses to the burger.

## Assets
- `assets/logo/logo-light.svg`, `logo-dark.svg`: mark + wordmark. The wordmark is live SVG text in Geist 600; outline it to paths before production.
- `assets/logo/mark.svg`, `mark-dark.svg`: 48px mark ([ / ] brackets broken by a slash)
- `assets/logo/favicon.svg`: heavier strokes for 16px
- Icons: 24px grid, 1.5 stroke, round caps, inline SVG with `currentColor`. Path data in `components/Icon.dc.html`.
- Product visuals: none yet. ProductShot shows a labeled slot until real screenshots or labeled concepts are supplied. No photos of people, no fake UI.

## Suggested build approach
1. Copy `styles.css` + `tokens/` into `src/styles/`; import once in the base layout.
2. Build primitives first (Button, AvailabilityBadge, StatusChip, Icon) as `.astro` components with the same props.
3. Build blocks as `.astro` components typed with the `.d.ts` contracts. Replace the JS width measuring with CSS as listed above.
4. Islands (React): Header menu, WaitlistDialog/Form, PipelineBoard toggle; optional: TableOfContents, BeforeAfterDiff, JobFeedCard, AnnouncementBar.
5. Put page content in content collections (Markdown/JSON) that match the block props; guides map to ArticleBody blocks.
6. Check against the brief's acceptance checklist: tokens only, all states, AA contrast, labeled illustrative data, composition maps satisfied.

## Shared types
```ts
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
export interface WaitlistPayload { email: string; role: string | null; consent: true; source: string; }
export type EvidenceStatus = 'confirmed' | 'partial' | 'gap' | 'unclear';
export type ApplicationStatus = 'prepared' | 'reviewed' | 'submitted' | 'failed';
export interface ArticleMeta { updated?: string; reviewed?: string; readingTime?: string; }
```

## Component table with props
### Button · primitive

Use when: Every CTA. Pass readiness for the page’s main action so it switches label automatically.  
Content limits: Labels are concrete actions, ≤ 4 words: "Join the waitlist", "See how tailoring works". Never "Learn more", "Get started", "Unlock". One primary per view.

```ts
import type { Readiness } from './types';
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';   // default 'primary'
  size?: 'sm' | 'md' | 'lg';                              // default 'md'; sm is desktop-only
  /** When set, label is resolved: waitlist → "Join the waitlist", live → label ?? "Start profile" */
  readiness?: Readiness;
  label?: string;
  href?: string;            // renders <a>; omitted → <button>
  type?: 'button' | 'submit';
  loading?: boolean;        // aria-busy, blocks clicks, keeps width
  loadingLabel?: string;
  disabled?: boolean;       // aria-disabled, not focus-removed
  fullWidth?: boolean;
  arrow?: boolean;          // trailing arrow-right icon
  ariaLabel?: string;
  onActivate?: (e: MouseEvent) => void;
}
// States: default, hover, active, focus-visible, loading, disabled. Tokens: --button-*, data-variant / data-size.
```

### AvailabilityBadge · primitive

Use when: Next to any feature name, screenshot, workflow step or support-matrix row whose state matters.  
Content limits: Labels: Live, Preview, Concept, Planned, Illustrative data. detail ≤ 4 words.

```ts
import type { Availability } from './types';
export interface AvailabilityBadgeProps {
  state: Availability | 'illustrative';
  variant?: 'filled' | 'outline';   // outline for use on busy surfaces or with detail text
  label?: string;                   // override default label
  detail?: string;                  // appended after " · ", e.g. "verified on 2026-09-14"
}
// Each state has a distinct icon shape; meaning never depends on color alone. Screen readers hear "Availability: <label>".
```

### StatusChip · primitive

Use when: Evidence status, application status, saved state.  
Content limits: label ≤ 2 words.

```ts
import type { EvidenceStatus, ApplicationStatus } from './types';
export interface StatusChipProps { status: EvidenceStatus | ApplicationStatus; label?: string; }
// Icon + text always. Tokens: data-status → --st-fg / --st-bg.
```

### Icon · primitive

Use when: Any icon in UI: buttons, lists, status.  
Content limits: Use only names from IconName. Add new icons on the 24px grid, 1.5 stroke, round caps.

```ts
import type { IconName } from './types';
export interface IconProps { icon: IconName; size?: 16 | 20 | 24; strokeWidth?: number; }
/** Decorative by default (aria-hidden). Inherits currentColor. */
```

### Header · [G] global

Use when: Every page.  
Content limits: Max 7 top-level items. Product children: label ≤ 3 words, description ≤ 12 words, availability required. Pricing stays hidden until it exists.

```ts
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
```

### Footer · [G] global

Use when: Every page.  
Content limits: 3–4 columns, ≤ 7 links each. statusNote must state the current release status honestly.

```ts
import type { LinkItem } from './types';
export interface FooterColumn { title: string; links: LinkItem[]; }
export interface FooterProps { columns: FooterColumn[]; legalLinks?: LinkItem[]; statusNote?: string; copyright?: string; tone?: 'default' | 'muted'; }
// Static. No social proof, no social icons unless accounts exist.
```

### Breadcrumbs · [G] global

Use when: All pages below the homepage.  
Content limits: Use page H1 short names. ≤ 4 levels.

```ts
export interface BreadcrumbsProps { items: { label: string; href?: string }[]; tone?: 'default' | 'muted'; }
// Last item is the current page (aria-current="page"). Below 640px with 3+ items → single "← Parent" link.
```

### StickyMobileCta · [G] global

Use when: Long mobile pages (home, feature landings) with one main action.  
Content limits: text ≤ 8 words, optional.

```ts
import type { Readiness } from './types';
export interface StickyMobileCtaProps { readiness: Readiness; label?: string; href?: string; text?: string; position?: 'fixed' | 'static'; onActivate?: () => void; }
// Render only below 900px (CSS media query in production). Pages using it add bottom padding equal to its height.
```

### WaitlistDialog · [G] global

Use when: When readiness = waitlist and a CTA is activated.  
Content limits: Title ≤ 8 words, text ≤ 30 words.

```ts
import type { WaitlistStatus, WaitlistPayload } from './types';
export interface WaitlistDialogProps {
  open: boolean;
  onClose: () => void;
  source: string;
  title?: string; text?: string; consentText?: string; showRole?: boolean;
  onSubmit?: (p: WaitlistPayload) => Promise<'success' | 'duplicate' | 'error'>;
  variant?: 'dialog';              // bottom sheet is automatic below 640px
  /** preview only */ layout?: 'fixed' | 'contained';
  /** preview only */ initialStatus?: WaitlistStatus;
}
// JS island: yes. role=dialog, aria-modal, focus trap, Esc + backdrop close, focus returns to trigger.
```

### WaitlistForm · [G] global

Use when: Inside WaitlistDialog, or inline on a dedicated waitlist section.  
Content limits: Email required, role optional, consent required and unchecked by default. Always pass source.

```ts
import type { WaitlistStatus, WaitlistPayload } from './types';
export interface WaitlistFormProps {
  source: string;                  // e.g. 'home-hero', 'resume-tailoring-final-cta'
  consentText?: string;
  privacyHref?: string;
  showRole?: boolean;              // default true, optional field
  roleOptions?: string[];
  onSubmit?: (p: WaitlistPayload) => Promise<'success' | 'duplicate' | 'error'>;
  onResult?: (r: 'success' | 'duplicate' | 'error', p: WaitlistPayload) => void;
  /** preview only */ initialStatus?: WaitlistStatus;
}
// States: idle, invalid (email/consent), submitting, error (server, form kept), success, duplicate.
```

### AnnouncementBar · [G] global

Use when: Pre-launch status or a real, time-bound notice.  
Content limits: text ≤ 14 words.

```ts
import type { Availability } from './types';
export interface AnnouncementBarProps { text: string; href?: string; linkLabel?: string; badge?: Availability | 'none'; dismissible?: boolean; onActivate?: () => void; onDismiss?: () => void; }
// Optional; off by default on pages. Dismissal persists per session in production.
```

### Hero · [S] section

Use when: Top of homepage (variant home) and feature landings (variant feature).  
Content limits: headline ≤ 12 words; lead ≤ 40 words, first sentence answers "what is this"; badge required while not live; media must be a real screenshot or labeled concept/illustrative.

```ts
import type { BadgeConfig, CtaConfig, LinkCta, SectionTone } from './types';
import type { ProductShotProps } from './ProductShot';
export interface HeroProps {
  variant: 'home' | 'feature';     // home → --display-home, feature → --display-page
  headline: string;                // H1, ≤ 12 words
  lead: string;                    // answer-first, ≤ 40 words
  primaryCta: CtaConfig;
  secondaryCta?: LinkCta;          // concrete action, e.g. "See how tailoring works"
  badge?: BadgeConfig;
  media?: ProductShotProps;        // omit for text-only hero
  reassurance?: string;
  tone?: SectionTone;              // default 'muted'
  onCta?: () => void;
}
```

### ProductShot · [S] section

Use when: Any screenshot, concept or example-data visual.  
Content limits: Never use a static mockup to imply live interaction. Illustrative content must contain only fictional data.

```ts
export interface ProductShotProps {
  state: 'live' | 'preview' | 'concept' | 'illustrative';
  src?: string;                    // real capture only; omitted → labeled slot
  alt: string;                     // describe what the screen shows
  label?: string;                  // frame title, e.g. "Application pipeline"
  caption?: string;
  aspect?: string;                 // CSS aspect-ratio, default "16 / 10"
  stateNote?: string;              // override automatic state note ('' to hide; not allowed for concept/illustrative)
}
// live = solid frame, no note. concept/preview = note under frame. illustrative = dashed frame + "Illustrative data".
```

### WorkflowSteps · [S] section

Use when: Explaining an ordered process (Discover → Evaluate → Prepare → Track).  
Content limits: 3–6 steps; title ≤ 5 words; text ≤ 25 words.

```ts
import type { Availability, SectionTone } from './types';
export interface WorkflowStep { title: string; text: string; availability?: Availability; }
export interface WorkflowStepsProps { heading: string; lead?: string; eyebrow?: string; steps: WorkflowStep[]; tone?: SectionTone; }
// 3–6 steps. Numbers are generated. Titles are H3.
```

### WorkflowDiagram · [S] section

Use when: Homepage "How the search works"; How it works page.  
Content limits: 4–7 nodes; label ≤ 3 words; text ≤ 8 words. Link only to published pages.

```ts
import type { Availability, SectionTone } from './types';
export interface WorkflowNode { label: string; href?: string; availability: Availability; text?: string; }
export interface WorkflowDiagramProps { heading: string; lead?: string; nodes: WorkflowNode[]; note?: string; tone?: SectionTone; }
// href only for published pages. Horizontal ≥1000px container width, vertical below.
```

### ControlPoints · [S] section

Use when: Every feature page that involves AI output or submission.  
Content limits: 3–5 points; title ≤ 6 words starting with a verb; text ≤ 25 words.

```ts
import type { IconName, SectionTone } from './types';
export interface ControlPoint { title: string; text: string; icon?: IconName; }
export interface ControlPointsProps { heading: string; lead?: string; eyebrow?: string; points: ControlPoint[]; tone?: SectionTone; }
```

### FeatureGrid · [S] section

Use when: Groups of 2–6 related capabilities.  
Content limits: title ≤ 5 words; text ≤ 30 words; link only to published pages with a concrete label.

```ts
import type { Availability, IconName, SectionTone } from './types';
export interface FeatureItem { title: string; text: string; icon?: IconName; availability?: Availability; href?: string; linkLabel?: string; }
export interface FeatureGridProps { heading: string; lead?: string; eyebrow?: string; items: FeatureItem[]; columns?: 2 | 3 | 4; tone?: SectionTone; }
// Columns set the minimum card width (data-columns); the grid reflows with auto-fit.
```

### BeforeAfterDiff · [S] section

Use when: Resume tailoring, ATS optimizer, autofill field-source trace.  
Content limits: One edit per block; ≤ 40 words per side. Always Illustrative.

```ts
import type { SectionTone } from './types';
export interface DiffSegment { text: string; kind?: 'added' | 'removed'; }
export interface Provenance { source: string; fact: string; confirmedOn?: string; }
export type DiffState = 'proposed' | 'editing' | 'accepted' | 'edited' | 'rejected';
export interface BeforeAfterDiffProps {
  heading: string; lead?: string; frameLabel?: string;
  requirement: string;
  before: DiffSegment[];            // 'removed' segments render as <del>
  after: DiffSegment[];             // 'added' segments render as <ins>
  provenance: Provenance;           // required: every edit must cite a profile fact
  resumeVersion?: string;
  state?: DiffState;                // initial state
  tone?: SectionTone;
}
// Always labeled Illustrative on marketing pages. JS island: yes (accept/edit/reject/undo).
```

### RequirementEvidencePanel · [S] section

Use when: Job matcher, ATS pages.  
Content limits: 3–7 rows; requirement ≤ 12 words; evidence ≤ 20 words. Pair with LimitationsCallout.

```ts
import type { EvidenceStatus, SectionTone } from './types';
export interface EvidenceRow { requirement: string; evidence: string; status: EvidenceStatus; note?: string; }
export interface RequirementEvidencePanelProps { heading: string; lead?: string; frameLabel?: string; rows: EvidenceRow[]; footnote?: string; tone?: SectionTone; }
// Table (role=table) ≥768px container width; stacked list below. No numeric score.
```

### IssueFixExample · [S] section

Use when: ATS optimizer and resume-check pages.  
Content limits: 2–5 items; each field ≤ 25 words. Use "some systems", never absolute claims.

```ts
import type { SectionTone } from './types';
export interface IssueFixExampleProps { heading: string; lead?: string; frameLabel?: string; items: { issue: string; why: string; fix: string }[]; tone?: SectionTone; }
```

### JobFeedCard · [S] section

Use when: AI Job Finder page, in a list of 2–4.  
Content limits: matches 2–4, missing 1–3, each ≤ 10 words.

```ts
export interface Job { title: string; company: string; location: string; workMode: string; postedAt: string; source: string; url?: string; matches: string[]; missing: string[]; }
export type JobCardState = 'default' | 'saved' | 'skipped';
export interface JobFeedCardProps { job: Job; state?: JobCardState; illustrative?: boolean; onChange?: (s: JobCardState) => void; }
// Use in a vertical list (gap var(--space-3)). Skipped collapses to one line with Undo.
```

### PipelineBoard · [S] section

Use when: Homepage pipeline section, Application Tracker page.  
Content limits: 5 columns max; 4–8 fictional cards.

```ts
import type { SectionTone } from './types';
export interface PipelineColumn { id: string; title: string; }
export interface PipelineCard { id: string | number; column: string; title: string; company: string; resumeVersion: string; nextAction: string; updated: string; }
export interface PipelineBoardProps { heading: string; lead?: string; frameLabel?: string; columns: PipelineColumn[]; cards: PipelineCard[]; view?: 'kanban' | 'table'; tone?: SectionTone; }
// JS island: yes (view toggle, aria-pressed). Board scrolls horizontally with snap on mobile; table stacks below 768px.
```

### StatusStates · [S] section

Use when: Auto-apply and tracker pages.  
Content limits: description ≤ 18 words.

```ts
import type { ApplicationStatus, SectionTone } from './types';
export interface StatusStateItem { id: ApplicationStatus; label?: string; description: string; }
export interface StatusStatesProps { heading: string; lead?: string; states: StatusStateItem[]; tone?: SectionTone; }
```

### ComparisonTable · [S] section

Use when: Autofill vs auto apply; search vs preparation vs autofill vs submission.  
Content limits: Row labels ≤ 5 words; cells ≤ 20 words. Mark one emphasis row at most.

```ts
import type { SectionTone } from './types';
export interface ComparisonColumn { key: string; label: string; }
export type ComparisonValue = string | { text: string; mark?: 'yes' | 'no' | 'partial' };
export interface ComparisonRow { label: string; values: Record<string, ComparisonValue>; emphasis?: boolean; }
export interface ComparisonTableProps { heading: string; lead?: string; columns: ComparisonColumn[]; rows: ComparisonRow[]; caption?: string; tone?: SectionTone; }
// 2–4 columns. Grid table ≥768px container width; below, one stacked card per column. emphasis highlights the key row (e.g. "Who presses submit"). No JS needed unless it scrolls.
```

### SupportMatrix · [S] section

Use when: Autofill, auto-apply and job-source pages.  
Content limits: Show verified or partial rows only, each with a verified-on date. Launch with the empty state.

```ts
import type { SectionTone } from './types';
export interface SupportRow { name: string; scope: string; status: 'verified' | 'partial'; verifiedOn: string; note?: string; }
export interface SupportMatrixProps {
  heading: string; lead?: string; nameLabel?: string;   // "Platform", "Source"
  rows: SupportRow[];               // rows without verifiedOn are dropped
  lastReviewed: string;
  emptyTitle?: string; emptyText?: string; emptyLinkLabel?: string; emptyHref?: string;
  footnote?: string; illustrative?: boolean; tone?: SectionTone;
}
// Empty rows → designed "Not yet tested" state. Launch default is the empty state.
```

### LimitationsCallout · [S] section

Use when: Match scores, ATS scores, auto-apply support, any claim with limits.  
Content limits: Heading is a plain question-like statement. 2–5 items; text ≤ 25 words. Same visual weight as benefit sections.

```ts
import type { SectionTone } from './types';
export interface LimitationsCalloutProps { heading: string; eyebrow?: string; lead?: string; items: { title: string; text: string }[]; footnote?: string; tone?: SectionTone; }
// Same heading tier (H2) and section padding as benefit sections. Never collapse or shrink it.
```

### AudienceCards · [S] section

Use when: Homepage "Who this helps".  
Content limits: 3 cards; text ≤ 25 words; caveat ≤ 12 words.

```ts
import type { SectionTone } from './types';
export interface AudienceItem { title: string; text: string; caveat?: string; }
export interface AudienceCardsProps { heading: string; lead?: string; items: AudienceItem[]; caveatLabel?: string; tone?: SectionTone; }
```

### RelatedLinks · [S] section

Use when: Bottom of feature pages and guides.  
Content limits: 2–4 links; blurb ≤ 15 words.

```ts
import type { Availability, SectionTone } from './types';
export interface RelatedLink { label: string; href: string; blurb?: string; kind?: 'next' | 'related' | 'guide'; availability?: Availability; }
export interface RelatedLinksProps { heading?: string; items: RelatedLink[]; tone?: SectionTone; }
// Only published targets. Put the "next" workflow stage first.
```

### FaqAccordion · [S] section

Use when: Objection handling near the end of a page.  
Content limits: 4–8 questions in the user’s words; answers start with a direct answer, ≤ 60 words.

```ts
import type { SectionTone } from './types';
export interface FaqAccordionProps { heading: string; lead?: string; faqs: { q: string; a: string }[]; defaultOpen?: number | null; tone?: SectionTone; }
// Native <details>/<summary>. Emit FAQPage JSON-LD from the same faqs array (visible Q&A only).
```

### FinalCta · [S] section

Use when: End of home and feature pages.  
Content limits: heading ≤ 10 words; text ≤ 25 words; reassurance must be true for the current product state.

```ts
import type { CtaConfig, LinkCta, SectionTone } from './types';
export interface FinalCtaProps { heading: string; text?: string; cta: CtaConfig; secondaryCta?: LinkCta; reassurance?: string; surface?: 'dark' | 'light'; tone?: SectionTone; onCta?: () => void; }
```

### ArticleHero · [A] article

Use when: Top of every guide.  
Content limits: headline ≤ 12 words; answer is one sentence ≤ 35 words.

```ts
import type { ArticleMeta, SectionTone } from './types';
export interface ArticleHeroProps { eyebrow?: string; headline: string; answer: string; meta: ArticleMeta; tone?: SectionTone; }
// H1 uses --display-compact. Aligns to the article column via container query (container-name: article).
```

### TableOfContents · [A] article

Use when: Guides with 3+ H2 sections (automatic via ArticleBody).  
Content limits: Labels ≤ 6 words (use tocLabel to shorten long H2s).

```ts
export interface TableOfContentsProps { items: { id: string; label: string }[]; title?: string; variant: 'sidebar' | 'collapsible'; }
// Usually rendered by ArticleBody. Sidebar is sticky ≥900px; collapsible <details> below. Tracks the active section with IntersectionObserver (aria-current="location").
```

### ArticleBody · [A] article

Use when: Guides and info pages.  
Content limits: Paragraphs ≤ 80 words; steps 3–7; tables ≤ 4 columns, ≤ 8 rows.

```ts
import type { SectionTone } from './types';
export type ArticleBlock =
  | { type: 'h2'; id: string; text: string; tocLabel?: string }
  | { type: 'h3'; id?: string; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'steps'; steps: { title: string; text: string }[] }
  | { type: 'table'; columns: string[]; rows: string[][]; caption?: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'note'; title?: string; text: string };
export interface ArticleBodyProps { blocks: ArticleBlock[]; toc?: boolean; tocTitle?: string; tone?: SectionTone; }
// TOC built from h2 blocks. Body measure --measure-article (46rem), text --article-text (18px).
```

### KeyTakeaways · [A] article

Use when: Guides.  
Content limits: 3–5 items, ≤ 15 words each.

```ts
export interface KeyTakeawaysProps { heading?: string; items: string[]; }
```

### InlineCta · [A] article

Use when: Once per guide, after the takeaways.  
Content limits: title ≤ 8 words; text ≤ 25 words.

```ts
import type { Availability, CtaConfig } from './types';
export interface InlineCtaProps { eyebrow?: string; title: string; text: string; href: string; linkLabel: string; availability: Availability; cta: CtaConfig; onCta?: () => void; }
// Links to ONE canonical product page. Waitlist mode adds a secondary "Join the waitlist" link; live mode adds a primary CTA.
```

### Callout · [A] article

Use when: Advice that deserves emphasis.  
Content limits: title ≤ 8 words; text ≤ 40 words; ≤ 3 per guide.

```ts
export interface CalloutProps { variant: 'tip' | 'warning' | 'note'; title?: string; text: string; }
```

### AuthorReviewed · [A] article

Use when: End of every guide.  
Content limits: Only verifiable names and dates.

```ts
export interface AuthorReviewedProps { author?: string; updated: string; reviewer?: { name: string; role?: string }; reviewedOn?: string; policyHref?: string; policyLabel?: string; }
// Real people only. No avatars, invented credentials or personas. Omit reviewer if none.
```

