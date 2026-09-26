import type { HeaderProps } from '../components/astro/blocks/Header.astro';
import type { FooterColumn } from '../components/astro/blocks/Footer.astro';

/** Shared site chrome. Link only to pages that are (or will be) published; update as pages ship. */
export const navItems: HeaderProps['navItems'] = [
  {
    label: 'Product',
    children: [
      { label: 'How it works', href: '/#how-it-works', description: 'The full workflow from verified profile to follow-up.', availability: 'concept' },
      { label: 'Job Finder', href: '/features/ai-job-finder', description: 'Find openings that fit your target roles.', availability: 'preview' },
      { label: 'Job Matching', href: '/features/job-matcher', description: 'Compare job requirements with your confirmed experience.', availability: 'preview' },
      { label: 'Resume Tailoring', href: '/features/resume-tailoring', description: 'Adapt your resume to each job from verified facts.', availability: 'preview' },
      { label: 'Autofill and Auto Apply', href: '/features/job-application-autofill', description: 'Fill applications from your profile. You decide when to submit.', availability: 'planned' },
      { label: 'Application Tracker', href: '/features/job-application-tracker', description: 'Every application, resume version and next step in one pipeline.', availability: 'concept' },
    ],
  },
  { label: 'Job Finder', href: '/features/ai-job-finder' },
  { label: 'Job Matching', href: '/features/job-matcher' },
  { label: 'Resume Tailoring', href: '/features/resume-tailoring' },
  { label: 'Auto Apply', href: '/features/auto-apply' },
  { label: 'Tracker', href: '/features/job-application-tracker' },
  { label: 'Resources', href: '/guides/tailor-resume-to-job-description' },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Job Finder', href: '/features/ai-job-finder' },
      { label: 'Job Matching', href: '/features/job-matcher' },
      { label: 'Resume Tailoring', href: '/features/resume-tailoring' },
      { label: 'Auto Apply', href: '/features/auto-apply' },
      { label: 'Application Tracker', href: '/features/job-application-tracker' },
    ],
  },
  { title: 'Resources', links: [{ label: 'Tailor a resume to a job description', href: '/guides/tailor-resume-to-job-description' }] },
];

export const legalLinks = [
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export const statusNote =
  'SearchBreaker is in private testing. Features marked Preview, Concept or Planned are not generally available yet.';

export const announcement = {
  text: 'SearchBreaker is in private testing. Invites go out in small groups.',
  linkLabel: 'Join the waitlist',
};
