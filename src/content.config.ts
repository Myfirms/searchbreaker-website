import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pageSchema } from './lib/blocks/schemas';

/** One JSON file per page: src/content/pages/<name>.json. Validated against the block schemas at build time. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: pageSchema,
});

export const collections = { pages };
