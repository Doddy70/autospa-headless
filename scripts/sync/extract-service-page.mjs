/**
 * Extract the service data of a production service page.
 *
 * Writes `.cache/services/<slug>.json` with the packages, the "All Includes"
 * lists and the FAQ pairs, so the curated catalogue in `src/data/services.ts`
 * can be checked against the origin.
 *
 * Usage: node scripts/sync/extract-service-page.mjs <slug> [...]
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('.cache/services');

function text(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

await mkdir(OUT, { recursive: true });

for (const slug of process.argv.slice(2)) {
  const html = await readFile(`src/content/pages/${slug}.html`, 'utf8');
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

  // --- packages ------------------------------------------------------
  // A package starts with an <h2> and runs until the next <h2>. Its name may
  // also live in the tcgelements-heading widget (the wash page).
  const packages = [];
  const blocks = body.split(/<h2[^>]*>/i).slice(1);

  for (const block of blocks) {
    const heading = text(block.slice(0, block.indexOf('</h2>')));
    if (!heading || /FAQ/i.test(heading)) continue;

    const summary = text(block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1] ?? '');
    const includes = [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((match) =>
      text(match[1]),
    );

    packages.push({ name: heading, summary, includes });
  }

  // --- faq -----------------------------------------------------------
  const faqs = [];
  const faqPart = body.slice(body.search(/FAQs?/i));
  const questions = [...faqPart.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];

  for (let index = 0; index < questions.length; index += 1) {
    const question = text(questions[index][1]);
    const start = questions[index].index ?? 0;
    const end = questions[index + 1]?.index ?? faqPart.length;
    const answer = text(faqPart.slice(start, end).replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, ''));

    if (!question || !answer) continue;
    if (/LET.S TALK|STILL HAVE QUESTION/i.test(question)) continue;

    faqs.push({ question, answer });
  }

  const result = { slug, packages, faqs };
  await writeFile(path.join(OUT, `${slug}.json`), JSON.stringify(result, null, 2));
  console.log(`${slug}: ${packages.length} packages, ${faqs.length} faqs`);
}
