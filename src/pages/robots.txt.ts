/** Mirrors BaseLayout's PUBLIC_LAUNCHED gate: pre-launch, disallow everything;
 * post-launch, fall back to the real crawl rules. */
const SITE_LAUNCHED = import.meta.env.PUBLIC_LAUNCHED === 'true';

const body = SITE_LAUNCHED
  ? `User-agent: *\nDisallow: /internal/\n\nSitemap: https://searchbreaker.com/sitemap-index.xml\n`
  : `User-agent: *\nDisallow: /\n`;

export async function GET() {
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
