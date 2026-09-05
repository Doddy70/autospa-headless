import { test } from '@playwright/test';

interface Box { x: number; y: number; width: number; height: number; bottom: number; }

test('find overlapping sections', async ({ page }) => {
  await page.goto('http://localhost:3006/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for animations

  // Get all section bounding boxes
  const sections = await page.evaluate(() => {
    const all = document.querySelectorAll('section');
    return Array.from(all).map((el, i) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        index: i,
        tag: el.tagName,
        dataSection: el.getAttribute('data-section') || 'none',
        className: el.className.substring(0, 80),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        scrollY: window.scrollY,
        zIndex: style.zIndex,
        position: style.position,
      };
    });
  });

  console.log('\n=== ALL SECTIONS ===');
  sections.forEach((s, i) => {
    console.log(`\n[${i}] data-section="${s.dataSection}"`);
    console.log(`  position: ${s.position}, zIndex: ${s.zIndex}`);
    console.log(`  rect: x=${s.x}, y=${s.y}, w=${s.width}, h=${s.height}, bottom=${s.bottom}`);
  });

  // Check for overlaps
  console.log('\n=== OVERLAP CHECK ===');
  for (let i = 0; i < sections.length - 1; i++) {
    const current = sections[i]!;
    const next = sections[i + 1]!;
    const overlap = current.bottom > next.y;
    if (overlap) {
      console.log(`\n⚠️ OVERLAP: Section ${i} (bottom=${current.bottom}) overlaps Section ${i+1} (y=${next.y})`);
      console.log(`  Gap: ${current.bottom - next.y}px overlap`);
    } else {
      console.log(`\n✅ Section ${i} → ${i+1}: gap=${next.y - current.bottom}px`);
    }
  }

  // Screenshot at different scroll positions
  await page.screenshot({ path: 'test-results/overlap-debug-0.png', fullPage: true });
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/overlap-debug-1.png', fullPage: true });
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/overlap-debug-2.png', fullPage: true });

  console.log('\nScreenshots saved: overlap-debug-0.png, overlap-debug-1.png, overlap-debug-2.png');
});
