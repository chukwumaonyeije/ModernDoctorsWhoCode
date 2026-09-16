import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// All checks stay local, including forms, analytics and external tutorial fonts.
test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4321' ? route.continue() : route.abort());
});
async function showPicker(page) {
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
  return page.getByRole('combobox', { name: 'Color theme' });
}

test('system follows OS while explicit choices persist across reload and navigation', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' }); await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  const picker = await showPicker(page); await picker.selectOption('dark');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(10, 13, 26)');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.goto('/courses/'); await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await (await showPicker(page)).selectOption('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.emulateMedia({ colorScheme: 'dark' }); await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('keyboard selection and Escape retain visible focus', async ({ page }) => {
  await page.goto('/'); const picker = await showPicker(page);
  await picker.focus(); await picker.press('End'); await picker.press('Enter');
  await expect(picker).toHaveValue('dark');
  await expect(picker).toBeFocused(); await expect(picker).toHaveCSS('outline-style','solid');
  const toggle = page.getByRole('button', { name:'Toggle navigation' });
  if(await toggle.isVisible()) {
    await page.keyboard.press('Tab'); // Leave the native select popup before closing the site menu.
    await page.keyboard.press('Escape'); await expect(toggle).toHaveAttribute('aria-expanded','false'); await expect(toggle).toBeFocused();
  }
});

test('cross-tab storage changes and clearing synchronize the preference', async ({ page, context }) => {
  await page.emulateMedia({colorScheme:'light'}); await page.goto('/');
  const other = await context.newPage(); await other.goto('/');
  await (await showPicker(other)).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await other.evaluate(()=>localStorage.removeItem('dwc-theme'));
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference','system');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('denied storage still permits a current-page theme selection', async ({ page }) => {
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError')}})});
  await page.emulateMedia({colorScheme:'light'}); await page.goto('/');
  await (await showPicker(page)).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('invalid stored preference falls back to system', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('dwc-theme','invalid'));
  await page.emulateMedia({colorScheme:'light'}); await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference','system');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(248, 250, 252)');
});

test('saved dark theme is applied by the first animation frame', async ({ page }) => {
  await page.addInitScript(()=>{localStorage.setItem('dwc-theme','dark');requestAnimationFrame(()=>{window.firstFrameTheme=document.documentElement.dataset.theme})});
  await page.emulateMedia({colorScheme:'light'}); await page.goto('/');
  await expect.poll(()=>page.evaluate(()=>window.firstFrameTheme)).toBe('dark');
});

test('no-JS system theme and navigation remain usable', async ({ browser }, testInfo) => {
  for(const theme of ['light','dark']) {
    const context = await browser.newContext({javaScriptEnabled:false,colorScheme:theme,viewport:testInfo.project.use.viewport});
    await context.route('**/*',route=>new URL(route.request().url()).origin==='http://127.0.0.1:4321'?route.continue():route.abort());
    const page=await context.newPage(); await page.goto('http://127.0.0.1:4321/');
    await expect(page.locator('body')).toHaveCSS('background-color',theme==='dark'?'rgb(10, 13, 26)':'rgb(248, 250, 252)');
    await expect(page.locator('[data-theme-picker]')).toBeHidden();
    await page.locator('[data-nav-learn] > summary').click();
    await expect(page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Courses',exact:true})).toBeVisible();
    await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Courses',exact:true}).click();
    await expect(page).toHaveURL(/\/courses\/$/);
    await context.close();
  }
});

test('existing React carousel hydrates and next/previous controls change slides', async ({page})=>{
  await page.goto('/blog/inbox-detox-two-evenings-disposable-software/');
  const island=page.locator('astro-island').filter({has:page.getByRole('button',{name:'Next screenshot'})});
  await expect(island).not.toHaveAttribute('ssr','');
  const caption=island.locator('p');const first=await caption.innerText();
  await page.getByRole('button',{name:'Next screenshot'}).click();await expect(caption).not.toHaveText(first);
  await page.getByRole('button',{name:'Previous screenshot'}).click();await expect(caption).toHaveText(first);
});

test('FAQ disclosure and reduced-motion preference work',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/blog/how-doctors-learn-to-code-2026-ai-guide/');
  const detail=page.locator('details').filter({has:page.locator('.faq-icon')}).first();
  await detail.locator('summary').focus();await page.keyboard.press('Enter');await expect(detail).toHaveAttribute('open','');
  const pulse=page.locator('.live-dot').first();if(await pulse.count())await expect(pulse).toHaveCSS('animation-duration','1e-05s');
});

test('narrow article, course and archive pages do not overflow', async ({page})=>{
  await page.setViewportSize({width:320,height:900});
  for(const theme of ['light','dark']) {
    await page.emulateMedia({colorScheme:theme});
    for(const path of ['/blog/','/courses/clinical-ai-literacy/','/blog/docling-rag-tutorial/']) {
      await page.goto(path);await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme} ${path}`).toBe(true);
    }
  }
});

test('representative templates have no detected WCAG A/AA failures in either theme',async({page})=>{
  test.setTimeout(180_000);
  const routes=['/','/start/','/paths/use-ai-in-medicine/','/courses/clinical-ai-literacy/','/blog/','/blog/physician-developer-stack-mdx/','/blog/inbox-detox-two-evenings-disposable-software/','/blog/docling-rag-tutorial/','/blog/internal-mfm-scoring-optimization-engine/','/contact/'];
  const runtimeErrors=[];page.on('pageerror',error=>runtimeErrors.push(error.message));
  for(const theme of ['light','dark']) {
    await page.emulateMedia({colorScheme:theme});
    for(const path of routes) {
      await page.goto(path);await page.evaluate(()=>document.fonts.ready);
      await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme} ${path} overflow`).toBe(true);
      const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),`${theme} ${path}`).toEqual([]);
    }
  }
  expect(runtimeErrors).toEqual([]);
});
