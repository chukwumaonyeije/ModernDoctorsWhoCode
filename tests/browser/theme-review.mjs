import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const output = 'test-results/theme-review';
const origin = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:4321';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined), headless: true });
const routes = ['/', '/start/', '/paths/use-ai-in-medicine/', '/courses/clinical-ai-literacy/', '/blog/', '/blog/physician-developer-stack-mdx/', '/blog/inbox-detox-two-evenings-disposable-software/', '/blog/docling-rag-tutorial/', '/blog/internal-mfm-scoring-optimization-engine/', '/contact/'];
const results = [];
try {
  for (const theme of ['light','dark']) {
    const context = await browser.newContext({ colorScheme: theme });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [320,375,768,1440]) {
      await page.setViewportSize({width, height:900});
      for (const route of routes) {
        errors.length = 0;
        await page.goto(origin+route);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))));
        const facts = await page.evaluate(() => ({ theme:document.documentElement.dataset.theme, background:getComputedStyle(document.body).backgroundColor, overflow:document.documentElement.scrollWidth>innerWidth+1, offenders:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&getComputedStyle(e).position!=='absolute'}).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right})) }));
        let violations=[];
        if(width===375||width===1440) {
          const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
          violations=scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))}));
        }
        results.push({route,width,theme,...facts,errors:[...errors],violations});
        if ((route==='/'||route.includes('docling')||route.includes('inbox-detox')) && (width===375||width===1440)) await page.screenshot({path:`${output}/${theme}-${width}-${route==='/'?'home':route.split('/')[2]}.png`,fullPage:false});
        console.log(theme,width,route,'overflow',facts.overflow,'errors',errors.length,'axe',violations.map(v=>v.id).join(','));
      }
    }
    await context.close();
  }
} finally { await browser.close(); await writeFile(`${output}/report.json`,JSON.stringify(results,null,2)); }
if (results.some(result => result.overflow || result.errors.length || result.violations.length)) process.exitCode = 1;
