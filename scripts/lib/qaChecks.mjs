// Level-1 QA: deterministic, code-only checks that never rely on a model
// "noticing" something. Run against the raw Gemini draft (before merging in
// the code-filled proof/CTA fields from sharedGuideContent.mjs), so those
// legitimate strings are never scanned/flagged.
// Adapted from the Octopel website's scripts/lib/qaChecks.mjs.

// Base prohibited-wording list — see
// docs/content/generation/SearchBreaker_Confirmed_Facts.md "Company facts"
// for why each of these is off-limits for a pre-launch, no-pricing,
// no-testimonials product. Extended at runtime with every `R` row from that
// file's "Claims to avoid" table, so this list can't silently drift from it.
const BASE_FORBIDDEN = [
  'guaranteed',
  '100% success',
  'ats-proof',
  'free trial',
  'lowest price',
  'best in the world',
  'number one',
  'world-class',
  'top-notch',
  '24/7',
  'as seen in',
];

export function extractRetiredClaims(confirmedFactsText) {
  const retired = [];
  const rowRe = /^\|\s*(.+?)\s*\|\s*R\s*\|/gm;
  let m;
  while ((m = rowRe.exec(confirmedFactsText))) {
    const claim = m[1].replace(/`/g, '').trim();
    if (claim && claim.length < 60) retired.push(claim.toLowerCase());
  }
  return retired;
}

export function buildForbiddenList(confirmedFactsText) {
  const retired = extractRetiredClaims(confirmedFactsText);
  return [...new Set([...BASE_FORBIDDEN, ...retired].map((s) => s.toLowerCase()))];
}

function walkStrings(value, pathPrefix, cb) {
  if (typeof value === 'string') {
    cb(pathPrefix, value);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walkStrings(v, `${pathPrefix}[${i}]`, cb));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walkStrings(v, pathPrefix ? `${pathPrefix}.${k}` : k, cb);
  }
}

export function scanForbiddenPhrases(draft, forbiddenList) {
  const hits = [];
  walkStrings(draft, '', (path, text) => {
    const lower = text.toLowerCase();
    for (const phrase of forbiddenList) {
      if (lower.includes(phrase)) hits.push({ path, phrase, snippet: text.slice(0, 140) });
    }
  });
  return hits;
}

const INTERNAL_NOTE_PATTERNS = [/\bpending\b/i, /\brecheck\b/i, /\bbefore launch\b/i, /\btodo\b/i, /\bplaceholder\b/i, /\bnot yet confirmed\b/i, /\binternal note\b/i, /\bdo not render\b/i];

export function scanInternalNoteLeakage(draft) {
  const hits = [];
  walkStrings(draft, '', (path, text) => {
    for (const pattern of INTERNAL_NOTE_PATTERNS) {
      if (pattern.test(text)) hits.push({ path, pattern: pattern.source, snippet: text.slice(0, 140) });
    }
  });
  return hits;
}

// A named competitor mentioned in a plain guide (not an /alternatives or
// /compare page) is a factual claim we have not verified — see content-
// rules-guides.md "What this guide is not." "teal" and "simplify" are
// deliberately excluded: both are ordinary English words (a color, a verb)
// that collide constantly with legitimate copy ("simplify your resume
// format") — see docs/content/generation/qa-reports/P025.qa.md for a real
// instance. The semantic QA pass (qaSemantic.mjs) already checks for named
// competitors with actual context understanding; a human reviews the report
// regardless, so this list stays restricted to names that are not also
// dictionary words.
const COMPETITOR_NAMES = ['jobscan', 'huntr', 'loopcv', 'careerflow', 'jobright', 'jobcopilot', 'lazyapply', 'resumly', 'aiapply'];

export function scanCompetitorMentions(draft) {
  const hits = [];
  walkStrings(draft, '', (path, text) => {
    const lower = text.toLowerCase();
    for (const name of COMPETITOR_NAMES) {
      if (new RegExp(`\\b${name}\\b`, 'i').test(lower)) hits.push({ path, name, snippet: text.slice(0, 140) });
    }
  });
  return hits;
}

// A raw short-tail keyword ("how to get resume past ats") rarely survives
// into natural copy verbatim — good writing inserts "your", "the", etc.
// ("How to Get Your Resume Past ATS"). Requiring the exact phrase flagged
// that as a false positive (see qa-reports/P022.qa.md); checking that every
// significant word shows up somewhere still catches a genuinely off-topic
// page without penalizing normal grammar.
const STOPWORDS = new Set(['a', 'an', 'the', 'to', 'your', 'you', 'is', 'in', 'of', 'for', 'and', 'or', 'on', 'at', 'my']);

function keywordWords(keyword) {
  return keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

export function checkKeywordPresence(draft, primaryKeyword, secondaryKeywords = []) {
  const allText = [];
  walkStrings(draft, '', (_path, text) => allText.push(text));
  const haystack = allText.join(' \n ').toLowerCase();

  const isPresent = (keyword) => {
    if (haystack.includes(keyword.toLowerCase())) return true;
    const words = keywordWords(keyword);
    return words.length > 0 && words.every((w) => haystack.includes(w));
  };

  const missing = [];
  if (primaryKeyword && !isPresent(primaryKeyword)) missing.push({ type: 'primary', keyword: primaryKeyword });
  for (const kw of secondaryKeywords) {
    if (!isPresent(kw)) missing.push({ type: 'secondary', keyword: kw });
  }
  return missing;
}

const SOFT_LENGTH_BOUNDS = {
  seoTitle: [35, 65],
  seoDescription: [110, 170],
};

export function checkFieldLengths(draft) {
  const issues = [];
  for (const [field, [min, max]] of Object.entries(SOFT_LENGTH_BOUNDS)) {
    const value = draft[field];
    if (typeof value !== 'string') continue;
    if (value.length < min || value.length > max) {
      issues.push({ field, length: value.length, expected: `${min}-${max}` });
    }
  }
  return issues;
}

/** Runs every Level-1 check and returns a single report object. */
export function runLevel1Qa(draft, { primaryKeyword, secondaryKeywords, confirmedFactsText }) {
  const forbiddenList = buildForbiddenList(confirmedFactsText);
  return {
    forbiddenPhrases: scanForbiddenPhrases(draft, forbiddenList),
    internalNoteLeakage: scanInternalNoteLeakage(draft),
    competitorMentions: scanCompetitorMentions(draft),
    missingKeywords: checkKeywordPresence(draft, primaryKeyword, secondaryKeywords),
    fieldLengthIssues: checkFieldLengths(draft),
  };
}

export function level1QaIsClean(report) {
  return (
    report.forbiddenPhrases.length === 0 &&
    report.internalNoteLeakage.length === 0 &&
    report.competitorMentions.length === 0 &&
    report.missingKeywords.length === 0 &&
    report.fieldLengthIssues.length === 0
  );
}
