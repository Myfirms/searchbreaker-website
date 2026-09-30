// Code-filled (non-generated) fields shared across every generated guide page.
// Gemini never sees or writes these — proof, availability status, and CTA
// wiring come only from this file and SearchBreaker_Confirmed_Facts.md, so a
// generated page can never invent or drift a feature's status. See
// docs/content/generation/SearchBreaker_Confirmed_Facts.md for the source of
// truth this mirrors.

export const FEATURES = {
  'job-search-automation': {
    href: '/features/job-search-automation',
    label: 'Job search automation',
    blurb: 'One system for finding, matching, and tracking roles.',
    availability: 'preview',
  },
  'ai-job-finder': {
    href: '/features/ai-job-finder',
    label: 'AI job finder',
    blurb: 'Surfaces roles worth your time from across sources.',
    availability: 'preview',
  },
  'job-matcher': {
    href: '/features/job-matcher',
    label: 'Job matcher',
    blurb: 'Map requirements to your evidence before you apply.',
    availability: 'preview',
  },
  'resume-tailoring': {
    href: '/features/resume-tailoring',
    label: 'Resume tailoring in SearchBreaker',
    blurb: 'Proposed edits linked to your verified facts.',
    availability: 'preview',
  },
  'ats-resume-optimizer': {
    href: '/features/ats-resume-optimizer',
    label: 'ATS resume optimizer',
    blurb: 'Checks keyword and formatting gaps against a job description.',
    availability: 'concept',
  },
  'job-application-tracker': {
    href: '/features/job-application-tracker',
    label: 'Job application tracker',
    blurb: 'One pipeline for every application and its next action.',
    availability: 'concept',
  },
  'job-application-autofill': {
    href: '/features/job-application-autofill',
    label: 'Job application autofill',
    blurb: 'Fills application forms from your profile for you to review.',
    availability: 'planned',
  },
  'auto-apply': {
    href: '/features/auto-apply',
    label: 'Auto-apply',
    blurb: 'Submits applications you approve, not a mass-blast.',
    availability: 'planned',
  },
};

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** ~200 wpm, rounded up, minimum 3 minutes for a real guide. */
export function estimateReadingTime(articleBodyBlocks) {
  const words = articleBodyBlocks
    .map((b) => {
      if (b.type === 'p' || b.type === 'quote') return b.text;
      if (b.type === 'h2' || b.type === 'h3') return b.text;
      if (b.type === 'ul') return b.items.join(' ');
      if (b.type === 'steps') return b.steps.map((s) => `${s.title} ${s.text}`).join(' ');
      if (b.type === 'table') return b.rows.flat().join(' ');
      if (b.type === 'callout') return `${b.title ?? ''} ${b.text}`;
      return '';
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/** Maps one flat model-generated block (see guideContentSchema.mjs) to a
 * discriminated `articleBlock` matching schemas.ts. Generates h2/h3 ids by
 * slugifying the heading text — the model is not trusted to produce valid,
 * unique anchor ids. */
export function mapGeneratedBlock(raw, usedIds) {
  switch (raw.kind) {
    case 'heading2': {
      const id = uniqueId(slugify(raw.text), usedIds);
      return { type: 'h2', id, text: raw.text, ...(raw.tocLabel ? { tocLabel: raw.tocLabel } : {}) };
    }
    case 'heading3':
      return { type: 'h3', id: uniqueId(slugify(raw.text), usedIds), text: raw.text };
    case 'paragraph':
      return { type: 'p', text: raw.text };
    case 'bulletList':
      return { type: 'ul', items: raw.items };
    case 'steps':
      return { type: 'steps', steps: raw.steps };
    case 'table':
      return { type: 'table', columns: raw.tableColumns, rows: raw.tableRows, ...(raw.tableCaption ? { caption: raw.tableCaption } : {}) };
    case 'quote':
      return { type: 'quote', text: raw.text, ...(raw.quoteCite ? { cite: raw.quoteCite } : {}) };
    case 'callout': {
      const variant = ['tip', 'warning', 'note'].includes(raw.calloutVariant) ? raw.calloutVariant : 'note';
      return { type: 'callout', variant, text: raw.text, ...(raw.calloutTitle ? { title: raw.calloutTitle } : {}) };
    }
    default:
      throw new Error(`Unknown generated block kind: ${raw.kind}`);
  }
}

function uniqueId(base, usedIds) {
  let id = base;
  let i = 2;
  while (usedIds.has(id)) id = `${base}-${i++}`;
  usedIds.add(id);
  return id;
}

export function buildBreadcrumbs(h1) {
  return [{ label: 'Home', href: '/' }, { label: h1 }];
}

/** cta.readiness is always 'waitlist' — nothing in the product is publicly
 * live yet, regardless of a feature's preview/concept/planned maturity. */
export function buildInlineCta({ featureSlug, title, text, linkLabel }) {
  const feature = FEATURES[featureSlug];
  if (!feature) throw new Error(`Unknown feature "${featureSlug}"`);
  return {
    type: 'inlineCta',
    title,
    text,
    href: feature.href,
    linkLabel,
    availability: feature.availability,
    cta: { readiness: 'waitlist' },
  };
}

export function buildRelatedLinks({ heading = 'Related', items }) {
  return {
    type: 'relatedLinks',
    tone: 'muted',
    heading,
    items: items.map((item) => {
      if (item.featureSlug) {
        const feature = FEATURES[item.featureSlug];
        if (!feature) throw new Error(`Unknown feature "${item.featureSlug}"`);
        return { kind: 'related', label: feature.label, href: feature.href, blurb: feature.blurb, availability: feature.availability };
      }
      return { kind: item.kind ?? 'guide', label: item.label, href: item.href, blurb: item.blurb };
    }),
  };
}

export function buildAuthorReviewed(dateIso) {
  return { type: 'authorReviewed', updated: dateIso };
}

export const SITE_TITLE_SUFFIX = ' | SearchBreaker';
