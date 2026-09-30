# SearchBreaker — Confirmed Facts (content generation)

Single source of truth for what generated copy is allowed to say about SearchBreaker
itself. Gemini never sees this file's "Avoid" table directly claim-by-claim — it is
compiled into the forbidden-phrase list by `scripts/lib/qaChecks.mjs` at generation
time (any row marked `R` below). Keep this file in sync with `src/lib/blocks/schemas.ts`'s
`availability` enum and with the actual status of each feature page.

## Product status (2026-09-29)

SearchBreaker is pre-launch. No feature is publicly live. Never write copy that implies
a feature can be used today, that a user has used it, or that it has a track record.

| Feature | Path | Status | What copy may say |
|---|---|---|---|
| Job search automation | `/features/job-search-automation` | Preview | Describes what the feature is designed to do; may reference the waitlist |
| AI job finder | `/features/ai-job-finder` | Preview | Same as above |
| Job matcher | `/features/job-matcher` | Preview | Same as above |
| Resume tailoring | `/features/resume-tailoring` | Preview | Same as above |
| ATS resume optimizer | `/features/ats-resume-optimizer` | Concept | Describes the intended approach; do not imply it is testable today |
| Job application tracker | `/features/job-application-tracker` | Concept | Same as above |
| Job application autofill | `/features/job-application-autofill` | Planned | Describes the intended approach only; no claim of current capability |
| Auto-apply | `/features/auto-apply` | Planned | Same as above |

The exact availability badge and CTA (waitlist vs. live) for every feature reference is
filled by code from this table (see `scripts/lib/sharedGuideContent.mjs`), never by the
model — a generated page must never invent or restate a different status.

## Company facts

- No pricing has been published. Never state or imply a price, a free tier, a trial
  length, or a discount.
- No customer testimonials, reviews, case studies, or user-count statistics exist.
  Every guide is written from first principles and general job-search knowledge, not
  from claimed SearchBreaker outcomes.
- SearchBreaker has no confirmed integration with any named third-party platform
  (LinkedIn, Indeed, Workday, Greenhouse, Lever, or any ATS vendor). Never name a
  specific platform as supported.
- "Auto-apply" and "autofill" always mean the candidate reviews and approves before
  anything is submitted, unless a specific page's brief says otherwise. Never describe
  either as fully unattended.
- ATS ("applicant tracking system") behavior cannot be fully verified from the outside;
  never claim a method "guarantees" passing any ATS or scoring system.

## Claims to avoid (auto-extracted; `R` rows become forbidden phrases)

| Claim | Status |
|---|---|
| guaranteed interview | R |
| guaranteed job offer | R |
| guaranteed hire | R |
| guaranteed to get hired | R |
| 100% success rate | R |
| 100% ats pass | R |
| ats-proof | R |
| beats any ats | R |
| always beats the ats | R |
| never miss a job | R |
| unlimited applications | R |
| fully automatic with no review | R |
| no human review needed | R |
| thousands of users | R |
| millions of users | R |
| trusted by | R |
| used by professionals at | R |
| as seen in | R |
| free forever | R |
| free trial | R |
| lowest price | R |
| best in the world | R |
| number one | R |
| world-class | R |
| top-notch | R |
| instantly get hired | R |
| get hired overnight | R |
| skip the interview | R |
| 24/7 support | R |
| our customers say | R |
| verified results | R |
