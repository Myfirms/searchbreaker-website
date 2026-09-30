// Level-2 QA: a second Gemini pass auditing SEO, AEO, conversion framing, and
// honesty/claims — everything that requires understanding the text, as
// opposed to Level-1's mechanical checks. Ported from the Octopel website's
// scripts/lib/qaSemantic.mjs (see that file's history for why the section
// list looks the way it does).
import { Type } from '@google/genai';

const SECTION_NAMES = ['seo', 'aeo', 'conversion', 'factualityAndClaims', 'technicalAccuracy', 'publicCopyScrub'];

export function buildQaSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      overallStatus: { type: Type.STRING, enum: ['approved', 'approved_with_edits', 'blocked'] },
      sections: {
        type: Type.ARRAY,
        description: 'Exactly one entry per required section, in this order: seo, aeo, conversion, factualityAndClaims, technicalAccuracy, publicCopyScrub.',
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, enum: SECTION_NAMES },
            status: { type: Type.STRING, enum: ['pass', 'needs_edit', 'blocked'] },
            notes: { type: Type.STRING, description: 'One or two sentences — what was checked and why it passed/failed.' },
          },
          required: ['name', 'status', 'notes'],
        },
      },
      requiredEdits: {
        type: Type.ARRAY,
        description: 'Only concrete, directly-fixable text edits — a specific field with new wording. Do not list implementation/asset gaps here.',
        items: {
          type: Type.OBJECT,
          properties: {
            fieldPath: { type: Type.STRING, description: 'Dot/bracket path into the draft JSON, e.g. "answer" or "faqItems[2].a".' },
            before: { type: Type.STRING },
            after: { type: Type.STRING },
            reason: { type: Type.STRING },
          },
          required: ['fieldPath', 'before', 'after', 'reason'],
        },
      },
      summary: { type: Type.STRING, description: '2-4 sentences: overall verdict and what changed.' },
    },
    required: ['overallStatus', 'sections', 'requiredEdits', 'summary'],
  };
}

export function buildQaPrompt({ rulesText, briefText, draftJson }) {
  return `You are running the "SEO, AEO, Conversion and Claims QA" stage on a drafted guide-page copy. Audit the draft against the rules and the page's own brief. Be specific — cite the actual field and actual wording, not generic advice. Only propose requiredEdits for things you can fix by rewriting a specific field's text; do not invent implementation, media, or routing gaps.

Pay special attention to factualityAndClaims: this product is pre-launch with no
pricing, no testimonials, and no named third-party integrations — flag anything that
implies otherwise, and flag any guaranteed-outcome language or named competitor.

=== CONTENT RULES ===
${rulesText}

=== PAGE BRIEF ===
${briefText}

=== DRAFT JSON TO AUDIT ===
${JSON.stringify(draftJson, null, 2)}
`;
}

function setByPath(obj, path, value) {
  const tokens = path.match(/[^.[\]]+/g) ?? [];
  let cur = obj;
  for (let i = 0; i < tokens.length - 1; i++) {
    const key = /^\d+$/.test(tokens[i]) ? Number(tokens[i]) : tokens[i];
    if (cur[key] === undefined) return false;
    cur = cur[key];
  }
  const lastKey = /^\d+$/.test(tokens[tokens.length - 1]) ? Number(tokens[tokens.length - 1]) : tokens[tokens.length - 1];
  if (cur[lastKey] === undefined) return false;
  cur[lastKey] = value;
  return true;
}

/** Applies requiredEdits in place; returns the list of edits that could not be applied (unknown path). */
export function applyEdits(draft, requiredEdits) {
  const failed = [];
  for (const edit of requiredEdits) {
    const ok = setByPath(draft, edit.fieldPath, edit.after);
    if (!ok) failed.push(edit);
  }
  return failed;
}

export async function runSemanticQa(ai, model, { rulesText, briefText, draftJson }) {
  const res = await ai.models.generateContent({
    model,
    contents: buildQaPrompt({ rulesText, briefText, draftJson }),
    config: {
      responseMimeType: 'application/json',
      responseSchema: buildQaSchema(),
      httpOptions: { timeout: 600000 },
    },
  });
  return JSON.parse(res.text);
}
