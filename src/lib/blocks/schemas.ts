/**
 * Zod schemas for page content. One schema per block; a page is an ordered list of blocks.
 * This file is the single source of truth for (a) validating content at build time and
 * (b) the structured-output schema handed to Gemini. Keep it free of `astro:*` imports so
 * Node scripts can import it too.
 */
import { z } from 'zod';

export const availability = z.enum(['live', 'preview', 'concept', 'planned']);
export const tone = z.enum(['default', 'muted', 'accent']);
export const readiness = z.enum(['waitlist', 'live']);
export const iconName = z.enum([
  'search', 'check', 'check-circle', 'arrow-right', 'arrow-left', 'chevron-down', 'chevron-up', 'chevron-right',
  'menu', 'close', 'info', 'alert', 'lock', 'file', 'calendar', 'external', 'edit', 'eye', 'pause', 'skip', 'send',
  'user-check', 'shield', 'plus', 'minus', 'arrow-down', 'circle-half', 'x-circle', 'help', 'board', 'table',
]);
export const evidenceStatus = z.enum(['confirmed', 'partial', 'gap', 'unclear']);
export const applicationStatus = z.enum(['prepared', 'reviewed', 'submitted', 'failed']);

const cta = z.object({ readiness, label: z.string().optional(), href: z.string().optional() });
const linkCta = z.object({ label: z.string(), href: z.string() });
const badge = z.object({ state: availability, label: z.string().optional(), detail: z.string().optional() });

const base = { tone: tone.optional(), anchor: z.string().optional() };

const productShot = z.object({
  state: z.enum(['live', 'preview', 'concept', 'illustrative']),
  src: z.string().optional(),
  alt: z.string(),
  label: z.string().optional(),
  caption: z.string().optional(),
  aspect: z.string().optional(),
  stateNote: z.string().optional(),
});

// Shared sub-shapes, defined once here (before `hero`/`heroDemo` need them)
// and reused verbatim by both `heroDemo` (below) and the full standalone
// block schemas further down this file (beforeAfterDiff, requirementEvidence,
// jobFeed, pipelineBoard, comparisonTable) — one shape, two places it's used.
const pipelineColumn = z.object({ id: z.string(), title: z.string() });
const pipelineCard = z.object({
  id: z.union([z.string(), z.number()]),
  column: z.string(),
  title: z.string(),
  company: z.string(),
  resumeVersion: z.string(),
  nextAction: z.string(),
  updated: z.string(),
});
const diffSegment = z.object({ text: z.string(), kind: z.enum(['added', 'removed']).optional() });
const provenance = z.object({ source: z.string(), fact: z.string(), confirmedOn: z.string().optional() });
const evidenceRow = z.object({ requirement: z.string(), evidence: z.string(), status: evidenceStatus, note: z.string().optional() });
const comparisonColumn = z.object({ key: z.string(), label: z.string() });
const comparisonValue = z.union([z.string(), z.object({ text: z.string(), mark: z.enum(['yes', 'no', 'partial']).optional() })]);
const comparisonRow = z.object({ label: z.string(), emphasis: z.boolean().optional(), values: z.record(z.string(), comparisonValue) });
const job = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  workMode: z.string(),
  postedAt: z.string(),
  source: z.string(),
  url: z.string().optional(),
  matches: z.array(z.string()).min(2).max(4),
  missing: z.array(z.string()).min(1).max(3),
});

/** A real, live block embedded as the hero visual — prefer this over `media`
 * (a static screenshot/illustration): it renders crisp at any resolution and
 * adapts to viewport width instead of being a fixed raster image. */
const heroDemo = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('pipelineBoard'),
    frameLabel: z.string().optional(),
    columns: z.array(pipelineColumn).max(5),
    cards: z.array(pipelineCard),
    view: z.enum(['kanban', 'table']).optional(),
  }),
  z.object({
    type: z.literal('beforeAfterDiff'),
    frameLabel: z.string().optional(),
    requirement: z.string(),
    before: z.array(diffSegment),
    after: z.array(diffSegment),
    provenance,
    resumeVersion: z.string().optional(),
  }),
  z.object({
    type: z.literal('requirementEvidence'),
    frameLabel: z.string().optional(),
    rows: z.array(evidenceRow).min(3).max(7),
    footnote: z.string().optional(),
  }),
  z.object({
    type: z.literal('comparisonTable'),
    heading: z.string(),
    columns: z.array(comparisonColumn).min(2).max(4),
    rows: z.array(comparisonRow),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('jobFeed'),
    /** 1-2 cards — this is a hero, keep it compact. */
    jobs: z.array(job).min(1).max(2),
  }),
]);

const hero = z.object({
  type: z.literal('hero'),
  ...base,
  variant: z.enum(['home', 'feature']),
  headline: z.string().max(90),
  lead: z.string(),
  primaryCta: cta,
  secondaryCta: linkCta.optional(),
  badge: badge.optional(),
  demo: heroDemo.optional(),
  media: productShot.optional(),
  reassurance: z.string().optional(),
});

const workflowDiagram = z.object({
  type: z.literal('workflowDiagram'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  nodes: z.array(z.object({ label: z.string(), href: z.string().optional(), availability, text: z.string().optional() })).min(4).max(7),
  note: z.string().optional(),
});

const workflowSteps = z.object({
  type: z.literal('workflowSteps'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  eyebrow: z.string().optional(),
  steps: z.array(z.object({ title: z.string(), text: z.string(), availability: availability.optional() })).min(3).max(6),
});

const phaseSteps = z.object({
  type: z.literal('phaseSteps'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  /** Exactly 3 stages, each with exactly 3 steps — a fixed 3x3 shape, not a generic list. */
  phases: z
    .array(z.object({ title: z.string(), items: z.array(z.string()).length(3) }))
    .length(3),
});

const controlPoints = z.object({
  type: z.literal('controlPoints'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  eyebrow: z.string().optional(),
  points: z.array(z.object({ title: z.string(), text: z.string(), icon: iconName.optional() })).min(3).max(5),
});

const featureGrid = z.object({
  type: z.literal('featureGrid'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  eyebrow: z.string().optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        text: z.string(),
        icon: iconName.optional(),
        availability: availability.optional(),
        href: z.string().optional(),
        linkLabel: z.string().optional(),
      }),
    )
    .min(2)
    .max(6),
});

const beforeAfterDiff = z.object({
  type: z.literal('beforeAfterDiff'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  frameLabel: z.string().optional(),
  requirement: z.string(),
  before: z.array(diffSegment),
  after: z.array(diffSegment),
  provenance,
  resumeVersion: z.string().optional(),
});

const requirementEvidence = z.object({
  type: z.literal('requirementEvidence'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  frameLabel: z.string().optional(),
  rows: z.array(evidenceRow).min(3).max(7),
  footnote: z.string().optional(),
});

const issueFix = z.object({
  type: z.literal('issueFix'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  frameLabel: z.string().optional(),
  items: z.array(z.object({ issue: z.string(), why: z.string(), fix: z.string() })).min(2).max(5),
});

const jobFeed = z.object({
  type: z.literal('jobFeed'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  jobs: z.array(job).min(2).max(4),
});

const pipelineBoard = z.object({
  type: z.literal('pipelineBoard'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  frameLabel: z.string().optional(),
  view: z.enum(['kanban', 'table']).optional(),
  columns: z.array(pipelineColumn).max(5),
  cards: z.array(pipelineCard),
});

const statusStates = z.object({
  type: z.literal('statusStates'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  states: z.array(z.object({ id: applicationStatus, label: z.string().optional(), description: z.string() })),
});

const comparisonTable = z.object({
  type: z.literal('comparisonTable'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  caption: z.string().optional(),
  columns: z.array(comparisonColumn).min(2).max(4),
  rows: z.array(comparisonRow),
});

const supportMatrix = z.object({
  type: z.literal('supportMatrix'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  nameLabel: z.string().optional(),
  lastReviewed: z.string(),
  rows: z.array(
    z.object({ name: z.string(), scope: z.string(), status: z.enum(['verified', 'partial']), verifiedOn: z.string(), note: z.string().optional() }),
  ),
  emptyTitle: z.string().optional(),
  emptyText: z.string().optional(),
  emptyLinkLabel: z.string().optional(),
  emptyHref: z.string().optional(),
  footnote: z.string().optional(),
  illustrative: z.boolean().optional(),
});

const limitationsCallout = z.object({
  type: z.literal('limitationsCallout'),
  ...base,
  heading: z.string(),
  eyebrow: z.string().optional(),
  lead: z.string().optional(),
  items: z.array(z.object({ title: z.string(), text: z.string() })).min(2).max(5),
  footnote: z.string().optional(),
});

const audienceCards = z.object({
  type: z.literal('audienceCards'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  caveatLabel: z.string().optional(),
  items: z.array(z.object({ title: z.string(), text: z.string(), caveat: z.string().optional() })).length(3),
});

const relatedLinks = z.object({
  type: z.literal('relatedLinks'),
  ...base,
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        blurb: z.string().optional(),
        kind: z.enum(['next', 'related', 'guide']).optional(),
        availability: availability.optional(),
      }),
    )
    .min(2)
    .max(4),
});

const faq = z.object({
  type: z.literal('faq'),
  ...base,
  heading: z.string(),
  lead: z.string().optional(),
  defaultOpen: z.number().nullable().optional(),
  jsonLd: z.boolean().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(3).max(8),
});

const finalCta = z.object({
  type: z.literal('finalCta'),
  ...base,
  heading: z.string(),
  text: z.string().optional(),
  cta,
  secondaryCta: linkCta.optional(),
  reassurance: z.string().optional(),
  surface: z.enum(['dark', 'light']).optional(),
});

const articleHero = z.object({
  type: z.literal('articleHero'),
  ...base,
  eyebrow: z.string().optional(),
  headline: z.string(),
  answer: z.string(),
  meta: z.object({ updated: z.string().optional(), reviewed: z.string().optional(), readingTime: z.string().optional() }),
});

const articleBlock = z.discriminatedUnion('type', [
  z.object({ type: z.literal('h2'), id: z.string(), text: z.string(), tocLabel: z.string().optional() }),
  z.object({ type: z.literal('h3'), id: z.string().optional(), text: z.string() }),
  z.object({ type: z.literal('p'), text: z.string() }),
  z.object({ type: z.literal('ul'), items: z.array(z.string()) }),
  z.object({ type: z.literal('steps'), steps: z.array(z.object({ title: z.string(), text: z.string() })).min(3).max(7) }),
  z.object({ type: z.literal('table'), columns: z.array(z.string()).max(4), rows: z.array(z.array(z.string())).max(8), caption: z.string().optional() }),
  z.object({ type: z.literal('quote'), text: z.string(), cite: z.string().optional() }),
  z.object({ type: z.literal('callout'), variant: z.enum(['tip', 'warning', 'note']), title: z.string().optional(), text: z.string() }),
]);
const articleBody = z.object({
  type: z.literal('articleBody'),
  ...base,
  toc: z.boolean().optional(),
  tocTitle: z.string().optional(),
  blocks: z.array(articleBlock),
});

const keyTakeaways = z.object({
  type: z.literal('keyTakeaways'),
  ...base,
  heading: z.string().optional(),
  items: z.array(z.string()).min(3).max(5),
});

const inlineCta = z.object({
  type: z.literal('inlineCta'),
  ...base,
  eyebrow: z.string().optional(),
  title: z.string(),
  text: z.string(),
  href: z.string(),
  linkLabel: z.string(),
  availability,
  cta,
});

const authorReviewed = z.object({
  type: z.literal('authorReviewed'),
  ...base,
  author: z.string().optional(),
  updated: z.string(),
  reviewer: z.object({ name: z.string(), role: z.string().optional() }).optional(),
  reviewedOn: z.string().optional(),
  policyHref: z.string().optional(),
  policyLabel: z.string().optional(),
});

export const blockSchema = z.discriminatedUnion('type', [
  hero,
  workflowDiagram,
  workflowSteps,
  phaseSteps,
  controlPoints,
  featureGrid,
  beforeAfterDiff,
  requirementEvidence,
  issueFix,
  jobFeed,
  pipelineBoard,
  statusStates,
  comparisonTable,
  supportMatrix,
  limitationsCallout,
  audienceCards,
  relatedLinks,
  faq,
  finalCta,
  articleHero,
  articleBody,
  keyTakeaways,
  inlineCta,
  authorReviewed,
]);

export const pageSchema = z.object({
  /** Public URL path, e.g. "/features/resume-tailoring". "/" is the homepage. */
  path: z.string().regex(/^\/[a-z0-9\-/]*$/),
  template: z.enum(['home', 'feature', 'guide']),
  /** SEO <title> (already ends with "| SearchBreaker"). */
  title: z.string(),
  description: z.string(),
  /** Backlog page id, e.g. "P008". */
  pageId: z.string().optional(),
  /** Nav item to highlight; defaults to `path`. */
  current: z.string().optional(),
  /** Prefix for waitlist `source` values. */
  source: z.string(),
  breadcrumbs: z.array(z.object({ label: z.string(), href: z.string().optional() })).optional(),
  /** Force noindex regardless of PUBLIC_LAUNCHED (default: follow the site gate). */
  noindex: z.boolean().optional(),
  blocks: z.array(blockSchema).min(1),
});

export type Block = z.infer<typeof blockSchema>;
export type PageContent = z.infer<typeof pageSchema>;
