import { test } from '@playwright/test';

interface SectionInfo {
  index: number;
  tag: string;
  dataSection: string;
  className: string;
  rectY: number;
  rectHeight: number;
  rectBottom: number;
  marginTop: number;
  marginBottom: number;
  paddingTop: number;
  paddingBottom: number;
  scrollHeight: number;
}

interface ContainerChild {
  index: number;
  tag: string;
  className: string;
  rectY: number;
  rectHeight: number;
  rectBottom: number;
  position: string;
  marginTop: string;
  marginBottom: string;
}

test('measure all sections gap analysis', async ({ page }) => {
  await page.goto('http://localhost:3006/');
  await page.waitForLoadState('networkidle');

  // Measure every section
  const analysis: SectionInfo[] = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const results: SectionInfo[] = [];

    sections.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);

      results.push({
        index: i,
        tag: el.tagName,
        dataSection: el.getAttribute('data-section') || 'none',
        className: el.className.substring(0, 100),
        rectY: Math.round(rect.y),
        rectHeight: Math.round(rect.height),
        rectBottom: Math.round(rect.bottom),
        marginTop: parseFloat(computed.marginTop),
        marginBottom: parseFloat(computed.marginBottom),
        paddingTop: parseFloat(computed.paddingTop),
        paddingBottom: parseFloat(computed.paddingBottom),
        scrollHeight: el.scrollHeight,
      });
    });

    return results;
  });

  console.log('\n=== SECTION GAP ANALYSIS ===');
  analysis.forEach((s, i) => {
    const next = analysis[i + 1];
    const gap = next ? next.rectY - s.rectBottom : 'N/A';
    console.log(`\n[${s.index}] data-section="${s.dataSection}"`);
    console.log(`  rect: y=${s.rectY}, height=${s.rectHeight}, bottom=${s.rectBottom}`);
    console.log(`  margin: top=${s.marginTop}, bottom=${s.marginBottom}`);
    console.log(`  padding: top=${s.paddingTop}, bottom=${s.paddingBottom}`);
    if (next) console.log(`  GAP to next: ${gap}px`);
  });

  // Check main children
  const containerInfo: ContainerChild[] = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return [];
    const children = Array.from(main.children);
    return children.map((el, i) => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      return {
        index: i,
        tag: el.tagName,
        className: el.className.substring(0, 100),
        rectY: Math.round(rect.y),
        rectHeight: Math.round(rect.height),
        rectBottom: Math.round(rect.bottom),
        position: computed.position,
        marginTop: computed.marginTop,
        marginBottom: computed.marginBottom,
      };
    });
  });

  console.log('\n=== MAIN CHILDREN ===');
  containerInfo.forEach((c) => {
    console.log(`[${c.index}] ${c.tag}: y=${c.rectY}, height=${c.rectHeight}, bottom=${c.rectBottom}, position=${c.position}`);
  });

  await page.screenshot({ path: 'test-results/debug-gap-analysis.png', fullPage: true });
});

test('check autoSpaFeatures cards grid layout', async ({ page }) => {
  await page.goto('http://localhost:3006/');
  await page.waitForLoadState('networkidle');

  // Scroll to features section
  const features = page.locator('[data-section="autospa-features"]');
  await features.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Get section position
  const sectionBox = await features.boundingBox();
  console.log('\n=== FEATURES SECTION ===');
  console.log('Section position:', sectionBox);

  // Get grid position
  const grid = page.locator('.autospa-features__grid').first();
  const gridBox = await grid.boundingBox();
  console.log('Grid position:', gridBox);

  // Get all cards
  const cardCount = await page.locator('.autospa-features__card').count();
  console.log('Card count:', cardCount);

  for (let i = 0; i < cardCount; i++) {
    const card = page.locator('.autospa-features__card').nth(i);
    const box = await card.boundingBox();
    console.log(`Card ${i}: y=${box?.y}, h=${box?.height}, bottom=${box ? box.y + box.height : 'N/A'}`);
  }

  // Screenshot
  await page.screenshot({ path: 'test-results/debug-features-grid.png', fullPage: true });
});
