// Gemini structured-output schema for the *generated* fields of a `/guides/*`
// page — deliberately a subset of schemas.ts's `pageSchema`/`articleBlock`.
// Everything ownership-classified as proof/status/CTA (SearchBreaker feature
// availability, waitlist wiring, related-page links, author/reviewed date)
// is intentionally absent so the model has no field to put it in — see
// scripts/lib/sharedGuideContent.mjs for those values.
//
// `articleBody.blocks` is a true discriminated union in schemas.ts, but
// Gemini's structured-output schema has no reliable polymorphic-array-item
// support, so every possible block shape is flattened into one object with a
// `kind` discriminator and mostly-optional fields; scripts/lib/
// sharedGuideContent.mjs's `mapGeneratedBlock` reshapes each one back into
// the real discriminated union afterward.
import { Type } from '@google/genai';

const BLOCK_KINDS = ['heading2', 'heading3', 'paragraph', 'bulletList', 'steps', 'table', 'quote', 'callout'];

function buildBlockSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      kind: { type: Type.STRING, enum: BLOCK_KINDS, description: 'Which of the 8 block shapes this is. Fill only the fields that shape uses; leave the rest as empty string/array.' },
      text: { type: Type.STRING, description: 'Used by heading2, heading3, paragraph, quote, callout (callout body text).' },
      tocLabel: { type: Type.STRING, description: 'heading2 only — optional short label for the table of contents if different from text. Empty string if same as text.' },
      items: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'bulletList only — 2-6 short items. Empty array otherwise.' },
      steps: {
        type: Type.ARRAY,
        description: 'steps only — 3-7 ordered steps. Empty array otherwise.',
        items: {
          type: Type.OBJECT,
          properties: { title: { type: Type.STRING }, text: { type: Type.STRING } },
          required: ['title', 'text'],
        },
      },
      tableColumns: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'table only — up to 4 column headers. Empty array otherwise.' },
      tableRows: {
        type: Type.ARRAY,
        description: 'table only — up to 8 rows, each an array of strings matching tableColumns length. Empty array otherwise.',
        items: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      tableCaption: { type: Type.STRING, description: 'table only — optional. Empty string otherwise.' },
      quoteCite: { type: Type.STRING, description: 'quote only — optional attribution. Empty string otherwise.' },
      calloutVariant: { type: Type.STRING, description: 'callout only — one of "tip", "warning", or "note". Empty string otherwise.' },
      calloutTitle: { type: Type.STRING, description: 'callout only — optional. Empty string otherwise.' },
    },
    required: ['kind', 'text', 'tocLabel', 'items', 'steps', 'tableColumns', 'tableRows', 'tableCaption', 'quoteCite', 'calloutVariant', 'calloutTitle'],
  };
}

export function buildGuideContentSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      seoTitle: { type: Type.STRING, description: 'Search title, 50-65 characters, contains the primary keyword, ends with "| SearchBreaker".' },
      seoDescription: { type: Type.STRING, description: 'Meta description, 140-160 characters, factual, states what the reader will learn.' },
      answer: {
        type: Type.STRING,
        description: 'The direct, one-to-two sentence answer to the page topic/question, shown right under the H1. Roughly 120-260 characters.',
      },
      body: {
        type: Type.ARRAY,
        description: '4-7 h2 sections worth of content as a flat ordered list of blocks (headings, paragraphs, lists, steps, at most one table/callout). Follow the brief for what to cover.',
        items: buildBlockSchema(),
      },
      keyTakeaways: {
        type: Type.ARRAY,
        description: '3-5 short, standalone sentences summarizing the guide.',
        items: { type: Type.STRING },
      },
      faqItems: {
        type: Type.ARRAY,
        description: '3-6 question/answer pairs not already fully covered in the body. Answers are 1-3 plain sentences, no HTML.',
        items: {
          type: Type.OBJECT,
          properties: { q: { type: Type.STRING }, a: { type: Type.STRING } },
          required: ['q', 'a'],
        },
      },
    },
    required: ['seoTitle', 'seoDescription', 'answer', 'body', 'keyTakeaways', 'faqItems'],
  };
}
