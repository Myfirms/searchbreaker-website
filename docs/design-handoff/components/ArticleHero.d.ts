import type { ArticleMeta, SectionTone } from './types';
export interface ArticleHeroProps { eyebrow?: string; headline: string; answer: string; meta: ArticleMeta; tone?: SectionTone; }
// H1 uses --display-compact. Aligns to the article column via container query (container-name: article).
