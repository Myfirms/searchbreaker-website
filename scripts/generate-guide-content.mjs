// Generates draft `/guides/*` page content via Gemini structured output, runs
// two-tier QA (mechanical + semantic), auto-applies fixable edits, and writes
// a staged .draft.json next to the real content file plus a QA report.
// Adapted from the Octopel website's scripts/generate-content.mjs — that
// script is untouched at E:\Work\Octopel\Website\scripts\generate-content.mjs;
// this is a from-scratch port for SearchBreaker's block-based page schema,
// not a shared/imported copy.
//
// Usage:
//   node scripts/generate-guide-content.mjs                 # all "not-started" pages
//   node scripts/generate-guide-content.mjs --id=<page-id>   # a single page
import 'dotenv/config';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { buildGuideContentSchema } from './lib/guideContentSchema.mjs';
import { runLevel1Qa, level1QaIsClean } from './lib/qaChecks.mjs';
import { runSemanticQa, applyEdits } from './lib/qaSemantic.mjs';
import { buildBreadcrumbs, buildInlineCta, buildRelatedLinks, buildAuthorReviewed, estimateReadingTime, mapGeneratedBlock, SITE_TITLE_SUFFIX } from './lib/sharedGuideContent.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-3.1-pro-preview';
const MANIFEST_PATH = path.join(ROOT, 'docs/content/generation/content-manifest.json');
const RULES_PATH = path.join(ROOT, 'docs/content/generation/content-rules-guides.md');
const CONFIRMED_FACTS_PATH = path.join(ROOT, 'docs/content/generation/SearchBreaker_Confirmed_Facts.md');
const QA_REPORTS_DIR = path.join(ROOT, 'docs/content/generation/qa-reports');
// Drafts are staged OUTSIDE src/content/pages on purpose: that directory is
// globbed by content.config.ts's `pages` collection with pattern '**/*.json',
// which also matches '*.draft.json' — a draft written there would silently
// become a real, routable page (see src/pages/[...slug].astro's
// getStaticPaths, which builds a route per collection entry's `data.path`).
const PAGE_DRAFTS_DIR = path.join(ROOT, 'docs/content/generation/page-drafts');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

function buildDraftPrompt({ rulesText, confirmedFactsText, page }) {
  return `Write the body content for this SearchBreaker guide page, filling the provided JSON schema exactly. Follow the rules and the brief below.

Page identity:
- H1 (already approved, do not rewrite it): ${page.h1}
- URL: ${page.path}
- Primary keyword: ${page.primaryKeyword}

=== CONTENT RULES ===
${rulesText}

=== PRODUCT FACTS (what you may and may not say about SearchBreaker) ===
${confirmedFactsText}

=== PAGE BRIEF ===
${page.brief}

=== HOW TO MENTION THE PRODUCT ===
${page.productMention}
`;
}

async function generateDraft(ai, page, rulesText, confirmedFactsText) {
  const res = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: buildDraftPrompt({ rulesText, confirmedFactsText, page }),
    config: {
      responseMimeType: 'application/json',
      responseSchema: buildGuideContentSchema(),
      httpOptions: { timeout: 600000 },
    },
  });
  return JSON.parse(res.text);
}

function mergeFinalJson(page, draft) {
  const usedIds = new Set();
  const bodyBlocks = draft.body.map((raw) => mapGeneratedBlock(raw, usedIds));
  const today = new Date().toISOString().slice(0, 10);

  const articleHero = {
    type: 'articleHero',
    headline: page.h1,
    answer: draft.answer,
    meta: { updated: today, reviewed: today, readingTime: estimateReadingTime(bodyBlocks) },
  };

  const articleBody = { type: 'articleBody', toc: true, blocks: bodyBlocks };

  const keyTakeaways = { type: 'keyTakeaways', items: draft.keyTakeaways };

  const inlineCta = buildInlineCta(page.inlineCta);

  const faq = {
    type: 'faq',
    heading: `Questions about ${page.faqHeadingTopic}`,
    faqs: draft.faqItems.map((f) => ({ q: f.q, a: f.a })),
  };

  const relatedLinks = buildRelatedLinks(page.relatedLinks);

  const authorReviewed = buildAuthorReviewed(today);

  return {
    path: page.path,
    template: 'guide',
    title: draft.seoTitle.endsWith(SITE_TITLE_SUFFIX) ? draft.seoTitle : `${draft.seoTitle}${SITE_TITLE_SUFFIX}`,
    description: draft.seoDescription,
    pageId: page.id,
    source: page.source,
    current: page.path,
    breadcrumbs: buildBreadcrumbs(page.h1),
    blocks: [articleHero, articleBody, keyTakeaways, inlineCta, faq, relatedLinks, authorReviewed],
  };
}

async function processPage(ai, page, rulesText, confirmedFactsText) {
  console.log(`\n=== ${page.id}: ${page.path} ===`);

  console.log('Generating draft…');
  const draft = await generateDraft(ai, page, rulesText, confirmedFactsText);

  let level1 = runLevel1Qa(draft, { primaryKeyword: page.primaryKeyword, secondaryKeywords: [], confirmedFactsText });
  console.log('Level-1 QA:', level1QaIsClean(level1) ? 'clean' : JSON.stringify(level1));

  console.log('Running semantic QA…');
  const qaReport = await runSemanticQa(ai, TEXT_MODEL, { rulesText, briefText: page.brief, draftJson: draft });

  if (qaReport.requiredEdits?.length) {
    console.log(`Applying ${qaReport.requiredEdits.length} required edit(s)…`);
    const failed = applyEdits(draft, qaReport.requiredEdits);
    if (failed.length) console.warn('Could not apply edits for paths:', failed.map((e) => e.fieldPath));
    level1 = runLevel1Qa(draft, { primaryKeyword: page.primaryKeyword, secondaryKeywords: [], confirmedFactsText });
  }

  const finalJson = mergeFinalJson(page, draft);

  // Staged next to the real content file's eventual name, but under
  // page-drafts/ — never inside src/content/pages (see PAGE_DRAFTS_DIR
  // comment above). Promote by hand: review, then move+rename into
  // page.outputFile once approved.
  const draftName = path.basename(page.outputFile).replace(/\.json$/, '.draft.json');
  const outPath = path.join(PAGE_DRAFTS_DIR, draftName);
  await mkdir(PAGE_DRAFTS_DIR, { recursive: true });
  await writeFile(outPath, JSON.stringify(finalJson, null, 2) + '\n');

  await mkdir(QA_REPORTS_DIR, { recursive: true });
  const qaPath = path.join(QA_REPORTS_DIR, `${page.id}.qa.md`);
  await writeFile(qaPath, renderQaReport(page, level1, qaReport));

  // Level 2 (Gemini) only fixes what it's asked about via requiredEdits — it
  // never sees Level 1's mechanical findings, so a forbidden phrase or named
  // competitor it doesn't independently notice can survive both passes.
  // Route those to a human instead of silently marking the page ready.
  if (!level1QaIsClean(level1)) {
    page.status = 'needs-review';
    console.warn(`Level-1 QA still dirty after edits — marking needs-review:`, JSON.stringify(level1));
  } else {
    page.status = 'drafted';
  }
  console.log(`Wrote ${outPath}`);
  console.log(`QA report: ${qaPath} — overall: ${qaReport.overallStatus}`);
}

function renderQaReport(page, level1, qaReport) {
  const lines = [`# QA report — ${page.h1}`, '', `**Overall:** ${qaReport.overallStatus}`, '', `## Level 1 (mechanical)`, ''];
  lines.push(`- Forbidden phrases: ${level1.forbiddenPhrases.length}`);
  for (const h of level1.forbiddenPhrases) lines.push(`  - "${h.phrase}" in \`${h.path}\`: "${h.snippet}"`);
  lines.push(`- Internal-note leakage: ${level1.internalNoteLeakage.length}`);
  for (const h of level1.internalNoteLeakage) lines.push(`  - \`${h.path}\`: "${h.snippet}"`);
  lines.push(`- Named-competitor mentions: ${level1.competitorMentions.length}`);
  for (const h of level1.competitorMentions) lines.push(`  - "${h.name}" in \`${h.path}\`: "${h.snippet}"`);
  lines.push(`- Missing keywords: ${level1.missingKeywords.length}`);
  for (const h of level1.missingKeywords) lines.push(`  - ${h.type}: "${h.keyword}"`);
  lines.push(`- Field length issues: ${level1.fieldLengthIssues.length}`);
  for (const h of level1.fieldLengthIssues) lines.push(`  - ${h.field}: ${h.length} chars (expected ${h.expected})`);

  lines.push('', '## Level 2 (semantic)', '');
  for (const s of qaReport.sections) lines.push(`- **${s.name}**: ${s.status} — ${s.notes}`);

  lines.push('', '## Required edits applied', '');
  if (!qaReport.requiredEdits?.length) lines.push('None.');
  for (const e of qaReport.requiredEdits ?? []) lines.push(`- \`${e.fieldPath}\`: "${e.before}" → "${e.after}" (${e.reason})`);

  lines.push('', '## Summary', '', qaReport.summary, '');
  return lines.join('\n');
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const [manifest, rulesText, confirmedFactsText] = await Promise.all([
    readFile(MANIFEST_PATH, 'utf8').then(JSON.parse),
    readFile(RULES_PATH, 'utf8'),
    readFile(CONFIRMED_FACTS_PATH, 'utf8'),
  ]);

  const targets = args.id ? manifest.pages.filter((p) => p.id === args.id) : manifest.pages.filter((p) => p.status === 'not-started');

  if (!targets.length) {
    console.log('No matching pages to generate.');
    return;
  }

  for (const page of targets) {
    try {
      await processPage(ai, page, rulesText, confirmedFactsText);
    } catch (err) {
      console.error(`FAILED: ${page.id}`, err);
      page.status = 'error';
    }
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

main();
