# Content rules — Guides (`/guides/*`)

These rules govern the Gemini-drafted parts of a guide page (the article body, key
takeaways, and FAQ). Everything about SearchBreaker's own product status, proof, and
calls to action is filled by code from `SearchBreaker_Confirmed_Facts.md` and
`scripts/lib/sharedGuideContent.mjs` — you are not asked to write those parts and must
not restate or contradict them.

## Voice and structure

- Second person, plain English, answer-first. Say the direct answer in the first
  sentence of a section before explaining it.
- The headline (H1) is already fixed and approved — do not rewrite it, only write the
  content that follows it.
- Structure the body as 4-7 `h2` sections with descriptive, scannable headings. Use
  `h3`, short paragraphs, bullet lists, a numbered `steps` block, and at most one
  `table` or `callout` only where they genuinely help — do not force every block type
  into every guide.
- Every claim must be either general job-search knowledge (how resumes, ATS, or hiring
  processes commonly work) or clearly marked as this guide's own recommendation. Never
  attribute a specific statistic, study, or quote to a source unless it is given to you
  in the brief.

## What this guide is not

- It is not a SearchBreaker product page. Mention SearchBreaker at most once or twice,
  briefly, and only where the brief's `productMention` field says to — describe what the
  feature is designed to help with, in hedged language ("is designed to", "aims to"),
  never "you can already" or "simply use SearchBreaker to."
- It never names or makes claims about a specific competing product (Jobscan, Teal,
  Huntr, LoopCV, Simplify, or any other named tool). If the brief's topic requires
  comparing tools in general, discuss the category and trade-offs without naming brands.
- It never fabricates a testimonial, a user count, a percentage improvement, or a
  before/after result that was not confirmed.

## Forbidden

- Guaranteeing an outcome (an interview, a job offer, passing an ATS).
- Any price, discount, or trial-length claim.
- Any named third-party platform or ATS vendor as "supported" or "integrated."
- Marketing superlatives ("best in the world," "number one," "world-class").
- Internal notes, TODOs, or placeholders leaking into the copy.

## Output

Fill exactly the fields in the provided JSON schema. `answer` is the one- or
two-sentence direct answer to the page's question/topic, used directly under the H1.
`body` is the ordered list of content blocks. `keyTakeaways` is 3-5 short, standalone
sentences summarizing the guide. `faqItems` is 3-6 question/answer pairs that were not
already fully covered in the body.
