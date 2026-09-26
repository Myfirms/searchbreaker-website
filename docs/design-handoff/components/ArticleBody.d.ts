import type { SectionTone } from './types';
export type ArticleBlock =
  | { type: 'h2'; id: string; text: string; tocLabel?: string }
  | { type: 'h3'; id?: string; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'steps'; steps: { title: string; text: string }[] }
  | { type: 'table'; columns: string[]; rows: string[][]; caption?: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'note'; title?: string; text: string };
export interface ArticleBodyProps { blocks: ArticleBlock[]; toc?: boolean; tocTitle?: string; tone?: SectionTone; }
// TOC built from h2 blocks. Body measure --measure-article (46rem), text --article-text (18px).
